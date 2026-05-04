import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tierStructure, type CategoryKey, type TierKey } from "@/config/tiers";

// ============================================
// GA4 helper
// ============================================
function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", name, params);
}

// ============================================
// Pricing data
// ============================================
const STONE_SURCHARGES: Record<string, number> = {
  "Travertijn Classico": 0,
  "Light Emperador": 0,
  "Statuario": 500,
  "Calacatta Viola": 500,
  "Nero Marquina": 500,
  "Statuario Extra": 0,
};

const BASE_SURCHARGES: Record<string, number> = {
  "Recht stalen onderstel": 0,
  "Stalen onderstel zwart": 0,
  "Stalen onderstel wit": 0,
  "Centrale kolom": 150,
  "Recht stalen frame": 0,
  "Massieve marmer voet": 300,
  "Conische marmer poten": 450,
  "Bronzen onderstel": 300,
  "Gegoten staal": 600,
  "Brons": 300,
  "Premium staal": 200,
  "Gegoten bronzen voet": 0,
  "Gegoten bronzen voet (premium)": 450,
};

// CSS marble textures per stone — used in preview + swatches
const STONE_TEXTURES: Record<string, { surface: string; label: string; tone: "light" | "dark" }> = {
  "Travertijn Classico": {
    label: "Travertijn Classico",
    tone: "light",
    surface: `
      radial-gradient(ellipse at 20% 30%, rgba(180,150,110,0.35), transparent 55%),
      radial-gradient(ellipse at 75% 70%, rgba(160,130,95,0.30), transparent 60%),
      repeating-linear-gradient(95deg, rgba(140,110,80,0.10) 0px, rgba(140,110,80,0.10) 1px, transparent 1px, transparent 9px),
      linear-gradient(135deg, #ece1cc 0%, #e3d3b6 50%, #d8c6a4 100%)
    `,
  },
  "Light Emperador": {
    label: "Light Emperador",
    tone: "dark",
    surface: `
      radial-gradient(ellipse at 30% 25%, rgba(220,180,110,0.40), transparent 50%),
      radial-gradient(ellipse at 70% 75%, rgba(90,55,30,0.55), transparent 55%),
      repeating-linear-gradient(115deg, rgba(255,210,140,0.08) 0px, rgba(255,210,140,0.08) 2px, transparent 2px, transparent 14px),
      linear-gradient(135deg, #6b4a2f 0%, #8a6238 45%, #a87a47 100%)
    `,
  },
  "Calacatta Viola": {
    label: "Calacatta Viola",
    tone: "light",
    surface: `
      radial-gradient(ellipse at 25% 30%, rgba(170,130,60,0.40), transparent 45%),
      radial-gradient(ellipse at 80% 65%, rgba(110,90,120,0.45), transparent 50%),
      linear-gradient(112deg, transparent 38%, rgba(120,90,40,0.55) 39%, rgba(160,120,60,0.7) 41%, transparent 43%),
      linear-gradient(118deg, transparent 58%, rgba(80,70,90,0.5) 59%, rgba(120,100,130,0.65) 60%, transparent 62%),
      linear-gradient(105deg, transparent 72%, rgba(140,100,50,0.4) 73%, transparent 75%),
      linear-gradient(135deg, #f7f2e8 0%, #efe6d2 50%, #e8dcc0 100%)
    `,
  },
  "Statuario": {
    label: "Statuario",
    tone: "light",
    surface: `
      linear-gradient(110deg, transparent 35%, rgba(80,80,90,0.35) 36%, transparent 38%),
      linear-gradient(120deg, transparent 65%, rgba(70,70,80,0.30) 66%, transparent 68%),
      linear-gradient(135deg, #f6f3ee 0%, #ede8df 100%)
    `,
  },
  "Nero Marquina": {
    label: "Nero Marquina",
    tone: "dark",
    surface: `
      linear-gradient(110deg, transparent 30%, rgba(240,235,225,0.7) 31%, rgba(240,235,225,0.5) 33%, transparent 35%),
      linear-gradient(125deg, transparent 60%, rgba(230,225,215,0.5) 61%, transparent 63%),
      linear-gradient(135deg, #1a1a1a 0%, #232323 100%)
    `,
  },
  "Statuario Extra": {
    label: "Statuario Extra",
    tone: "light",
    surface: `
      linear-gradient(108deg, transparent 40%, rgba(90,90,100,0.25) 41%, transparent 43%),
      linear-gradient(118deg, transparent 70%, rgba(70,70,80,0.20) 71%, transparent 73%),
      linear-gradient(135deg, #faf8f3 0%, #f1ece1 100%)
    `,
  },
};

