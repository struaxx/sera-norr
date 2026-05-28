import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BlurImage } from "@/components/ui/blur-image";
import { getCollectionBySlug } from "@/data/collections";

const CollectionDetail = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isNL = (i18n.resolvedLanguage ?? i18n.language ?? "nl").toLowerCase().startsWith("nl");

  const collection = slug ? getCollectionBySlug(slug) : undefined;
  if (!collection) {
    return <Navigate to="/collections" replace />;
  }

  const breadcrumbItems = [
    { label: isNL ? "Lookbook" : "Lookbook", href: "/collections" },
    { label: collection.name, href: `/collections/${collection.slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: isNL ? "Lookbook" : "Lookbook", url: "/collections" },
    { name: collection.name, url: `/collections/${collection.slug}` },
  ]);

  return (
    <Layout>
      <SEOHead
        title={`${collection.name} | Sera Norr`}
        description={collection.tagline}
        structuredData={breadcrumbSchema}
      />

      <div className="pt-24 pb-4 bg-background">
        <div className="container mx-auto px-6 lg:px-12 space-y-4 max-w-6xl">
          <Breadcrumbs items={breadcrumbItems} />
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-4">
            <Link to="/collections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isNL ? "Terug naar lookbook" : "Back to lookbook"}
            </Link>
          </Button>
        </div>
      </div>

      <section className="pt-6 lg:pt-10 pb-10 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            {isNL ? "Project" : "Project"}
          </p>
          <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-4">
            {collection.name}
          </h1>
          <p className="text-muted-foreground text-body-lg max-w-2xl">{collection.tagline}</p>
          <p className="text-muted-foreground text-sm max-w-2xl mt-4">
            {isNL
              ? "Inspiratie en sfeerbeeld. Geen geleverd project. Een startpunt voor uw eigen ontwerp."
              : "Mood and inspiration. Not a delivered project. A starting point for your own design."}
          </p>
        </div>
      </section>

      <section className="pb-24 lg:pb-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {collection.images.map((img, i) => (
              <div key={i} className="relative aspect-[4/5] bg-muted overflow-hidden rounded-sm">
                {img && (
                  <BlurImage
                    src={img}
                    alt={`${collection.name} ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-border/40 text-center">
            <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-4">
              {isNL ? "Ontwerp uw eigen tafel in deze sfeer" : "Design your own table in this mood"}
            </h2>
            <Button asChild variant="sera-primary" size="lg">
              <Link to="/atelier">
                {isNL ? "Ontwerp uw tafel" : "Design your table"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CollectionDetail;
