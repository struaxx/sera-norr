import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema, Breadcrumbs } from "@/components/seo";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { SectionBand, SectionHeader } from "@/components/ui/section-band";

const materials = [
  {
    id: "travertine",
    slug: "travertine",
    color: "bg-[#E8DFD5]",
  },
  {
    id: "calacatta-viola",
    slug: "calacatta-viola",
    color: "bg-[#F5F0F0]",
  },
];

export default function Materials() {
  const { t } = useTranslation();

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: t("materials.title"), href: "/materials" },
  ];

  const schemaItems = breadcrumbItems.map(item => ({ name: item.label, url: item.href }));

  return (
    <Layout>
      <SEOHead
        title={t("materials.seo.title")}
        description={t("materials.seo.description")}
        titleEn="Natural Stone Materials — Travertine & Marble | SERA NORR"
        descriptionEn="Discover our curated selection of natural stones: Italian travertine and Calacatta Viola marble. Learn about origins, properties, and care."
        structuredData={generateBreadcrumbSchema(schemaItems)}
      />

      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="max-w-4xl mt-8">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {t("materials.subtitle")}
            </p>
            <h1 className="font-serif text-4xl lg:text-6xl text-foreground mb-6">
              {t("materials.title")}
            </h1>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {t("materials.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="pb-24 lg:pb-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {materials.map((material) => (
              <Link
                key={material.id}
                to={`/materials/${material.slug}`}
                className="group block"
              >
                <div className={`aspect-[4/3] ${material.color} rounded-sm mb-6 transition-all duration-500 group-hover:scale-[1.02]`} />
                <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-3 group-hover:text-primary transition-colors">
                  {t(`materials.types.${material.id}.name`)}
                </h2>
                <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                  {t(`materials.types.${material.id}.shortDescription`)}
                </p>
                <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] text-foreground group-hover:text-primary transition-colors">
                  {t("materials.learnMore")}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <SectionBand variant="sand" size="lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-6">
            {t("materials.philosophy.title")}
          </h2>
          <p className="font-sans text-muted-foreground leading-relaxed mb-4">
            {t("materials.philosophy.description1")}
          </p>
          <p className="font-sans text-muted-foreground leading-relaxed">
            {t("materials.philosophy.description2")}
          </p>
        </div>
      </SectionBand>

      {/* CTA Section */}
      <SectionBand variant="default" size="md">
        <div className="text-center">
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-4">
            {t("materials.cta.title")}
          </h2>
          <p className="font-sans text-muted-foreground mb-8 max-w-lg mx-auto">
            {t("materials.cta.description")}
          </p>
          <Link
            to="/bespoke"
            className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-sans text-xs uppercase tracking-[0.15em] hover:bg-foreground/90 transition-colors"
          >
            {t("materials.cta.button")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </SectionBand>
    </Layout>
  );
}