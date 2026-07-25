import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema, Breadcrumbs, FAQSection } from "@/components/seo";
import { ArrowRight } from "lucide-react";

// Per materiaal: de swatch-kleur en de configurator-deeplink, zodat een
// bezoeker vanaf de materiaalpagina direct in de juiste steen verder kan.
const materialData: Record<string, { color: string; configuratorStone: string }> = {
  travertine: {
    color: "bg-[#E8DFD5]",
    configuratorStone: "travertijn",
  },
  "calacatta-viola": {
    color: "bg-[#F5F0F0]",
    configuratorStone: "viola",
  },
};

interface FaqEntry {
  question: string;
  answer: string;
}

export default function MaterialDetail() {
  const { materialId } = useParams<{ materialId: string }>();
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === "nl";

  if (!materialId || !materialData[materialId]) {
    return <Navigate to="/materials" replace />;
  }

  const material = materialData[materialId];
  // De vertaalsleutels gebruiken exact de route-id ('travertine',
  // 'calacatta-viola'); niet omzetten naar een andere schrijfwijze.
  const base = `materials.types.${materialId}`;

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: t("materials.title"), href: "/materials" },
    { label: t(`${base}.name`), href: `/materials/${materialId}` },
  ];

  const faqRaw = t(`${base}.faq`, { returnObjects: true });
  const faqItems: FaqEntry[] = Array.isArray(faqRaw) ? (faqRaw as FaqEntry[]) : [];

  const specifications = [
    { label: t("materials.specs.origin"), value: t(`${base}.specs.origin`) },
    { label: t("materials.specs.hardness"), value: t(`${base}.specs.hardness`) },
    { label: t("materials.specs.porosity"), value: t(`${base}.specs.porosity`) },
    { label: t("materials.specs.finish"), value: t(`${base}.specs.finish`) },
  ];

  const schemaItems = breadcrumbItems.map((item) => ({ name: item.label, url: item.href }));

  return (
    <Layout>
      <SEOHead
        title={`${t(`${base}.name`)}, ${t(`${base}.subtitle`)} | SERA NORR`}
        description={t(`${base}.intro`)}
        titleEn={
          materialId === "travertine"
            ? "Italian Travertine, Origin, Properties & Care | SERA NORR"
            : "Calacatta Viola Marble, Rare Apuan Marble | SERA NORR"
        }
        descriptionEn={
          materialId === "travertine"
            ? "Discover Italian travertine: its thermal origins, unique pitting, warm tones, and how SERA NORR crafts it into sculptural furniture."
            : "Explore Calacatta Viola, one of the rarest marbles from the Apuan Alps. Learn about its violet veining and applications in bespoke furniture."
        }
        structuredData={generateBreadcrumbSchema(schemaItems)}
      />

      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mt-8 items-start">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                {t(`${base}.subtitle`)}
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">
                {t(`${base}.name`)}
              </h1>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8">
                {t(`${base}.intro`)}
              </p>
              <Link
                to={`/atelier?steen=${material.configuratorStone}`}
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors"
              >
                {isNL ? `Configureer in ${t(`${base}.name`)}` : `Configure in ${t(`${base}.name`)}`}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className={`aspect-square ${material.color} rounded-sm`} />
          </div>
        </div>
      </section>

      {/* Eigenschappen + specificaties */}
      <section className="py-16 lg:py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-6">
                {isNL ? "Over dit materiaal" : "About this material"}
              </h2>
              <p className="font-sans text-muted-foreground leading-relaxed">
                {t(`${base}.description`)}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-sm p-8">
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                {t("materials.specifications")}
              </h3>
              <dl className="space-y-4">
                {specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-6 border-b border-border/30 pb-3">
                    <dt className="font-sans text-sm text-muted-foreground">{spec.label}</dt>
                    <dd className="font-sans text-sm text-foreground text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Onderhoud */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-6">
              {t(`${base}.care.title`)}
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed mb-6">
              {t(`${base}.care.description`)}
            </p>
            <Link
              to="/care"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors"
            >
              {isNL ? "Volledige onderhoudsgids" : "Full care guide"}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Toepassingen */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-8">
            {isNL ? "Toepassingen" : "Applications"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["dining", "coffee", "console"].map((type) => (
              <div key={type} className="bg-secondary/30 rounded-sm p-6">
                <h3 className="font-serif text-lg text-foreground mb-2">
                  {t(`materials.applications.${type}.title`)}
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  {t(`materials.applications.${type}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {faqItems.length > 0 && <FAQSection title={t("materials.faqTitle")} faqs={faqItems} />}

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-4">
            {t("materials.cta.title")}
          </h2>
          <p className="font-sans text-muted-foreground mb-8 max-w-lg mx-auto">
            {t("materials.cta.description")}
          </p>
          <Link
            to={`/atelier?steen=${material.configuratorStone}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-sans text-xs uppercase tracking-[0.15em] hover:bg-foreground/90 transition-colors"
          >
            {t("materials.cta.button")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
