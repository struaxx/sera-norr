import { useState, useEffect } from 'react';
import {
  STONE_OPTIONS,
  SHAPE_OPTIONS,
  LEG_STYLE_OPTIONS,
  getValidLegCounts,
  getValidLegStyles,
  type LegCount,
} from './options';
import type { RuleShape, RuleLegStyle } from '@/lib/configurator/rules/productRules';
import { ConfiguratorViewerV3 } from './ConfiguratorViewerV3';
import { stateToViewerProps } from './stateMapping';

const FINISHES = [
  { id: 'gepolijst' as const,  label: 'Gepolijst',  extra: '' },
  { id: 'gezoet' as const,     label: 'Gezoet',     extra: '+€200' },
  { id: 'geborsteld' as const, label: 'Geborsteld', extra: '+€150' },
];

interface SizePreset {
  label: string;
  lengthMm: number;
  widthMm: number;
}

const RECT_PRESETS: SizePreset[] = [
  { label: '200 × 100 cm', lengthMm: 2000, widthMm: 1000 },
  { label: '220 × 100 cm', lengthMm: 2200, widthMm: 1000 },
  { label: '240 × 100 cm', lengthMm: 2400, widthMm: 1000 },
];

const ROUND_PRESETS: SizePreset[] = [
  { label: '⌀ 120 cm', lengthMm: 1200, widthMm: 1200 },
  { label: '⌀ 140 cm', lengthMm: 1400, widthMm: 1400 },
  { label: '⌀ 160 cm', lengthMm: 1600, widthMm: 1600 },
];

const sectionLabel = 'block text-[11px] uppercase tracking-[0.15em] text-sera-text-soft mb-3';
const pillBase = 'px-4 py-2.5 text-xs uppercase tracking-[0.1em] border rounded-sm transition-colors';
const pillSelected = 'bg-sera-surface text-sera-inverted border-sera-surface';
const pillIdle = 'bg-transparent text-sera-text border-sera-text-soft/30 hover:border-sera-surface';

