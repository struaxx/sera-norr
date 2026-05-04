import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LineItem {
  label: { nl: string; en: string };
  amount: number;
}

interface Example {
  id: string;
  title: { nl: string; en: string };
  subtitle: { nl: string; en: string };
  total: number;
  swatch: string; // tailwind bg class
  items: LineItem[];
}

const EUR = (n: number) => `€${n.toLocaleString('nl-NL')}`;

const EXAMPLES: Example[] = [
  {
    id: 'cv-dining-200',
    title: { nl: 'Calacatta Viola — Ovale eettafel', en: 'Calacatta Viola — Oval dining table' },
    subtitle: { nl: '200×100 cm · conische marmer poten', en: '200×100 cm · tapered marble legs' },
    total: 8500,
    swatch: 'bg-[#EFE8EA]',
    items: [
      { label: { nl: 'Marmerplaat Calacatta Viola', en: 'Calacatta Viola slab' }, amount: 5200 },
      { label: { nl: 'Bewerkingskosten (snijden, bookmatching, polish)', en: 'Fabrication (cutting, bookmatching, polish)' }, amount: 1800 },
      { label: { nl: 'Conische marmer poten', en: 'Tapered marble legs' }, amount: 800 },
      { label: { nl: 'Afwerking & transport', en: 'Finishing & transport' }, amount: 700 },
    ],
  },
  {
    id: 'le-dining-200',
    title: { nl: 'Light Emperador — Eettafel', en: 'Light Emperador — Dining table' },
    subtitle: { nl: '200×100 cm · stalen frame', en: '200×100 cm · steel frame' },
    total: 3500,
    swatch: 'bg-[#C9B7A2]',
    items: [
      { label: { nl: 'Marmerplaat Light Emperador', en: 'Light Emperador slab' }, amount: 2000 },
      { label: { nl: 'Bewerkingskosten (CNC, polish)', en: 'Fabrication (CNC, polish)' }, amount: 900 },
      { label: { nl: 'Stalen frame', en: 'Steel frame' }, amount: 400 },
      { label: { nl: 'Afwerking & transport', en: 'Finishing & transport' }, amount: 200 },
    ],
  },
  {
    id: 'cv-coffee',
    title: { nl: 'Calacatta Viola — Koffietafel', en: 'Calacatta Viola — Coffee table' },
    subtitle: { nl: '100×60 cm · centrale kolom', en: '100×60 cm · central column' },
    total: 2500,
    swatch: 'bg-[#EFE8EA]',
    items: [
      { label: { nl: 'Marmerplaat Calacatta Viola', en: 'Calacatta Viola slab' }, amount: 1400 },
      { label: { nl: 'Bewerkingskosten (snijden, polish)', en: 'Fabrication (cutting, polish)' }, amount: 600 },
      { label: { nl: 'Centrale marmer kolom', en: 'Central marble column' }, amount: 350 },
      { label: { nl: 'Afwerking & transport', en: 'Finishing & transport' }, amount: 150 },
    ],
  },
];

interface PricingBreakdownProps {
  className?: string;
  defaultExampleId?: string;
}

export function PricingBreakdown({ className, defaultExampleId }: PricingBreakdownProps) {
  const { i18n } = useTranslation();
  const lang: 'nl' | 'en' = i18n.language === 'en' ? 'en' : 'nl';
  const [activeId, setActiveId] = useState<string>(defaultExampleId ?? EXAMPLES[0].id);
  const active = EXAMPLES.find((e) => e.id === activeId) ?? EXAMPLES[0];
  const sum = active.items.reduce((acc, i) => acc + i.amount, 0);

  return (
    <section className={cn('w-full', className)} aria-labelledby="pricing-breakdown-heading">
      <header className="mb-10 lg:mb-14 max-w-2xl">
        <p className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-muted-foreground/80 mb-4">
          {lang === 'nl' ? 'Transparantie' : 'Transparency'}
        </p>
        <h2 id="pricing-breakdown-heading" className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
          {lang === 'nl' ? 'Transparante kostenopbouw' : 'Transparent price breakdown'}
        </h2>
        <p className="font-sans text-muted-foreground leading-relaxed">
          {lang === 'nl'
            ? 'Drie echte projecten, volledig uitgesplitst — van slab tot oplevering. Geen verborgen marges, geen meerwerk achteraf.'
            : 'Three real projects, fully itemised — from slab to delivery. No hidden margins, no unexpected costs.'}
        </p>
      </header>

      {/* Tabs */}
      <div role="tablist" aria-label="Voorbeeld" className="flex flex-wrap gap-px bg-foreground/10 border border-foreground/10 mb-10">
        {EXAMPLES.map((ex) => {
          const isActive = ex.id === active.id;
          return (
            <button
              key={ex.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActiveId(ex.id)}
              className={cn(
                'flex-1 min-w-[200px] px-5 py-4 text-left bg-background transition-colors',
                isActive ? 'bg-foreground text-background' : 'hover:bg-foreground/[0.03] text-foreground'
              )}
            >
              <span className={cn(
                'block text-[10px] uppercase tracking-[0.2em] mb-1.5',
                isActive ? 'text-background/60' : 'text-muted-foreground'
              )}>
                {ex.subtitle[lang]}
              </span>
              <span className="font-serif text-base lg:text-lg leading-tight">
                {ex.title[lang]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Breakdown card */}
      <div className="grid lg:grid-cols-[1fr_2fr] gap-px bg-foreground/10 border border-foreground/10">
        {/* Visual */}
        <div className="bg-background p-8 lg:p-10 flex flex-col justify-between">
          <div className={cn('aspect-[4/3] w-full', active.swatch)} aria-hidden="true" />
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {lang === 'nl' ? 'Totaalprijs' : 'Total price'}
            </p>
            <p className="font-serif text-3xl lg:text-4xl text-foreground">{EUR(active.total)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {lang === 'nl' ? 'Incl. BTW · excl. eventuele opties' : 'Incl. VAT · options excluded'}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-background p-8 lg:p-10">
          <ul className="divide-y divide-foreground/10">
            {active.items.map((item) => (
              <li key={item.label[lang]} className="flex items-baseline justify-between py-4 first:pt-0">
                <span className="font-sans text-sm lg:text-base text-foreground">
                  {item.label[lang]}
                </span>
                <span className="font-sans text-sm lg:text-base text-foreground tabular-nums">
                  {EUR(item.amount)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-foreground/20 flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {lang === 'nl' ? 'Totaal' : 'Total'}
            </span>
            <span className="font-serif text-xl lg:text-2xl text-foreground tabular-nums">
              {EUR(sum)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
            {lang === 'nl'
              ? 'Elke offerte ontvangt u met dezelfde uitsplitsing — slab, atelierwerk, onderstel, transport en eindcontrole apart benoemd.'
              : 'Every quote we send is itemised the same way — slab, atelier hours, base, transport and final inspection listed separately.'}
          </p>
        </div>
      </div>
    </section>
  );
}