type Size = { label: string; surcharge: number };

const ESSENZA_DINING_SIZES: Size[] = [
  { label: "160x80", surcharge: 0 },
  { label: "180x90", surcharge: 200 },
  { label: "200x100", surcharge: 400 },
];
const SIGNATURE_DINING_SIZES: Size[] = [
  { label: "200x100", surcharge: 0 },
  { label: "220x100", surcharge: 300 },
  { label: "240x110", surcharge: 600 },
];
const ATELIER_DINING_SIZES: Size[] = [
  { label: "200x100", surcharge: 0 },
  { label: "220x100", surcharge: 300 },
  { label: "240x110", surcharge: 600 },
];
const COFFEE_SIZES: Size[] = [
  { label: "80x80", surcharge: 0 },
  { label: "100x60", surcharge: 100 },
  { label: "120x70", surcharge: 200 },
];

type Finish = { id: string; label: string; description: string; surcharge: number };
const FINISHES: Finish[] = [
  { id: "polished", label: "Gepolijst", description: "Klassiek glanzend", surcharge: 0 },
  { id: "honed", label: "Gezoet", description: "Matte zijdezachte finish", surcharge: 150 },
  { id: "brushed", label: "Geborsteld", description: "Rustiek lederen touch", surcharge: 250 },
];

// ============================================
// Helpers
// ============================================
function formatEUR(value: number): string {
  return `€${value.toLocaleString("nl-NL")}`;
}
function formatSurcharge(value: number): string {
  if (value === 0) return "+€0";
  return `+${formatEUR(value)}`;
}
function parseSize(label: string): { w: number; d: number } {
  const [w, d] = label.split("x").map((n) => parseInt(n, 10));
  return { w, d };
}

// ============================================
// Component
// ============================================
export interface StoneConfiguratorProps {
  category: CategoryKey;
  tier?: TierKey;
  allowTierSwitch?: boolean;
  productName?: string;
  className?: string;
}