export default function StoneConfigurator() {
  const [tableType, setTableType] = useState<'eettafel' | 'koffietafel'>('eettafel');
  const [tier, setTier]           = useState<'essenza' | 'signature' | 'atelier'>('signature');
  const [stoneId, setStoneId]     = useState<string>('calacatta-viola');
  const [shape, setShape]         = useState<RuleShape>('corner');
  const [lengthMm, setLengthMm]   = useState<number>(2200);
  const [widthMm, setWidthMm]     = useState<number>(1000);
  const [legCount, setLegCount]   = useState<LegCount>(2);
  const [legStyle, setLegStyle]   = useState<RuleLegStyle>('cylindrical');
  const [finish, setFinish]       = useState<'gepolijst' | 'gezoet' | 'geborsteld'>('gepolijst');
  const [customSize, setCustomSize] = useState<boolean>(false);

  useEffect(() => {
    const valid = getValidLegCounts(shape);
    if (!valid.includes(legCount)) {
      setLegCount(valid[0]);
    }
  }, [shape]);

  useEffect(() => {
    const valid = getValidLegStyles(shape, legCount);
    if (!valid.find(o => o.id === legStyle)) {
      setLegStyle(valid[0].id);
    }
  }, [shape, legCount]);

  const total =
    TIER_BASE_PRICE[tier] +
    (STONE_EXTRA[stoneId] ?? 0) +
    FINISH_EXTRA[finish];

  const validLegCounts = getValidLegCounts(shape);
  const validLegStyles = getValidLegStyles(shape, legCount);
  const sizePresets = shape === 'round' ? ROUND_PRESETS : RECT_PRESETS;

  const stoneLabel = STONE_OPTIONS.find(s => s.id === stoneId)?.label ?? '';
  const legStyleLabel = LEG_STYLE_OPTIONS.find(o => o.id === legStyle)?.label ?? '';

  const marmerplaat = Math.round(total * 0.60);
  const bewerking   = Math.round(total * 0.20);
  const onderstel   = Math.round(total * 0.12);
  const afwerking   = total - (marmerplaat + bewerking + onderstel);
  const breakdown = [
    { label: `Marmerplaat ${stoneLabel}`,                 amount: marmerplaat },
    { label: 'Bewerkingskosten (snijden, polish)',        amount: bewerking },
    { label: `${legStyleLabel} ${legCount}×`,             amount: onderstel },
    { label: 'Afwerking & transport',                     amount: afwerking },
  ];
  const fmt = (n: number) => `€${n.toLocaleString('nl-NL')}`;

  const isPresetSelected = (p: SizePreset) =>
    !customSize && p.lengthMm === lengthMm && p.widthMm === widthMm;

  return (
    <div className="bg-sera-bg text-sera-text">
      {/* 1. Heading */}
      <h2 className="font-serif text-3xl md:text-5xl text-sera-text leading-tight mb-4">
        Configureer uw natuurstenen tafel op maat
      </h2>

      {/* 2. Subtitle */}
      <p className="text-base md:text-lg text-sera-text-soft leading-relaxed mb-8 max-w-3xl">
        Kies steensoort, formaat en onderstel. U ziet direct een transparante vanaf-prijs voor uw configuratie.
      </p>

      {/* 3. Anchor box */}
      <div className="mb-10 max-w-3xl bg-sera-bg-deep px-6 py-5 rounded-sm">
        <p className="text-sm italic text-sera-text-soft leading-relaxed font-serif">
          Ter vergelijking: een Bulthaup b3-keuken met marmeren werkblad start bij €35.000. Een Saarinen Tulip-replica in Carrara kost €2.400 — machine-cut, geen maatwerk. Onze tafel: 2,4m bookmatched Calacatta, volledig op maat, levenslang — €4.850.
        </p>
      </div>

      {/* 4. Tafel-type toggle */}
      <div className="mb-10">
        <span className={sectionLabel}>Type tafel</span>
        <div className="inline-flex gap-2">
          {(['eettafel', 'koffietafel'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTableType(t)}
              className={`${pillBase} ${tableType === t ? pillSelected : pillIdle}`}
            >
              {t === 'eettafel' ? 'Eettafel' : 'Koffietafel'}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 3D viewer */}
      <div className="mb-12">
        <ConfiguratorViewerV3
          {...stateToViewerProps({ stoneId, shape, lengthMm, widthMm, legStyle })}
          className="w-full aspect-[4/3] bg-sera-bg-deep rounded-sm"
        />
      </div>

      {/* 6. Tier cards */}
      <div className="mb-12">
        <span className={sectionLabel}>Serie</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((t) => {
            const selected = tier === t.id;
            return (
              <div key={t.id} className="relative">
                {t.badge && (
                  <div className="text-[10px] uppercase tracking-[0.2em] text-sera-text-soft mb-2">
                    {t.badge}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setTier(t.id)}
                  className={`w-full text-left bg-transparent border rounded-sm p-6 transition-colors ${
                    selected
                      ? 'border-sera-surface bg-sera-bg-deep'
                      : 'border-sera-text-soft/20 hover:border-sera-text-soft/50'
                  }`}
                >
                  <div className="font-serif text-xl text-sera-text mb-2">{t.name}</div>
                  <div className="text-sm text-sera-text mb-1">{t.price}</div>
                  <div className="text-xs italic text-sera-text-soft">{t.sub}</div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. STEEN */}
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
      </div>

      {/* 8. VORM */}
      <div className="mb-12">
        <span className={sectionLabel}>Vorm</span>
        <div className="flex flex-wrap gap-2">
          {SHAPE_OPTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setShape(s.id)}
              className={`${pillBase} ${shape === s.id ? pillSelected : pillIdle}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 9. FORMAAT */}
      <div className="mb-12">
        <span className={sectionLabel}>Formaat</span>
        <div className="flex flex-wrap gap-2 mb-3">
          {sizePresets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setCustomSize(false);
                setLengthMm(p.lengthMm);
                setWidthMm(p.widthMm);
              }}
              className={`${pillBase} ${isPresetSelected(p) ? pillSelected : pillIdle}`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomSize(true)}
            className={`${pillBase} ${customSize ? pillSelected : pillIdle}`}
          >
            Maatwerk
          </button>
        </div>

        {customSize && (
          <div className="flex flex-wrap gap-3 mt-3 max-w-md">
            {shape === 'round' ? (
              <label className="flex flex-col text-xs text-sera-text-soft">
                <span className="mb-1 uppercase tracking-[0.1em]">Diameter (mm)</span>
                <input
                  type="number"
                  min={600}
                  max={2400}
                  step={10}
                  value={lengthMm}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setLengthMm(v);
                    setWidthMm(v);
                  }}
                  className="w-32 px-3 py-2 bg-sera-bg-deep border border-sera-text-soft/30 text-sera-text rounded-sm"
                />
              </label>
            ) : (
              <>
                <label className="flex flex-col text-xs text-sera-text-soft">
                  <span className="mb-1 uppercase tracking-[0.1em]">Lengte (mm)</span>
                  <input
                    type="number"
                    min={1200}
                    max={3600}
                    step={10}
                    value={lengthMm}
                    onChange={(e) => setLengthMm(Number(e.target.value))}
                    className="w-32 px-3 py-2 bg-sera-bg-deep border border-sera-text-soft/30 text-sera-text rounded-sm"
                  />
                </label>
                <label className="flex flex-col text-xs text-sera-text-soft">
                  <span className="mb-1 uppercase tracking-[0.1em]">Breedte (mm)</span>
                  <input
                    type="number"
                    min={700}
                    max={1400}
                    step={10}
                    value={widthMm}
                    onChange={(e) => setWidthMm(Number(e.target.value))}
                    className="w-32 px-3 py-2 bg-sera-bg-deep border border-sera-text-soft/30 text-sera-text rounded-sm"
                  />
                </label>
              </>
            )}
          </div>
        )}
      </div>

      {/* 10. AANTAL POTEN — hide when only one option */}
      {validLegCounts.length > 1 && (
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
          </div>
        </div>
      )}

      {/* 11. POOTSTIJL */}
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
        </div>
      </div>

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
        </div>
      </div>

      {/* 13 + 14. Live total + trust line */}
      <div className="border-t border-sera-text-soft/20 pt-8 mb-6">
        <div className="font-serif text-4xl md:text-5xl text-sera-text leading-none">
          €{total.toLocaleString('nl-NL')}
        </div>
        <div className="text-xs text-sera-text-soft mt-3">
          Inclusief BTW · Transport inbegrepen · 2 jaar garantie
        </div>
      </div>

      {/* 14b. Reactive cost breakdown */}
      {total > 0 && (
        <div className="border-t border-sera-text-soft/20 pt-6 pb-6 mb-6">
          <span className={sectionLabel}>Transparantie</span>
          <ul>
            {breakdown.map((row) => (
              <li
                key={row.label}
                className="flex items-baseline justify-between py-3 border-b border-sera-text-soft/15"
              >
                <span className="text-sera-text text-sm">{row.label}</span>
                <span className="text-sera-text text-sm tabular-nums">{fmt(row.amount)}</span>
              </li>
            ))}
            <li className="flex items-baseline justify-between py-3">
              <span className="text-sera-text text-base font-medium uppercase tracking-[0.1em]">Totaal</span>
              <span className="text-sera-text text-base font-medium tabular-nums">{fmt(total)}</span>
            </li>
          </ul>
        </div>
      )}

      {/* 15. CTA */}
      <button
        type="button"
        onClick={() => { window.location.href = '/aanvraag'; }}
        className="w-full md:w-auto md:px-12 py-4 bg-sera-surface text-sera-inverted hover:bg-sera-text text-xs uppercase tracking-[0.15em] rounded-sm transition-colors"
      >
        Start uw aanvraag →
      </button>
    </div>
  );
}
