import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema, Breadcrumbs } from "@/components/seo";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hairline } from "@/components/ui/hairline";
import { ProofGrid } from "@/components/ui/proof-grid";

const materials = [
  {
    id: "travertine",
    slug: "travertine",
    image: null, // placeholder
    collection: "terra",
  },
  {
    id: "calacatta-viola",
    slug: "calacatta-viola",
    image: null, // placeholder
    collection: "vanta",
  },
];

export default function Materials() {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: t("materials.title"), href: "/materials" },
  ];

  const schemaItems = breadcrumbItems.map(item => ({ name: item.label, url: item.href }));

  const proofItems = isNL ? [
    { title: 'Italiaanse oorsprong', description: 'Geselecteerd uit Europese groeves.' },
    { title: 'Uniek karakter', description: 'Elke plaat vertelt een eigen verhaal.' },
    { title: 'Duurzaam materiaal', description: 'Natuursteen gaat generaties mee.' },
  ] : [
    { title: 'Italian origin', description: 'Selected from European quarries.' },
    { title: 'Unique character', description: 'Each slab tells its own story.' },
    { title: 'Sustainable material', description: 'Natural stone lasts generations.' },
  ];

  return (
    <Layout>
      <SEOHead
        title={t("materials.seo.title")}
        description={t("materials.seo.description")}
        titleEn="Natural Stone Materials, Travertine & Marble | SERA NORR"
        descriptionEn="Discover our curated selection of natural stones: Italian travertine and Calacatta Viola marble. Learn about origins, properties, and care."
        structuredData={generateBreadcrumbSchema(schemaItems)}
      />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} className="mb-8 opacity-60 text-[10px]" />

          <div className="max-w-3xl">
            <p className="micro-label mb-6">
              {t("materials.subtitle")}
            </p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {t("materials.title")}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl">
              {t("materials.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Travertine - Editorial Split */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section hairline */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">01</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="image-reveal">
              <Link to="/materials/travertine">
                <div className="aspect-[3/4] bg-[#E8DFD5] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                  {/* Placeholder - would be actual image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif text-2xl text-foreground/30">Travertin</span>
                  </div>
                </div>
              </Link>
              <p className="editorial-caption mt-4">
                {isNL ? 'Italiaans travertin: thermale oorsprong' : 'Italian travertine: thermal origin'}
              </p>
            </div>

            {/* Content */}
            <div>
              <p className="editorial-caption-label mb-4">
                {isNL ? 'Thermale steen' : 'Thermal stone'}
              </p>
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
                {t("materials.types.travertine.name")}
              </h2>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-6 max-w-md">
                {t("materials.types.travertine.shortDescription")}
              </p>
              <p className="text-body-sm text-muted-foreground leading-relaxed mb-10 max-w-md">
                {isNL 
                  ? "Gevormd door millennia van minerale afzettingen. De warme, honingkleurige tinten en karakteristieke textuur maken elke plaat uniek."
                  : "Formed over millennia from mineral deposits. The warm, honeyed tones and characteristic texture make each slab unique."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="sera-primary" size="lg">
                  <Link to="/materials/travertine">
                    {t("materials.learnMore")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="sera-secondary" size="lg">
                  <Link to="/collections/terra">
                    {isNL ? "Bekijk TERRA" : "View TERRA"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calacatta Viola - Editorial Split (Reversed) */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section hairline */}
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">02</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <p className="editorial-caption-label mb-4">
                {isNL ? 'Zeldzaam marmer' : 'Rare marble'}
              </p>
              <h2 className="font-serif text-display-sm lg:text-display-md text-foreground mb-5">
                Calacatta Viola
              </h2>
              <p className="text-body-md text-muted-foreground leading-relaxed mb-6 max-w-md">
                {t("materials.types.calacatta-viola.shortDescription")}
              </p>
              <p className="text-body-sm text-muted-foreground leading-relaxed mb-10 max-w-md">
                {isNL 
                  ? "Een van de zeldzaamste marmersoorten ter wereld. De violette en grijze aders tegen lichtgevend wit creëren dramatische, sculpturale stukken."
                  : "One of the rarest marbles in the world. The violet and grey veining against luminous white creates dramatic, sculptural pieces."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="sera-primary" size="lg">
                  <Link to="/materials/calacatta-viola">
                    {t("materials.learnMore")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="sera-secondary" size="lg">
                  <Link to="/collections/vanta">
                    {isNL ? "Bekijk VANTA" : "View VANTA"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 image-reveal">
              <Link to="/materials/calacatta-viola">
                <div className="aspect-[3/4] bg-[#F5F0F0] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                  {/* Placeholder - would be actual image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif text-2xl text-foreground/30">Calacatta Viola</span>
                  </div>
                </div>
              </Link>
              <p className="editorial-caption mt-4">
                {isNL ? 'Calacatta Viola: Apuaanse Alpen' : 'Calacatta Viola: Apuan Alps'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Filosofie' : 'Philosophy'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-6">
                {t("materials.philosophy.title")}
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {t("materials.philosophy.description1")}
              </p>
              <p className="text-body-md text-muted-foreground leading-relaxed">
                {t("materials.philosophy.description2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Grid */}
      <section className="py-20 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <ProofGrid items={proofItems} />
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-sm text-background mb-4">
              {t("materials.cta.title")}
            </h2>
            <p className="text-background/70 text-body-md mb-10">
              {t("materials.cta.description")}
            </p>
            <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
              <Link to="/atelier">
                {t("materials.cta.button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}