export function StoneConfigurator({
  category,
  tier: initialTier = "essenza",
  allowTierSwitch = true,
  productName,
  className,
}: StoneConfiguratorProps) {
  const [tier, setTier] = useState<TierKey>(initialTier);
  const tierConfig = tierStructure[category][tier];

  const sizes =
    category === "diningTables"
      ? tier === "essenza"
        ? ESSENZA_DINING_SIZES
        : tier === "signature"
          ? SIGNATURE_DINING_SIZES
          : ATELIER_DINING_SIZES
      : COFFEE_SIZES;

  const [stone, setStone] = useState<string>(tierConfig.stones[0]);
  const [size, setSize] = useState<Size>(sizes[0]);
  const [base, setBase] = useState<string>(tierConfig.bases[0]);
  const [finish, setFinish] = useState<Finish>(FINISHES[0]);

  useEffect(() => {
    if (!tierConfig.stones.includes(stone as never)) setStone(tierConfig.stones[0]);
    if (!tierConfig.bases.includes(base as never)) setBase(tierConfig.bases[0]);
    if (!sizes.find((s) => s.label === size.label)) setSize(sizes[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    gaEvent("configurator_started", { category, tier, product_name: productName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTierChange = (next: TierKey) => {
    if (next === tier) return;
    setTier(next);
    gaEvent("tier_selected", { category, tier: next });
  };

  const stoneSurcharge = STONE_SURCHARGES[stone] ?? 0;
  const baseSurcharge = BASE_SURCHARGES[base] ?? 0;
  const total =
    tierConfig.priceFrom + stoneSurcharge + size.surcharge + baseSurcharge + finish.surcharge;

  // Animated total
  const [displayedTotal, setDisplayedTotal] = useState(total);
  useEffect(() => {
    const start = displayedTotal;
    const end = total;
    const duration = 450;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayedTotal(Math.round(start + (end - start) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const requestUrl = useMemo(() => {
    const params = new URLSearchParams({
      subject: "configuratie",
      product: productName ?? (category === "diningTables" ? "Eettafel" : "Koffietafel"),
      tier: tierConfig.name,
      stone,
      size: size.label,
      base,
      finish: finish.label,
      total: String(total),
    });
    return `/aanvraag?${params.toString()}`;
  }, [productName, category, tierConfig.name, stone, size.label, base, finish.label, total]);

  // Visual table dimensions (proportional)
  const dims = parseSize(size.label);
  const maxDim = category === "diningTables" ? 240 : 120;
  const previewW = (dims.w / maxDim) * 78; // % width in preview
  const previewH = (dims.d / maxDim) * 50; // % height
  const texture = STONE_TEXTURES[stone] ?? STONE_TEXTURES["Travertijn Classico"];

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12">
        {/* ============ LEFT: VISUAL PREVIEW ============ */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#0d0d0d] via-[#111] to-[#1a1a1a] border border-white/5">
            {/* spotlight */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse 60% 45% at 50% 35%, rgba(201,169,110,0.10), transparent 70%)",
              }}
            />
            {/* floor reflection band */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Table top-down silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                key={`${stone}-${size.label}`}
                className="relative animate-fade-in transition-all duration-500"
                style={{
                  width: `${previewW}%`,
                  height: `${previewH}%`,
                  minWidth: "32%",
                  minHeight: "18%",
                }}
              >
                {/* drop shadow plate */}
                <div
                  className="absolute -inset-x-2 -bottom-3 top-3 blur-xl opacity-70"
                  style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85), transparent 70%)" }}
                />
                {/* marble surface */}
                <div
                  className="absolute inset-0 rounded-[2px] ring-1 ring-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] transition-all duration-700"
                  style={{ backgroundImage: texture.surface, backgroundSize: "cover" }}
                >
                  {/* sheen */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.06) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* dimension overlay */}
            <div className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.3em] text-white/50">
              Top view · {size.label.replace("x", " × ")} cm
            </div>

            {/* Stone name */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]/80 mb-1">
                Steensoort
              </p>
              <p className="font-serif text-2xl md:text-3xl text-white">{texture.label}</p>
              <div className="mt-3 h-px w-12 bg-[#c9a96e]/60" />
            </div>
          </div>

          {/* live total — desktop sticky under preview */}
          <div className="hidden lg:block mt-6 p-6 bg-[#0d0d0d] border border-white/5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
              Uw configuratie
            </p>
            <p className="font-serif text-4xl text-white tracking-tight tabular-nums">
              {formatEUR(displayedTotal)}
            </p>
            <p className="text-[11px] text-white/40 mt-2">
              Inclusief white-glove levering. Exclusief BTW.
            </p>
            <Button asChild variant="atelier" size="lg" className="w-full mt-5">
              <Link
                to={requestUrl}
                onClick={() =>
                  gaEvent("configurator_completed", {
                    category, tier, stone, size: size.label, base, finish: finish.label, total,
                  })
                }
              >
                Aanvraag starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* ============ RIGHT: OPTIONS ============ */}
        <div className="space-y-10">
          {/* TIER SELECTOR */}
          {allowTierSwitch && (
            <div>
              <SectionLabel>Niveau</SectionLabel>
              <div className="grid grid-cols-3 gap-2">
                {(["essenza", "signature", "atelier"] as TierKey[]).map((t) => {
                  const cfg = tierStructure[category][t];
                  if (!cfg) return null;
                  const active = tier === t;
                  const isSig = t === "signature";
                  return (
                    <div key={t} className="relative">
                      {isSig && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 text-[8px] tracking-[0.2em] bg-[#c9a96e] text-black whitespace-nowrap">
                          ★ MEEST GEKOZEN
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTierChange(t)}
                        className={cn(
                          "w-full px-3 py-3 text-center border transition-all duration-300 rounded-sm",
                          active
                            ? "bg-foreground text-background border-[#c9a96e]"
                            : "bg-transparent text-foreground/70 border-foreground/15 hover:border-foreground/40 hover:text-foreground",
                        )}
                      >
                        <span className="block text-[10px] uppercase tracking-[0.2em]">
                          {isSig && "★ "}{cfg.name}
                        </span>
                        <span className={cn("block mt-1 font-serif text-sm", active ? "text-[#c9a96e]" : "text-foreground/80")}>
                          {formatEUR(cfg.priceFrom)}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 italic">{tierConfig.description}.</p>
            </div>
          )}

          {/* STEENSOORT — swatches */}
          <div>
            <SectionLabel>Steensoort</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {tierConfig.stones.map((s) => {
                const tex = STONE_TEXTURES[s];
                const selected = stone === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStone(s)}
                    aria-label={s}
                    title={s}
                    className={cn(
                      "relative w-[60px] h-[60px] rounded-md overflow-hidden transition-all duration-300",
                      "ring-offset-2 ring-offset-background",
                      selected
                        ? "ring-2 ring-[#c9a96e] scale-105"
                        : "ring-1 ring-foreground/10 hover:ring-foreground/30",
                    )}
                    style={{ backgroundImage: tex?.surface, backgroundSize: "cover" }}
                  >
                    <span className="sr-only">{s}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm font-serif text-foreground">
              {stone} <span className="text-muted-foreground text-[11px] font-sans tracking-wider ml-2">{formatSurcharge(stoneSurcharge)}</span>
            </p>
          </div>

          {/* AFMETING */}
          <div>
            <SectionLabel>Afmeting</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((sz) => {
                const selected = size.label === sz.label;
                return (
                  <button
                    key={sz.label}
                    type="button"
                    onClick={() => setSize(sz)}
                    className={cn(
                      "px-3 py-3 text-center border transition-all duration-300 rounded-sm",
                      selected
                        ? "bg-foreground text-background border-[#c9a96e]"
                        : "bg-transparent border-foreground/15 hover:border-foreground/40 text-foreground/80",
                    )}
                  >
                    <span className="block font-serif text-sm">{sz.label.replace("x", " × ")} cm</span>
                    <span className={cn("block mt-1 text-[10px] tracking-wider", selected ? "text-[#c9a96e]" : "text-muted-foreground")}>
                      {formatSurcharge(sz.surcharge)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AFWERKING */}
          <div>
            <SectionLabel>Afwerking</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {FINISHES.map((f) => {
                const selected = finish.id === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFinish(f)}
                    className={cn(
                      "px-3 py-3 text-left border transition-all duration-300 rounded-sm",
                      selected
                        ? "bg-foreground text-background border-[#c9a96e]"
                        : "bg-transparent border-foreground/15 hover:border-foreground/40 text-foreground/80",
                    )}
                  >
                    <span className="block font-serif text-sm">{f.label}</span>
                    <span className={cn("block text-[10px] mt-0.5 italic", selected ? "text-background/70" : "text-muted-foreground")}>
                      {f.description}
                    </span>
                    <span className={cn("block mt-1 text-[10px] tracking-wider", selected ? "text-[#c9a96e]" : "text-muted-foreground")}>
                      {formatSurcharge(f.surcharge)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ONDERSTEL */}
          <div>
            <SectionLabel>Onderstel</SectionLabel>
            <div className="space-y-2">
              {tierConfig.bases.map((b) => {
                const surcharge = BASE_SURCHARGES[b] ?? 0;
                const selected = base === b;
                const isAtelierLocked = tier === "atelier";
                return (
                  <button
                    key={b}
                    type="button"
                    disabled={isAtelierLocked}
                    onClick={() => !isAtelierLocked && setBase(b)}
                    className={cn(
                      "w-full flex items-center justify-between border px-4 py-3 text-left transition-all duration-300 rounded-sm",
                      selected
                        ? "border-[#c9a96e] bg-foreground/5"
                        : "border-foreground/10 hover:border-foreground/30",
                      isAtelierLocked && "cursor-not-allowed opacity-90",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn(
                        "inline-block w-2 h-2 rounded-full transition-colors",
                        selected ? "bg-[#c9a96e]" : "bg-foreground/30",
                      )} />
                      <span className="text-sm text-foreground">{b}</span>
                      {isAtelierLocked && (
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#c9a96e]/70 ml-1">inbegrepen</span>
                      )}
                    </span>
                    <span className="text-[11px] text-muted-foreground tracking-wider">
                      {formatSurcharge(surcharge)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MOBILE TOTAL + CTA */}
          <div className="lg:hidden p-6 bg-[#0d0d0d] border border-white/5 -mx-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
              Uw configuratie
            </p>
            <p className="font-serif text-4xl text-white tracking-tight tabular-nums">
              {formatEUR(displayedTotal)}
            </p>
            <p className="text-[11px] text-white/40 mt-2">
              Inclusief white-glove levering. Exclusief BTW.
            </p>
            <Button asChild variant="atelier" size="lg" className="w-full mt-5">
              <Link
                to={requestUrl}
                onClick={() =>
                  gaEvent("configurator_completed", {
                    category, tier, stone, size: size.label, base, finish: finish.label, total,
                  })
                }
              >
                Aanvraag starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]/80">{children}</span>
      <span className="h-px flex-1 bg-foreground/10" />
    </div>
  );
}
