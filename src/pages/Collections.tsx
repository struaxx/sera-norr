import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";
import nordImage from "@/assets/nord-collection.jpg";

const Collections = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const collections = [
    {
      id: "terra",
      name: "TERRA",
      subtitle: t("collections.terra.subtitle"),
      description: t("collections.terra.description"),
      image: terraImage,
      cta: t("collections.terra.cta"),
    },
    {
      id: "vanta",
      name: "VANTA",
      subtitle: t("collections.vanta.subtitle"),
      description: t("collections.vanta.description"),
      image: vantaImage,
      cta: t("collections.vanta.cta"),
    },
  ];

  const seoTitle = isNL 
    ? "Collecties | Travertin & Calacatta Viola Meubels | SERA NORR"
    : "Collections | Travertine & Calacatta Viola Furniture | SERA NORR";

  const seoDescription = isNL
    ? "Ontdek onze collecties stenen meubels. TERRA collectie in travertin en VANTA collectie in Calacatta Viola marmer. Handgemaakt in Europa."
    : "Discover our stone furniture collections. TERRA collection in travertine and VANTA collection in Calacatta Viola marble. Handcrafted in Europe.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Collecties' : 'Collections', url: '/collections' },
  ]);

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "collecties, travertin meubels, Calacatta Viola, stenen tafels, marmeren meubels, luxe design" 
          : "collections, travertine furniture, Calacatta Viola, stone tables, marble furniture, luxury design"}
        structuredData={breadcrumbSchema}
      />

      {/* Intro Block */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8" />
          
          <header className="max-w-3xl">
            <h1 className="sr-only">{isNL ? 'Collecties' : 'Collections'}</h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed animate-fade-in">
              {t("collections.intro.line1")}
            </p>
            <p className="text-muted-foreground text-body-lg leading-relaxed mt-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t("collections.intro.line2")}
            </p>
          </header>
        </div>
      </section>

      {/* Collections List */}
      <section className="pb-section bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-24 lg:space-y-32">
            {collections.map((collection, index) => (
              <article
                key={collection.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <div className={`image-reveal ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <Link to={`/collections/${collection.id}`}>
                    <div className="aspect-[4/5] bg-muted overflow-hidden">
                      <img
                        src={collection.image}
                        alt={`${collection.name} ${isNL ? 'Collectie' : 'Collection'} - ${collection.subtitle} ${isNL ? 'stenen meubels' : 'stone furniture'}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <div className={`flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <h2 className="font-serif text-display-sm text-foreground mb-2">
                    {collection.name}
                  </h2>
                  <p className="font-sans text-sm uppercase tracking-[0.15em] text-muted-foreground mb-6">
                    {collection.subtitle}
                  </p>
                  <p className="text-muted-foreground text-body-md leading-relaxed mb-8 max-w-lg">
                    {collection.description}
                  </p>
                  <div>
                    <Button asChild variant="atelier">
                      <Link to={`/collections/${collection.id}`}>
                        {collection.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}

            {/* Other Stones - Special Block */}
            <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Placeholder Image */}
              <div className="image-reveal">
                <div className="aspect-[4/5] bg-sand/30 overflow-hidden flex items-center justify-center">
                  <img
                    src={nordImage}
                    alt={isNL ? "Overige steensoorten - zeldzame materialen op aanvraag" : "Other stone types - rare materials on request"}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <h2 className="font-serif text-display-sm text-foreground mb-2">
                  {t("collections.other.name")}
                </h2>
                <p className="font-sans text-sm uppercase tracking-[0.15em] text-muted-foreground mb-6">
                  {t("collections.other.subtitle")}
                </p>
                <p className="text-muted-foreground text-body-md leading-relaxed mb-8 max-w-lg">
                  {t("collections.other.description")}
                </p>
                <div>
                  <Button asChild variant="atelier">
                    <Link to="/contact">
                      {t("collections.other.cta")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Optional Block */}
      <section className="py-16 lg:py-24 bg-ivory/50">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-muted-foreground text-body-lg max-w-2xl mx-auto leading-relaxed">
            {t("collections.optional.line1")}
          </p>
          <p className="text-muted-foreground text-body-md max-w-xl mx-auto mt-4">
            {t("collections.optional.line2")}
          </p>
        </div>
      </section>

      {/* End CTA */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-display-sm text-foreground mb-4">
            {t("collections.endCta.title")}
          </h2>
          <p className="text-muted-foreground text-body-md max-w-xl mx-auto mb-8">
            {t("collections.endCta.description")}
          </p>
          <Button asChild variant="atelier-filled">
            <Link to="/bespoke">{t("collections.endCta.button")}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
