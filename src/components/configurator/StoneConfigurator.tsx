import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { computeRange } from './pricing';

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
  const navigate = useNavigate();
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

  const validLegCounts = getValidLegCounts(shape);
  const validLegStyles = getValidLegStyles(shape, legCount);
  const sizePresets = shape === 'round' ? ROUND_PRESETS : RECT_PRESETS;

  const isPresetSelected = (p: SizePreset) =>
    !customSize && p.lengthMm === lengthMm && p.widthMm === widthMm;

  const range = computeRange({ stoneId, lengthMm, widthMm, legCount, finish });

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

      <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-12 lg:items-start">
        {/* 5. 3D viewer — sticky on desktop */}
        <div className="mb-12 lg:mb-0 lg:sticky lg:top-32 lg:self-start">
          <ConfiguratorViewerV3
            {...stateToViewerProps({ stoneId, shape, lengthMm, widthMm, legStyle })}
            className="w-full aspect-[4/3] max-h-[calc(100vh-10rem)] bg-sera-bg-deep rounded-sm"
          />
        </div>

        {/* Controls column */}
        <div>
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

      <div className="border-t border-sera-text-soft/20 pt-6">
        <span className="block text-[11px] uppercase tracking-[0.15em] text-sera-text-soft mb-2">
          Indicatie
        </span>
        <div className="font-serif text-3xl text-sera-text">
          €{range.low.toLocaleString('nl-NL')} – €{range.high.toLocaleString('nl-NL')}
        </div>
        <p className="text-sm text-sera-text-soft mt-3 max-w-md">
          Maatwerk in natuursteen. Uw exacte prijs ontvangt u in een persoonlijk
          voorstel, afgestemd op de gekozen slab, afwerking en levering.
          Inclusief BTW · Transport inbegrepen.
        </p>
      </div>

      {/* 15. CTA */}
      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams({
            stoneId,
            shape,
            lengthMm: String(lengthMm),
            widthMm: String(widthMm),
            legCount: String(legCount),
            legStyle,
            finish,
          });
          navigate(`/voorstel?${params.toString()}`);
        }}
        className="w-full md:w-auto md:px-12 py-4 bg-sera-surface text-sera-inverted hover:bg-sera-text text-xs uppercase tracking-[0.15em] rounded-sm transition-colors"
      >
        Start uw aanvraag →
      </button>
        </div>
      </div>
    </div>
  );
}
