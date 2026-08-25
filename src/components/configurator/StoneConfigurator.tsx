import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  STONE_OPTIONS,
  SHAPE_OPTIONS,
  LEG_STYLE_OPTIONS,
  getValidLegCounts,
  getValidLegStyles,
  getSizeRange,
  getDefaultSize,
  getSizeRangeFor,
  getDefaultSizeFor,
  PRODUCT_TYPE_OPTIONS,
  PLINTH_SHAPES,
  getProductType,
  type LegCount,
  type ProductType,
} from './options';
import type { RuleShape, RuleLegStyle } from '@/lib/configurator/rules/productRules';
import { ConfiguratorViewerV3 } from './ConfiguratorViewerV3';
import { DesignAppointmentBlock } from '@/components/DesignAppointment';
import { stateToViewerProps } from './stateMapping';
import { computeRange, getEntryPrice } from './pricing';
import { Slider } from '@/components/ui/slider';

const FINISHES = [
  { id: 'gepolijst' as const, label: 'Gepolijst', extra: '' },
  { id: 'gezoet'    as const, label: 'Gezoet',    extra: '' },
];

// --- Deep-links voor campagnes -----------------------------------------
// Marketinglinks kunnen een configuratie voorselecteren, bijv. vanuit een
// Instagram-video die een specifieke tafel toont:
//   /atelier?steen=viola&vorm=rond&lengte=1300
// Nederlandse aliassen en canonieke ids werken allebei; ongeldige waarden
// vallen terug op de standaard zodat een kapotte link de pagina nooit breekt.
const STONE_ALIASES: Record<string, string> = {
  'travertijn': 'classic-cloudy',
  'classic-cloudy': 'classic-cloudy',
  'tiramisu': 'tiramisu',
  'light-emperador': 'light-emprador',
  'light-emprador': 'light-emprador',
  'dark-emperador': 'dark-emperador',
  'viola': 'calacatta-viola',
  'calacatta-viola': 'calacatta-viola',
};

const PRODUCT_ALIASES: Record<string, ProductType> = {
  'eettafel': 'eettafel', 'dining': 'eettafel',
  'salontafel': 'salontafel', 'coffee': 'salontafel', 'sokkel': 'salontafel',
  'bijzettafel': 'bijzettafel', 'side': 'bijzettafel',
  'kubus': 'bijzettafel', 'blok': 'bijzettafel',
};

const SHAPE_ALIASES: Record<string, RuleShape> = {
  'rond': 'round', 'round': 'round',
  'ovaal': 'ovale', 'ovale': 'ovale',
  'ellips': 'ellips',
  'rechthoek': 'corner', 'corner': 'corner',
};

function readInitialConfig() {
  const p = new URLSearchParams(window.location.search);
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = p.get(k);
      if (v) return v.toLowerCase();
    }
    return null;
  };

  const stoneId = STONE_ALIASES[get('steen', 'stoneId') ?? ''] ?? 'classic-cloudy';
  const productType: ProductType =
    PRODUCT_ALIASES[get('type', 'productType') ?? ''] ?? 'eettafel';
  let shape: RuleShape = SHAPE_ALIASES[get('vorm', 'shape') ?? ''] ?? 'corner';
  // Een sokkel is alleen rechthoekig of rond leverbaar.
  if (productType === 'salontafel' && !PLINTH_SHAPES.includes(shape)) shape = 'corner';

  const range = getSizeRangeFor(productType, shape);
  const def = getDefaultSizeFor(productType, shape);
  const num = (raw: string | null, fallback: number, min: number, max: number) => {
    const n = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const lengthMm = num(get('lengte', 'lengthMm'), def.lengthMm, range.length.min, range.length.max);
  const widthMm = range.diameterOnly
    ? lengthMm
    : num(get('breedte', 'widthMm'), def.widthMm, range.width.min, range.width.max);

  const validCounts = getValidLegCounts(shape);
  const countParsed = parseInt(get('poten', 'legCount') ?? '', 10);
  const legCount: LegCount = (validCounts as number[]).includes(countParsed)
    ? (countParsed as LegCount)
    : validCounts.includes(2) ? 2 : validCounts[0];

  const styleRaw = get('pootstijl', 'legStyle') ?? '';
  const validStyles = getValidLegStyles(shape, legCount).map((o) => o.id as string);
  const legStyle: RuleLegStyle = validStyles.includes(styleRaw)
    ? (styleRaw as RuleLegStyle)
    : 'cylindrical';

  const finish = get('afwerking', 'finish') === 'gezoet' ? ('gezoet' as const) : ('gepolijst' as const);

  return { productType, stoneId, shape, lengthMm, widthMm, legCount, legStyle, finish };
}

