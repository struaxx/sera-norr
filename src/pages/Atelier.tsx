// ============================================
// Atelier Page, StoneConfigurator mount
// ============================================

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Layout } from '@/components/layout';
import { SEOHead, BreadcrumbSchema } from '@/components/seo';
import { StoneConfigurator } from '@/components/configurator';

function HelpSidebar({ isNL }: { isNL: boolean }) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        to="/contact?subject=advies"
        aria-label={isNL ? "Plan kort advies" : "Schedule quick advice"}
        className="flex items-center gap-2 px-4 py-2.5 bg-background border border-foreground/10 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors shadow-sm"
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
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
        title={isNL ? "Natuurstenen Tafel op Maat Samenstellen | Sera Norr Atelier" : "Design Your Natural Stone Table | Sera Norr Atelier"}
        description={isNL ? "Stel uw natuurstenen tafel op maat samen: steensoort, formaat, onderstel. Directe prijsindicatie. Geen verplichtingen." : "Design your bespoke natural stone table: stone, size, base. Instant price indication. No obligations."}
      />

      <main className="min-h-screen bg-sera-bg">
        <div className="container max-w-7xl mx-auto px-4 pt-28 pb-16 lg:pt-36 lg:pb-24">
          <HelpSidebar isNL={isNL} />
          <StoneConfigurator />
        </div>
      </main>
    </Layout>
  );
}
