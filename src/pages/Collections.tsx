import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { BlurImage } from "@/components/ui/blur-image";
import { ArrowRight } from "lucide-react";
import { STYLE_COLLECTIONS } from "@/data/collections";

const Collections = () => {
  const { i18n } = useTranslation();
  const isNL = (i18n.resolvedLanguage ?? i18n.language ?? "nl").toLowerCase().startsWith("nl");

  const seoTitle = isNL
    ? "Lookbook | Sera Norr"
    : "Lookbook | Sera Norr";
  const seoDescription = isNL
    ? "Lookbook ter inspiratie: ingerichte interieurs als startpunt voor uw eigen ontwerp in natuursteen."
    : "Lookbook for inspiration: curated interiors as a starting point for your own bespoke stone design.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: isNL ? "Lookbook" : "Lookbook", url: "/collections" },
  ]);

  return (
    <Layout>
      <SEOHead title={seoTitle} description={seoDescription} structuredData={breadcrumbSchema} />

      <section className="pt-28 lg:pt-36 pb-12 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            {isNL ? "Inspiratie" : "Inspiration"}
          </p>
          <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
            {isNL ? "Lookbook" : "Lookbook"}
          </h1>
          <p className="text-muted-foreground text-body-md max-w-2xl">
            {isNL
              ? "Een verzameling sferen die laten zien hoe natuursteen in uiteenlopende interieurs kan landen. Bedoeld ter inspiratie. Een startpunt voor uw eigen ontwerp."
              : "A collection of moods that show how natural stone can land in different interiors. Intended as inspiration. A starting point for your own design."}
          </p>
        </div>
      </section>

      <section className="pb-24 lg:pb-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl space-y-8">
          {STYLE_COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              to={`/collections/${c.slug}`}
              className="group block border border-border/40 hover:border-foreground/40 transition-colors duration-500 rounded-sm overflow-hidden bg-secondary/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-3 relative aspect-[16/9] md:aspect-[3/2] bg-muted overflow-hidden">
                  {c.cover && (
                    <BlurImage
                      src={c.cover}
                      alt={c.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  )}
                </div>
                <div className="md:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
                  <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-3">
                    {c.name}
                  </h2>
                  <p className="text-muted-foreground text-body-md mb-6">{c.tagline}</p>
                  <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-foreground link-underline">
                    {isNL ? "Bekijk lookbook" : "View lookbook"}
                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