const sectionLabel = 'block text-[11px] uppercase tracking-[0.15em] text-sera-text-soft mb-3';
const pillBase = 'px-4 py-2.5 text-xs uppercase tracking-[0.1em] border rounded-sm transition-colors';
const pillSelected = 'bg-sera-surface text-sera-inverted border-sera-surface';
const pillIdle = 'bg-transparent text-sera-text border-sera-text-soft/30 hover:border-sera-surface';

// --- "Anders" per optiegroep -------------------------------------------
// Het aanbod in de configurator is een selectie, niet de hele catalogus.
// Bij elke groep kan de klant "Anders" kiezen en een wens achterlaten; die
// notitie reist mee naar het aanvraagdossier. De reguliere keuze blijft
// staan, zodat de 3D-weergave en de prijsindicatie blijven werken.
export const NOTE_KEYS = ['steen', 'vorm', 'formaat', 'poten', 'pootstijl', 'afwerking'] as const;
export type NoteKey = (typeof NOTE_KEYS)[number];
type Notes = Partial<Record<NoteKey, string>>;

const NOTE_PLACEHOLDER: Record<NoteKey, string> = {
  steen: 'Bijv. Statuario, Nero Marquina, of een steen die u elders zag',
  vorm: 'Beschrijf de gewenste vorm',
  formaat: 'Bijv. 300 × 120 cm, of een afwijkende hoogte',
  poten: 'Beschrijf het gewenste aantal of de plaatsing',
  pootstijl: 'Beschrijf het gewenste onderstel',
  afwerking: 'Bijv. geborsteld, of een specifieke randafwerking',
};

const NOTE_MAX = 300;

