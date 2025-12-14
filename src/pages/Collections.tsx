import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";

const Collections = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(10);
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  const seoTitle = isNL 
    ? "Collecties | Travertin & Calacatta Viola Meubels | SERA NORR"
    : "Collections | Travertine & Calacatta Viola Furniture | SERA NORR";

  const seoDescription = isNL
    ? "Ontdek onze collecties stenen meubels. TERRA collectie in travertin en VANTA collectie in Calacatta Viola marmer. Ontworpen in Nederland."
    : "Discover our stone furniture collections. TERRA collection in travertine and VANTA collection in Calacatta Viola marble. Designed in the Netherlands.";

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
            {loading ? (
              // Loading skeletons
              [1, 2].map((i) => (
                <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ))
            ) : collections.length > 0 ? (
              collections.map((collection, index) => (
                <article
                  key={collection.node.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  {/* Image */}
                  <div className={`image-reveal ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <Link to={`/collections/${collection.node.handle}`}>
                      <div className="aspect-[4/5] bg-muted overflow-hidden">
                        {collection.node.image ? (
                          <img
                            src={collection.node.image.url}
                            alt={collection.node.image.altText || `${collection.node.title} ${isNL ? 'collectie' : 'collection'}`}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                            <span className="text-muted-foreground font-serif text-3xl">{collection.node.title}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                    <h2 className="font-serif text-display-sm text-foreground mb-2">
                      {collection.node.title}
                    </h2>
                    {collection.node.description && (
                      <p className="text-muted-foreground text-body-md leading-relaxed mb-8 max-w-lg">
                        {collection.node.description}
                      </p>
                    )}
                    <div>
                      <Button asChild variant="atelier">
                        <Link to={`/collections/${collection.node.handle}`}>
                          {isNL ? 'Bekijk collectie' : 'View collection'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-12">
                {isNL ? 'Geen collecties gevonden.' : 'No collections found.'}
              </p>
            )}

            {/* Other Stones - Special Block */}
            <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Placeholder Image */}
              <div className="image-reveal">
                <div className="aspect-[4/5] bg-sand/30 overflow-hidden flex items-center justify-center border border-border/30">
                  <div className="text-center p-12">
                    <p className="font-serif text-lg text-muted-foreground mb-2">
                      {isNL ? 'Verde Alpi • Nero Marquina' : 'Verde Alpi • Nero Marquina'}
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      {isNL ? '& andere zeldzame steensoorten' : '& other rare stone types'}
                    </p>
                  </div>
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
