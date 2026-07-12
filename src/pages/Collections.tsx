import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { BlurImage } from "@/components/ui/blur-image";
import { STYLE_COLLECTIONS } from "@/data/collections";

const Collections = () => {
  const { i18n } = useTranslation();
  const isNL = (i18n.resolvedLanguage ?? i18n.language ?? "nl").toLowerCase().startsWith("nl");

  const seoTitle = isNL
    ? "Lookbook Natuurstenen Tafels | Sera Norr"
    : "Natural Stone Table Lookbook | Sera Norr";
  const seoDescription = isNL
    ? "Lookbook ter inspiratie: interieurs met natuurstenen tafels als startpunt voor uw eigen ontwerp in travertijn of marmer."
    : "Lookbook for inspiration: interiors with natural stone tables as a starting point for your own design in travertine or marble.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: isNL ? "Lookbook" : "Lookbook", url: "/collections" },
  ]);

  return (
    <Layout>
      <SEOHead title={seoTitle} description={seoDescription} structuredData={breadcrumbSchema} />

      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
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
        <div className="flex flex-col">
          {STYLE_COLLECTIONS.map((c, i) => {
            const Wrapper: any = c.comingSoon ? "div" : Link;
            const wrapperProps = c.comingSoon
              ? { "aria-disabled": true }
              : { to: `/collections/${c.slug}` };
            return (
            <Wrapper
              key={c.slug}
              {...wrapperProps}
              className={`group relative block w-full h-[45vh] lg:h-[60vh] overflow-hidden bg-muted border-b border-foreground/5 ${c.comingSoon ? "cursor-default" : ""}`}
            >
              {c.cover && (
                <BlurImage
                  src={c.cover}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}

              {/* Bottom gradient for legibility (always on) */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/0 to-foreground/0 pointer-events-none" />

              {/* Hover overlay (desktop hover only) */}
              {!c.comingSoon && (
                <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Text block */}
              <div className="absolute bottom-8 left-6 lg:bottom-12 lg:left-12 right-6 lg:right-12 text-background">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/70 mb-3">
                  {String(i + 1).padStart(2, "0")} {isNL ? "Project" : "Project"}
                </p>
                <h2 className="font-serif text-3xl lg:text-5xl text-background">
                  {c.name}
                </h2>
                {c.comingSoon ? (
                  <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.25em] text-background/80">
                    {isNL ? "Binnenkort beschikbaar" : "Coming soon"}
                  </p>
                ) : (
                <div className="overflow-hidden">
                  <p className="text-sm lg:text-base text-background/85 mt-3 max-w-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    {c.tagline}
                  </p>
                  <span className="inline-block mt-4 text-[10px] uppercase tracking-[0.25em] text-background opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75 ease-out">
                    {isNL ? "Bekijk project" : "View project"}
                  </span>
                </div>
                )}
              </div>
            </Wrapper>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
