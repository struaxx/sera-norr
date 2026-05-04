// ============================================
// Atelier Page — StoneConfigurator + PricingBreakdown
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/layout';
import { SEOHead, BreadcrumbSchema } from '@/components/seo';
import { StoneConfigurator } from '@/components/configurator';
import { PricingBreakdown } from '@/components/trust';

function HelpSidebar({ isNL }: { isNL: boolean }) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        to="/contact?subject=advies"
        className="flex items-center gap-2 px-4 py-2.5 bg-background border border-foreground/10 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors shadow-sm"
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">{isNL ? "Plan kort advies" : "Schedule quick advice"}</span>
      </Link>
    </div>
  );
}

export default function Atelier() {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  return (
    <Layout>
      <BreadcrumbSchema
        items={[
          { name: "SERA NORR", url: "https://sera-norr.com" },
          { name: "Configurator", url: "https://sera-norr.com/atelier" },
        ]}
      />
      <SEOHead
        title={isNL ? "Configureer Uw Tafel — Sera Norr Atelier" : "Configure Your Table — Sera Norr Atelier"}
        description={isNL ? "Steensoort, formaat, onderstel. Directe prijsindicatie. Geen verplichtingen." : "Stone, size, base. Instant price indication. No obligations."}
      />

      <main className="min-h-screen py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <header className="mb-10 md:mb-14 max-w-3xl">
            <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-4">
              {isNL
                ? "Configureer uw natuurstenen tafel op maat"
                : "Configure your bespoke natural stone table"}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {isNL
                ? "Kies steensoort, formaat en onderstel. U ziet direct een transparante vanaf-prijs voor uw configuratie."
                : "Pick a stone, size and base. See a transparent starting price for your configuration right away."}
            </p>
          </header>

          <HelpSidebar isNL={isNL} />

          <section id="configurator">
            <div className="mb-10 max-w-3xl bg-foreground/[0.03] px-6 py-5">
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                {isNL
                  ? "Ter vergelijking: een Bulthaup b3-keuken met marmeren werkblad start bij €35.000. Een Saarinen Tulip-replica in Carrara kost €2.400 — machine-cut, geen maatwerk. Onze tafel: 2,4m bookmatched Calacatta, volledig op maat, levenslang — €4.850."
                  : "For context: a Bulthaup b3 kitchen with a marble worktop starts at €35,000. A Saarinen Tulip replica in Carrara costs €2,400 — machine-cut, not bespoke. Our table: 2.4m bookmatched Calacatta, fully bespoke, for life — €4,850."}
              </p>
            </div>
            <QuickConfigurator />
          </section>

          <section
            id="kostenopbouw"
            className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-foreground/10"
          >
            <PricingBreakdown />
          </section>
        </div>
      </main>
    </Layout>
  );
}

function QuickConfigurator() {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const [category, setCategory] = useState<'diningTables' | 'coffeeTables'>('diningTables');

  return (
    <div>
      <div role="tablist" aria-label={isNL ? "Type" : "Type"} className="inline-flex border border-foreground/10 mb-10">
        {([
          { id: 'diningTables', label: isNL ? 'Eettafel' : 'Dining table' },
          { id: 'coffeeTables', label: isNL ? 'Koffietafel' : 'Coffee table' },
        ] as const).map((opt) => {
          const active = category === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(opt.id)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <StoneConfigurator key={category} />
    </div>
  );
}
