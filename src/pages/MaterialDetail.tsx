import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema, Breadcrumbs, FAQSection } from "@/components/seo";
import { ArrowRight } from "lucide-react";

const materialData: Record<string, { color: string; collection: string }> = {
  travertine: {
    color: "bg-[#E8DFD5]",
    collection: "terra",
  },
  "calacatta-viola": {
    color: "bg-[#F5F0F0]",
    collection: "vanta",
  },
};

export default function MaterialDetail() {
  const { materialId } = useParams<{ materialId: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  if (!materialId || !materialData[materialId]) {
    return <Navigate to="/materials" replace />;
  }

  const material = materialData[materialId];
  const translationKey = materialId === "calacatta-viola" ? "calacattaViola" : materialId;

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: t("materials.title"), href: "/materials" },
    { label: t(`materials.types.${translationKey}.name`), href: `/materials/${materialId}` },
  ];

  const faqItems = [
    {
      question: t(`materials.types.${translationKey}.faq.q1`),
      answer: t(`materials.types.${translationKey}.faq.a1`),
    },
    {
      question: t(`materials.types.${translationKey}.faq.q2`),
      answer: t(`materials.types.${translationKey}.faq.a2`),
    },
    {
      question: t(`materials.types.${translationKey}.faq.q3`),
      answer: t(`materials.types.${translationKey}.faq.a3`),
    },
  ];

  const specifications = [
    { label: t("materials.specs.origin"), value: t(`materials.types.${translationKey}.origin`) },
    { label: t("materials.specs.hardness"), value: t(`materials.types.${translationKey}.hardness`) },
    { label: t("materials.specs.porosity"), value: t(`materials.types.${translationKey}.porosity`) },
    { label: t("materials.specs.finish"), value: t(`materials.types.${translationKey}.finishOptions`) },
  ];

  const schemaItems = breadcrumbItems.map(item => ({ name: item.label, url: item.href }));

  return (
    <Layout>
      <SEOHead
        title={t(`materials.types.${translationKey}.seo.title`)}
        description={t(`materials.types.${translationKey}.seo.description`)}
        titleEn={materialId === "travertine" 
          ? "Italian Travertine, Origin, Properties & Care | SERA NORR"
          : "Calacatta Viola Marble, Rare Apuan Marble | SERA NORR"
        }
        descriptionEn={materialId === "travertine"
          ? "Discover Italian travertine: its thermal origins, unique pitting, warm tones, and how SERA NORR crafts it into sculptural furniture."
          : "Explore Calacatta Viola, one of the rarest marbles from the Apuan Alps. Learn about its violet veining and applications in bespoke furniture."
        }
        structuredData={generateBreadcrumbSchema(schemaItems)}
      />

      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mt-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                {t("materials.subtitle")}
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">
                {t(`materials.types.${translationKey}.name`)}
              </h1>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8">
                {t(`materials.types.${translationKey}.introduction`)}
              </p>
              <Link
                to={`/collections/${material.collection}`}
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors"
              >
                {t("materials.viewCollection")}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className={`aspect-square ${material.color} rounded-sm`} />
          </div>
        </div>
      </section>

      {/* Origin Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-6">
              {t(`materials.types.${translationKey}.originTitle`)}
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed mb-4">
              {t(`materials.types.${translationKey}.originText1`)}
            </p>
            <p className="font-sans text-muted-foreground leading-relaxed">
              {t(`materials.types.${translationKey}.originText2`)}
            </p>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-6">
                {t(`materials.types.${translationKey}.propertiesTitle`)}
              </h2>
              <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                {t(`materials.types.${translationKey}.propertiesText1`)}
              </p>
              <p className="font-sans text-muted-foreground leading-relaxed">
                {t(`materials.types.${translationKey}.propertiesText2`)}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-sm p-8">
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                {t("materials.specifications")}
              </h3>
              <dl className="space-y-4">
                {specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between border-b border-border/30 pb-3">
                    <dt className="font-sans text-sm text-muted-foreground">{spec.label}</dt>
                    <dd className="font-sans text-sm text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Care Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-6">
              {t(`materials.types.${translationKey}.careTitle`)}
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed mb-6">
              {t(`materials.types.${translationKey}.careIntro`)}
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                <span className="font-sans text-muted-foreground">
                  {t(`materials.types.${translationKey}.careTip1`)}
                </span>
              </li>
              <li className="flex gap-4">
                <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                <span className="font-sans text-muted-foreground">
                  {t(`materials.types.${translationKey}.careTip2`)}
                </span>
              </li>
              <li className="flex gap-4">
                <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                <span className="font-sans text-muted-foreground">
                  {t(`materials.types.${translationKey}.careTip3`)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-8">
            {t(`materials.types.${translationKey}.applicationsTitle`)}
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

      {/* FAQ Section */}
      <FAQSection 
        title={t("materials.faqTitle")}
        faqs={faqItems}
      />

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-4">
            {t("materials.cta.title")}
          </h2>
          <p className="font-sans text-muted-foreground mb-8 max-w-lg mx-auto">
            {t("materials.cta.description")}
          </p>
          <Link
            to="/atelier"
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