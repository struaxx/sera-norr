import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema, Breadcrumbs } from "@/components/seo";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hairline } from "@/components/ui/hairline";
import { journalArticles } from "@/data/journal";

export default function Journal() {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === "nl";

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: t("journal.title"), href: "/journal" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isNL ? "nl-NL" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const schemaItems = breadcrumbItems.map((item) => ({ name: item.label, url: item.href }));

  const featured = journalArticles[0];
  const rest = journalArticles.slice(1);

  return (
    <Layout>
      <SEOHead
        title={t("journal.seo.title")}
        description={t("journal.seo.description")}
        titleEn="Journal, Stone Furniture Insights | SERA NORR"
        descriptionEn="Articles on natural stone materials, care and choosing the right stone for a bespoke table, from the SERA NORR atelier."
        structuredData={generateBreadcrumbSchema(schemaItems)}
      />

      {/* Hero Section */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} className="mb-8 opacity-60 text-[10px]" />

          <div className="max-w-3xl">
            <p className="micro-label mb-6">{t("journal.subtitle")}</p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {t("journal.title")}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl">
              {t("journal.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-6 mb-16 lg:mb-20">
              <Hairline className="flex-1" />
              <span className="micro-label shrink-0">{isNL ? "Uitgelicht" : "Featured"}</span>
              <Hairline className="flex-1" />
            </div>

            <Link to={`/journal/${featured.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="image-reveal">
                  <div className="aspect-[4/3] bg-secondary/50 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-xl text-foreground/20">Journal</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="editorial-caption-label mb-4">
                    {t(`journal.categories.${featured.category}`)}
                  </p>
                  <h2 className="font-serif text-display-sm text-foreground mb-5 group-hover:text-foreground/80 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-body-md text-muted-foreground leading-relaxed mb-6 max-w-md">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDate(featured.date)}
                    </span>
                    <span>·</span>
                    <span>
                      {featured.readTime} {t("journal.minRead")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium uppercase tracking-[0.1em] text-foreground">
                      {isNL ? "Lees artikel" : "Read article"}
                    </span>
                    <span className="flex items-center justify-center w-8 h-8 border border-foreground/15 group-hover:border-foreground/30 group-hover:translate-x-1 transition-all duration-400">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Additional articles — only when there is more than one */}
      {rest.length > 0 && (
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-6 mb-16 lg:mb-20">
              <Hairline className="flex-1" />
              <span className="micro-label shrink-0">{isNL ? "Alle artikelen" : "All articles"}</span>
              <Hairline className="flex-1" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {rest.map((article, index) => (
                <Link key={article.slug} to={`/journal/${article.slug}`} className="group">
                  <article>
                    <div className="relative mb-6">
                      <span className="font-serif text-[60px] lg:text-[80px] text-foreground/[0.03] absolute -top-2 -left-1 leading-none select-none pointer-events-none">
                        0{index + 2}
                      </span>
                      <div className="aspect-[4/3] bg-secondary/30 overflow-hidden group-hover:bg-secondary/50 transition-colors" />
                    </div>
                    <p className="editorial-caption-label mb-2">
                      {t(`journal.categories.${article.category}`)}
                    </p>
                    <h3 className="font-serif text-xl text-foreground mb-3 group-hover:text-foreground/80 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-body-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(article.date)}</span>
                      <span>·</span>
                      <span>
                        {article.readTime} {t("journal.minRead")}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-sm text-background mb-4">{t("journal.cta.title")}</h2>
            <p className="text-background/70 text-body-md mb-10">{t("journal.cta.description")}</p>
            <Button
              asChild
              variant="sera-primary"
              size="lg"
              className="bg-background text-foreground hover:bg-background/95"
            >
              <Link to="/atelier">
                {t("journal.cta.button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