function OtherOption({
  groupKey,
  value,
  onChange,
}: {
  groupKey: NoteKey;
  value: string | undefined;
  onChange: (key: NoteKey, text: string | undefined) => void;
}) {
  const isOpen = value !== undefined;
  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => onChange(groupKey, isOpen ? undefined : '')}
        className={`${pillBase} ${isOpen ? pillSelected : pillIdle}`}
      >
        Anders
      </button>

      {isOpen && (
        <div className="w-full mt-4">
          <label htmlFor={`note-${groupKey}`} className="sr-only">
            Uw wens voor {groupKey}
          </label>
          <textarea
            id={`note-${groupKey}`}
            autoFocus
            rows={3}
            maxLength={NOTE_MAX}
            value={value}
            onChange={(e) => onChange(groupKey, e.target.value.slice(0, NOTE_MAX))}
            placeholder={NOTE_PLACEHOLDER[groupKey]}
            className="w-full max-w-md bg-transparent border border-sera-text-soft/30 focus:border-sera-surface rounded-sm p-3 text-sm text-sera-text placeholder:text-sera-text-soft/60 outline-none resize-none"
          />
          <div className="flex justify-between max-w-md mt-1">
            <span className="text-[11px] text-sera-text-soft">
              Wij nemen dit mee in uw persoonlijke voorstel.
            </span>
            <span className="text-[11px] text-sera-text-soft tabular-nums">
              {(value ?? '').length}/{NOTE_MAX}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default function StoneConfigurator() {
  const navigate = useNavigate();
  // Zonder URL-parameters start dit op de instap-steen (classic-cloudy) zodat
  // de eerste prijsindicatie het laagste eerlijke bedrag toont; campagnelinks
  // kunnen via readInitialConfig een specifieke tafel voorselecteren.
  const [initial]                 = useState(readInitialConfig);
  const [productType, setProductType] = useState<ProductType>(initial.productType);
  const [stoneId, setStoneId]     = useState<string>(initial.stoneId);
  const [shape, setShape]         = useState<RuleShape>(initial.shape);
  const [lengthMm, setLengthMm]   = useState<number>(initial.lengthMm);
  const [widthMm, setWidthMm]     = useState<number>(initial.widthMm);
  const [legCount, setLegCount]   = useState<LegCount>(initial.legCount);
  const [legStyle, setLegStyle]   = useState<RuleLegStyle>(initial.legStyle);
  const [finish, setFinish]       = useState<'gepolijst' | 'gezoet'>(initial.finish);
  const [notes, setNotes]         = useState<Notes>({});

  const setNote = (key: NoteKey, text: string | undefined) =>
    setNotes((prev) => {
      const next = { ...prev };
      if (text === undefined) delete next[key];
      else next[key] = text;
      return next;
    });

  // Een ingevulde notitie telt pas mee als er ook echt tekst staat.
  const filledNotes = (Object.entries(notes) as [NoteKey, string][]).filter(
    ([, v]) => v.trim().length > 0
  );
  // Bij een afwijkende steenwens blijft de indicatie staan; hij hoort dan wel
  // gelezen te worden als "op basis van de geselecteerde steen", zodat het
  // bedrag niet als prijs voor de gevraagde steen wordt opgevat.
  const stoneIsCustom = (notes.steen ?? '').trim().length > 0;
  const selectedStoneLabel = STONE_OPTIONS.find((s) => s.id === stoneId)?.label ?? 'de gekozen steen';

  useEffect(() => {
    const valid = getValidLegCounts(shape);
    if (!valid.includes(legCount)) {
      setLegCount(valid[0]);
    }
  }, [shape]);

  useEffect(() => {
    const valid = getValidLegStyles(shape, legCount);
    const stillValid = valid.some(o => o.id === legStyle);
    if (!stillValid) {
      // Expliciete fallback: 'cylindrical' is een pedestal-stijl en
      // dus geldig bij elke (shape, legCount) combinatie. Niet leunen
      // op array-volgorde van getValidLegStyles.
      setLegStyle('cylindrical');
    }
  }, [shape, legCount]);

  // Vormwissel-fallback voor afmetingen: alleen resetten naar de default
  // van de nieuwe vorm wanneer minstens één dimensie buiten de nieuwe
  // range valt. Geldige waarden (bijv. 2000×1000 dat past in zowel
  // Rechthoek als Ovaal) blijven behouden. Analoog aan de legStyle-logica.
  useEffect(() => {
    const r = getSizeRangeFor(productType, shape);
    const lengthOk = lengthMm >= r.length.min && lengthMm <= r.length.max;
    const widthOk  = widthMm  >= r.width.min  && widthMm  <= r.width.max;
    if (!lengthOk || !widthOk) {
      const def = getDefaultSizeFor(productType, shape);
      setLengthMm(def.lengthMm);
      setWidthMm(def.widthMm);
    } else if (r.diameterOnly && widthMm !== lengthMm) {
      // Rond: width altijd gelijk aan diameter (=length)
      setWidthMm(lengthMm);
    }
  }, [shape, productType]);

  const product = getProductType(productType);
  const isPlinth = product.base === 'plinth';
  const validLegCounts = getValidLegCounts(shape);
  const validLegStyles = getValidLegStyles(shape, legCount);
  const sizeRange = getSizeRangeFor(productType, shape);
  // Een sokkel is alleen rechthoekig of rond leverbaar.
  const shapeChoices = isPlinth
    ? SHAPE_OPTIONS.filter((o) => PLINTH_SHAPES.includes(o.id))
    : SHAPE_OPTIONS;

  // Wisselen van productsoort: vorm en maat naar iets geldigs brengen.
  useEffect(() => {
    if (isPlinth && !PLINTH_SHAPES.includes(shape)) {
      setShape('corner');
      return;
    }
    const r = getSizeRangeFor(productType, shape);
    if (lengthMm < r.length.min || lengthMm > r.length.max ||
        widthMm < r.width.min || widthMm > r.width.max) {
      const def = getDefaultSizeFor(productType, shape);
      setLengthMm(def.lengthMm);
      setWidthMm(def.widthMm);
    }
  }, [productType]);

  const range = computeRange({ productType, stoneId, lengthMm, widthMm, legCount, finish });

  // Instapprijs van deze productsoort, berekend uit dezelfde prijsfunctie.
  // Zo ziet een bezoeker met een kleiner budget dat er een bereikbare optie
  // is, zonder dat er ergens een los "vanaf"-bedrag hardcoded staat dat kan
  // verouderen.
  const smallestRange = getSizeRangeFor(productType, isPlinth ? 'corner' : shape);
  const entryPrice = getEntryPrice(productType, {
    lengthMm: smallestRange.length.min,
    widthMm: smallestRange.width.min,
  });

  return (
    <div className="bg-sera-bg text-sera-text">
      {/* 1. Heading */}
      <h1 className="font-serif text-3xl md:text-5xl text-sera-text leading-tight mb-4">
        Configureer uw natuurstenen tafel op maat
      </h1>

      {/* 2. Subtitle */}
      <p className="text-base md:text-lg text-sera-text-soft leading-relaxed mb-8 max-w-3xl">
        Kies steensoort, formaat en onderstel. U ziet direct een transparante vanaf-prijs voor uw configuratie.
      </p>

      <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-12 lg:items-start">
        {/* 5. 3D viewer, sticky on desktop */}
        <div className="mb-12 lg:mb-0 lg:sticky lg:top-32 lg:self-start">
          <ConfiguratorViewerV3
            {...stateToViewerProps({ stoneId, shape, lengthMm, widthMm, legStyle, heightMm: product.heightMm })}
            base={product.base}
            className="w-full aspect-[4/3] max-h-[calc(100vh-10rem)] bg-sera-bg-deep rounded-sm"
          />
        </div>

        {/* Controls column */}
        <div>
      {/* 5b. PRODUCTSOORT */}
      <div className="mb-12">
        <span className={sectionLabel}>Type tafel</span>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPE_OPTIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProductType(p.id)}
              className={`${pillBase} ${productType === p.id ? pillSelected : pillIdle}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {isPlinth && (
          <p className="text-xs text-sera-text-soft mt-3 max-w-md">
            {productType === 'bijzettafel'
              ? 'Een compact blok naast de bank of stoel. Massief uitgevoerd, zonder onderstel.'
              : 'Onze salontafel is een massieve sokkel: het blok zelf is de tafel, zonder onderstel.'}
          </p>
        )}
      </div>

      {/* 6. STEEN */}
      <div className="mb-12">
        <span className={sectionLabel}>Steen</span>
        <div className="flex flex-wrap gap-4">
          {STONE_OPTIONS.map((s) => {
            const selected = stoneId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStoneId(s.id)}
                className="flex flex-col items-center text-center gap-2"
              >
                <div
                  className={`w-16 h-16 rounded-sm overflow-hidden border ${
                    selected ? 'ring-1 ring-sera-surface ring-offset-2 ring-offset-sera-bg border-sera-surface' : 'border-sera-text-soft/30'
                  }`}
                >
                  <img
                    src={s.texture}
                    alt={s.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-[11px] text-sera-text-soft">{s.label}</div>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <OtherOption groupKey="steen" value={notes.steen} onChange={setNote} />
        </div>
      </div>

      {/* 8. VORM */}
      <div className="mb-12">
        <span className={sectionLabel}>Vorm</span>
        <div className="flex flex-wrap gap-2">
          {shapeChoices.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setShape(s.id)}
              className={`${pillBase} ${shape === s.id ? pillSelected : pillIdle}`}
            >
              {s.label}
            </button>
          ))}
          <OtherOption groupKey="vorm" value={notes.vorm} onChange={setNote} />
        </div>
      </div>

      {/* 9. FORMAAT */}
      <div className="mb-12">
        <span className={sectionLabel}>Formaat</span>
        <div className="space-y-6 max-w-md">
          {sizeRange.diameterOnly ? (
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs uppercase tracking-[0.1em] text-sera-text-soft">Diameter</span>
                <span className="text-sm text-sera-text tabular-nums">{lengthMm} mm</span>
              </div>
              <Slider
                min={sizeRange.length.min}
                max={sizeRange.length.max}
                step={sizeRange.step}
                value={[lengthMm]}
                onValueChange={([v]) => { setLengthMm(v); setWidthMm(v); }}
              />
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs uppercase tracking-[0.1em] text-sera-text-soft">Lengte</span>
                  <span className="text-sm text-sera-text tabular-nums">{lengthMm} mm</span>
                </div>
                <Slider
                  min={sizeRange.length.min}
                  max={sizeRange.length.max}
                  step={sizeRange.step}
                  value={[lengthMm]}
                  onValueChange={([v]) => setLengthMm(v)}
                />
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs uppercase tracking-[0.1em] text-sera-text-soft">Breedte</span>
                  <span className="text-sm text-sera-text tabular-nums">{widthMm} mm</span>
                </div>
                <Slider
                  min={sizeRange.width.min}
                  max={sizeRange.width.max}
                  step={sizeRange.step}
                  value={[widthMm]}
                  onValueChange={([v]) => setWidthMm(v)}
                />
              </div>
            </>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <OtherOption groupKey="formaat" value={notes.formaat} onChange={setNote} />
          </div>
        </div>
      </div>

      {/* 10. AANTAL POTEN, hide when only one option or when plinth */}
      {!isPlinth && validLegCounts.length > 1 && (
        <div className="mb-12">
          <span className={sectionLabel}>Aantal poten</span>
          <div className="flex flex-wrap gap-2">
            {validLegCounts.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setLegCount(c)}
                className={`${pillBase} min-w-[60px] ${legCount === c ? pillSelected : pillIdle}`}
              >
                {c}
              </button>
            ))}
            <OtherOption groupKey="poten" value={notes.poten} onChange={setNote} />
          </div>
        </div>
      )}

      {/* 11. POOTSTIJL, niet van toepassing op een sokkel */}
      {!isPlinth && (
      <div className="mb-12">
        <span className={sectionLabel}>Pootstijl</span>
        <div className="flex flex-wrap gap-2">
          {validLegStyles.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setLegStyle(o.id)}
              className={`${pillBase} ${legStyle === o.id ? pillSelected : pillIdle}`}
            >
              {o.label}
            </button>
          ))}
          <OtherOption groupKey="pootstijl" value={notes.pootstijl} onChange={setNote} />
        </div>
      </div>
      )}

      {/* 12. AFWERKING */}
      <div className="mb-12">
        <span className={sectionLabel}>Afwerking</span>
        <div className="flex flex-wrap gap-2">
          {FINISHES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFinish(f.id)}
              className={`${pillBase} ${finish === f.id ? pillSelected : pillIdle}`}
            >
              {f.label}
              {f.extra && <span className="ml-2 opacity-70 normal-case tracking-normal">{f.extra}</span>}
            </button>
          ))}
          <OtherOption groupKey="afwerking" value={notes.afwerking} onChange={setNote} />
        </div>
      </div>

      <div className="border-t border-sera-text-soft/20 pt-8 pb-8">
        <span className="block text-[11px] uppercase tracking-[0.15em] text-sera-text-soft mb-3">
          Indicatie
        </span>
        <div className="font-serif text-3xl text-sera-text">
          €{range.low.toLocaleString('nl-NL')} – €{range.high.toLocaleString('nl-NL')}
        </div>
        <p className="text-sm text-sera-text mt-3 font-medium">
          Alles inbegrepen: BTW, transport &amp; plaatsing.
        </p>
        <p className="text-sm text-sera-text-soft mt-2 max-w-md">
          Vrijblijvend. Uw exacte prijs ontvangt u in een persoonlijk voorstel,
          afgestemd op de gekozen slab, afwerking en levering.
        </p>
        {stoneIsCustom && (
          <p className="text-sm text-sera-text-soft mt-2 max-w-md">
            Deze indicatie is berekend op {selectedStoneLabel}. Voor de door u gevraagde steen
            ontvangt u de prijs in uw voorstel.
          </p>
        )}
        {range.low > entryPrice && (
          <p className="text-xs text-sera-text-soft mt-4">
            Al vanaf €{entryPrice.toLocaleString('nl-NL')} in een kleiner formaat.
          </p>
        )}
        {!stoneIsCustom && filledNotes.length > 0 && (
          <p className="text-sm text-sera-text-soft mt-2 max-w-md">
            Uw aanvullende wensen zijn nog niet in dit bedrag verwerkt; wij rekenen ze mee in
            het voorstel.
          </p>
        )}
      </div>

      {/* 15. CTA */}
      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams({
            productType,
            stoneId,
            shape,
            lengthMm: String(lengthMm),
            widthMm: String(widthMm),
            legCount: String(legCount),
            legStyle,
            finish,
          });
          // Afwijkende wensen als losse parameters, zodat het voorstel ze
          // per optiegroep kan tonen en meesturen in het dossier.
          for (const [key, text] of filledNotes) {
            params.set(`wens_${key}`, text.trim());
          }
          navigate(`/voorstel?${params.toString()}`);
        }}
        className="w-full md:w-auto md:px-12 py-4 mt-6 bg-sera-surface text-sera-inverted hover:bg-sera-text text-xs uppercase tracking-[0.15em] rounded-sm transition-colors"
      >
        Start uw aanvraag →
      </button>

      <DesignAppointmentBlock isNL={true} source="configurator" className="mt-10" />
        </div>
      </div>
    </div>
  );
}
