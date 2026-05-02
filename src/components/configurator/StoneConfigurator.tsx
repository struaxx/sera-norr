import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tierStructure, type CategoryKey, type TierKey } from "@/config/tiers";

// ============================================
// Pricing data
// ============================================

const STONE_SURCHARGES: Record<string, number> = {
  "Travertijn Classico": 0,
  "Light Emperador": 0,
  "Statuario": 500,
  "Calacatta Viola": 2500,
  "Nero Marquina": 500,
};

const STONE_SWATCHES: Record<string, { bg: string; ring: string }> = {
  "Travertijn Classico": { bg: "bg-[#E8DFD0]", ring: "ring-[#C9BBA6]" },
  "Light Emperador":     { bg: "bg-[#A89484]", ring: "ring-[#8A7868]" },
  "Statuario":           { bg: "bg-[#F2EFE9]", ring: "ring-[#CFC9BD]" },
  "Calacatta Viola":     { bg: "bg-[#7A6478]", ring: "ring-[#5C4A5C]" },
  "Nero Marquina":       { bg: "bg-[#2A2A2A]", ring: "ring-[#111111]" },
};

const BASE_SURCHARGES: Record<string, number> = {
  "Recht stalen onderstel": 0,
  "Centrale kolom": 200,
  "Recht stalen frame": 0,
  "Massieve marmer voet": 300,
  "Conische marmer poten": 450,
  "Bronzen onderstel": 800,
  "Gegoten staal": 600,
  "Brons": 400,
  "Premium staal": 250,
};

type Size = { label: string; surcharge: number };

const DINING_SIZES: Size[] = [
  { label: "180x90", surcharge: 0 },
  { label: "200x100", surcharge: 200 },
  { label: "220x100", surcharge: 400 },
  { label: "240x110", surcharge: 700 },
];

const COFFEE_SIZES: Size[] = [
  { label: "80x80", surcharge: 0 },
  { label: "100x60", surcharge: 150 },
  { label: "120x70", surcharge: 300 },
];

// ============================================
// Helpers
// ============================================

function formatEUR(value: number): string {
  // Dutch format: 3.500
  return `€${value.toLocaleString("nl-NL")}`;
}

function formatSurcharge(value: number): string {
  if (value === 0) return "+€0";
  return `+${formatEUR(value)}`;
}

// ============================================
// Component
// ============================================

export interface StoneConfiguratorProps {
  category: CategoryKey;          // "diningTables" | "coffeeTables"
  tier: TierKey;                  // "essenza" | "signature"
  productName?: string;           // Used for the request URL
  className?: string;
}

const STEP_LABELS = ["Steensoort", "Formaat", "Onderstel"] as const;

export function StoneConfigurator({
  category,
  tier,
  productName,
  className,
}: StoneConfiguratorProps) {
  const tierConfig = tierStructure[category][tier];
  const sizes = category === "diningTables" ? DINING_SIZES : COFFEE_SIZES;

  const [stone, setStone] = useState<string>(tierConfig.stones[0]);
  const [size, setSize] = useState<Size>(sizes[0]);
  const [base, setBase] = useState<string>(tierConfig.bases[0]);

  const stoneSurcharge = STONE_SURCHARGES[stone] ?? 0;
  const baseSurcharge = BASE_SURCHARGES[base] ?? 0;
  const total = tierConfig.priceFrom + stoneSurcharge + size.surcharge + baseSurcharge;

  const requestUrl = useMemo(() => {
    const params = new URLSearchParams({
      subject: "configuratie",
      product: productName ?? (category === "diningTables" ? "Eettafel" : "Koffietafel"),
      tier: tierConfig.name,
      stone,
      size: size.label,
      base,
      total: String(total),
    });
    return `/contact?${params.toString()}`;
  }, [productName, category, tierConfig.name, stone, size.label, base, total]);

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-foreground mb-3">
          {tierConfig.name} — vanaf {formatEUR(tierConfig.priceFrom)}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
          Stel uw configuratie samen
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg">
          {tierConfig.description}.
        </p>
      </div>

      {/* ============ STAP 1: STEENSOORT ============ */}
      <Step number={1} title={STEP_LABELS[0]}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tierConfig.stones.map((s) => {
            const swatch = STONE_SWATCHES[s] ?? { bg: "bg-secondary", ring: "ring-foreground/20" };
            const surcharge = STONE_SURCHARGES[s] ?? 0;
            const selected = stone === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStone(s)}
                className={cn(
                  "group relative text-left border transition-all duration-300",
                  selected
                    ? "border-foreground"
                    : "border-foreground/10 hover:border-foreground/30",
                )}
              >
                <div
                  className={cn(
                    "aspect-[4/3] w-full relative overflow-hidden",
                    swatch.bg,
                  )}
                >
                  {/* subtle inner ring for depth */}
                  <div className={cn("absolute inset-0 ring-1 ring-inset", swatch.ring, "opacity-30")} />
                  {selected && (
                    <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div className="px-3 py-3">
                  <p className="text-sm text-foreground leading-tight">{s}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {formatSurcharge(surcharge)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Step>

      {/* ============ STAP 2: FORMAAT ============ */}
      <Step number={2} title={STEP_LABELS[1]}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sizes.map((sz) => {
            const selected = size.label === sz.label;
            return (
              <button
                key={sz.label}
                type="button"
                onClick={() => setSize(sz)}
                className={cn(
                  "border px-4 py-4 text-left transition-all duration-300",
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/10 hover:border-foreground/30 text-foreground",
                )}
              >
                <p className="font-serif text-lg leading-none">{sz.label}</p>
                <p
                  className={cn(
                    "text-[11px] mt-2",
                    selected ? "text-background/70" : "text-muted-foreground",
                  )}
                >
                  cm · {formatSurcharge(sz.surcharge)}
                </p>
              </button>
            );
          })}
        </div>
      </Step>

      {/* ============ STAP 3: ONDERSTEL ============ */}
      <Step number={3} title={STEP_LABELS[2]}>
        <div className="space-y-2">
          {tierConfig.bases.map((b) => {
            const surcharge = BASE_SURCHARGES[b] ?? 0;
            const selected = base === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setBase(b)}
                className={cn(
                  "w-full flex items-center justify-between border px-4 py-3 text-left transition-all duration-300",
                  selected
                    ? "border-foreground"
                    : "border-foreground/10 hover:border-foreground/30",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-4 h-4 rounded-full border transition-colors",
                      selected ? "border-foreground bg-foreground" : "border-foreground/30",
                    )}
                  >
                    {selected && <Check className="w-2.5 h-2.5 text-background" />}
                  </span>
                  <span className="text-sm text-foreground">{b}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {formatSurcharge(surcharge)}
                </span>
              </button>
            );
          })}
        </div>
      </Step>

      {/* ============ TOTAL + CTA ============ */}
      <div className="mt-10 pt-8 border-t border-foreground/10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Jouw configuratie
            </p>
            <p className="font-serif text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
              {formatEUR(total)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-2">
              Inclusief white-glove levering. Levertijd 12–16 weken.
            </p>
          </div>
          <Button asChild variant="atelier" size="lg">
            <Link to={requestUrl}>
              Vraag deze configuratie aan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Step wrapper
// ============================================

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-foreground">
          Stap {number}
        </span>
        <span className="h-px flex-1 bg-foreground/10" />
        <span className="font-serif text-base text-foreground">{title}</span>
      </div>
      {children}
    </section>
  );
}
