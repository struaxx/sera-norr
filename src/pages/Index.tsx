import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SEOHead, baseSchema, WebSiteJsonLd, BreadcrumbSchema } from "@/components/seo";
import { usePageTracking } from "@/hooks/use-tracking";
import { useIsMobile } from "@/hooks/use-mobile";

// The four acts of the homepage narrative.
// See docs/EXPERIENCE_OS.md §2 for the story arc:
// Arrival → Material → Craft → Invitation.
import { ActArrival } from "@/components/homepage/acts/ActArrival";
import { ActMaterial } from "@/components/homepage/acts/ActMaterial";
import { ActCraft } from "@/components/homepage/acts/ActCraft";
import { ActInvitation } from "@/components/homepage/acts/ActInvitation";

const Index = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === "nl";

  usePageTracking();

  const seoTitle = isNL
    ? "SERA NORR | Stenen Meubels op Maat"
    : "SERA NORR | Bespoke Stone Furniture";

  const seoDescription = isNL
    ? "Handgemaakte eettafels en salontafels in Calacatta Viola, Travertijn en Statuario. Op maat, white-glove geleverd."
    : "Handcrafted dining and coffee tables in Calacatta Viola, Travertine and Statuario. Bespoke, white-glove delivery.";

  const seoKeywords = isNL
    ? "SERA NORR, online atelier, maatwerk natuursteenmeubels, travertin tafel, marmeren tafel op maat, Calacatta Viola, stenen eettafel"
    : "SERA NORR, online atelier, bespoke natural stone furniture, travertine table, custom marble table, Calacatta Viola, stone dining table";

  return (
    <Layout>
      <WebSiteJsonLd />
      <BreadcrumbSchema items={[{ name: "SERA NORR", url: "https://sera-norr.com" }]} />
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        structuredData={baseSchema}
      />

      {/* Act I — Arrival. Stone as protagonist. */}
      <ActArrival isNL={isNL} />

      {/* Act II — Material. Six stones on a horizontal dolly. */}
      <ActMaterial isNL={isNL} />

      {/* Act III — Craft. Editorial split; the atelier speaks. */}
      <ActCraft isNL={isNL} />

      {/* Act IV — Invitation. One CTA on warm dark. */}
      <ActInvitation isNL={isNL} />

      {/* Sticky mobile CTA persists across acts. */}
      <StickyMobileCTA isNL={isNL} />
    </Layout>
  );
};

// Sticky mobile CTA — appears after Act I clears the viewport.
function StickyMobileCTA({ isNL }: { isNL: boolean }) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMobile) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 bg-sera-bg/95 backdrop-blur-sm border-t border-sera-text-soft/20 px-4 py-3 lg:hidden"
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Button
        asChild
        className="w-full bg-sera-surface text-sera-inverted hover:bg-sera-text h-12 rounded-sm text-xs uppercase tracking-[0.15em]"
      >
        <Link to="/atelier">
          {isNL ? "Ontwerp uw tafel" : "Design your table"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </motion.div>
  );
}

export default Index;
