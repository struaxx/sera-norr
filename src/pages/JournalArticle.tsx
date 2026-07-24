import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema, Breadcrumbs } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { getArticleBySlug, type ArticleBlock } from "@/data/journal";

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="font-serif text-2xl lg:text-3xl text-foreground mt-14 mb-5 first:mt-0">
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-foreground/20 pl-6 font-serif text-xl lg:text-2xl text-foreground/90 leading-snug">
          {block.text}
        </blockquote>
      );
    case "list":
      return (
        <ul className="my-6 space-y-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-body-md text-muted-foreground leading-relaxed">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <p className="my-5 text-body-md text-muted-foreground leading-relaxed">{block.text}</p>
      );
  }
}

export default function JournalArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === "nl";
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <Layout>
        <SEOHead title={isNL ? "Artikel niet gevonden" : "Article not found"} description="" noindex />
        <section className="pt-40 pb-32 bg-background">
          <div className="container mx-auto px-6 lg:px-12 max-w-2xl text-center">
            <h1 className="font-serif text-display-sm text-foreground mb-4">
              {isNL ? "Dit artikel bestaat niet (meer)" : "This article doesn't exist"}
            </h1>
            <p className="text-body-md text-muted-foreground mb-8">
              {isNL
                ? "Mogelijk is de link verouderd. Bekijk de overige artikelen in de Journal."
                : "The link may be outdated. Browse the other articles in the Journal."}
            </p>
            <Button asChild variant="sera-primary">
              <Link to="/journal">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isNL ? "Terug naar Journal" : "Back to Journal"}
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(isNL ? "nl-NL" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: t("journal.title"), href: "/journal" },
    { label: article.title, href: `/journal/${article.slug}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.date,
    inLanguage: "nl",
    author: { "@type": "Organization", name: "SERA NORR" },
    publisher: {
      "@type": "Organization",
      name: "SERA NORR",
      logo: { "@type": "ImageObject", url: "https://sera-norr.com/logo.png" },
    },
    mainEntityOfPage: `https://sera-norr.com/journal/${article.slug}`,
  };

  return (
    <Layout>
      <SEOHead
        title={`${article.title} | SERA NORR`}
        description={article.metaDescription}
        type="article"
        structuredData={[
          generateBreadcrumbSchema(breadcrumbItems.map((b) => ({ name: b.label, url: b.href }))),
          articleSchema,
        ]}
      />

      <article>
        <header className="pt-28 lg:pt-36 pb-10 bg-background">
          <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-8 opacity-60 text-[10px]" />
            <p className="editorial-caption-label mb-4">{t(`journal.categories.${article.category}`)}</p>
            <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-6 leading-[1.08]">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {formatDate(article.date)}
              </span>
              <span>·</span>
              <span>
                {article.readTime} {t("journal.minRead")}
              </span>
            </div>
          </div>
        </header>

        <div className="pb-20 lg:pb-28">
          <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
            {article.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            <div className="mt-16 pt-10 border-t border-foreground/10">
              <Link
                to="/journal"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {isNL ? "Terug naar Journal" : "Back to Journal"}
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* CTA band */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-sm text-background mb-4">
              {isNL ? "Zelf een steen kiezen?" : "Choose a stone yourself?"}
            </h2>
            <p className="text-background/70 text-body-md mb-8">
              {isNL
                ? "Stel uw tafel samen in de configurator en zie direct een transparante prijsindicatie per steen."
                : "Design your table in the configurator and see a transparent price indication per stone."}
            </p>
            <Button
              asChild
              variant="sera-primary"
              size="lg"
              className="bg-background text-foreground hover:bg-background/95"
            >
              <Link to="/atelier">
                {isNL ? "Naar de configurator" : "Open the configurator"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
