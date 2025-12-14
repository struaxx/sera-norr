import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema, Breadcrumbs } from "@/components/seo";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Calendar } from "lucide-react";

interface Article {
  id: string;
  slug: string;
  category: "materials" | "care" | "interiors" | "craftsmanship";
  date: string;
  readTime: number;
}

const articles: Article[] = [
  {
    id: "travertine-origins",
    slug: "travertine-origins",
    category: "materials",
    date: "2024-12-01",
    readTime: 6,
  },
  {
    id: "stone-care-guide",
    slug: "stone-care-guide",
    category: "care",
    date: "2024-11-15",
    readTime: 8,
  },
  {
    id: "calacatta-viola-rare",
    slug: "calacatta-viola-rare",
    category: "materials",
    date: "2024-11-01",
    readTime: 5,
  },
  {
    id: "amsterdam-residence",
    slug: "amsterdam-residence",
    category: "interiors",
    date: "2024-10-20",
    readTime: 7,
  },
  {
    id: "european-craftsmanship",
    slug: "european-craftsmanship",
    category: "craftsmanship",
    date: "2024-10-05",
    readTime: 6,
  },
  {
    id: "choosing-stone-dining",
    slug: "choosing-stone-dining",
    category: "materials",
    date: "2024-09-15",
    readTime: 5,
  },
];

export default function Journal() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: t("journal.title"), href: "/journal" },
  ];

  const getCategoryLabel = (category: Article["category"]) => {
    return t(`journal.categories.${category}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(currentLang === "nl" ? "nl-NL" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const schemaItems = breadcrumbItems.map(item => ({ name: item.label, url: item.href }));

  return (
    <Layout>
      <SEOHead
        title={t("journal.seo.title")}
        description={t("journal.seo.description")}
        titleEn="Journal — Stone Furniture Insights | SERA NORR"
        descriptionEn="Explore articles on natural stone materials, care guides, interior cases, and European craftsmanship from SERA NORR atelier."
        structuredData={generateBreadcrumbSchema(schemaItems)}
      />

      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="max-w-4xl mt-8">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {t("journal.subtitle")}
            </p>
            <h1 className="font-serif text-4xl lg:text-6xl text-foreground mb-6">
              {t("journal.title")}
            </h1>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {t("journal.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Link 
            to={`/journal/${articles[0].slug}`}
            className="group block bg-secondary/30 rounded-sm overflow-hidden transition-all duration-500 hover:bg-secondary/50"
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-8 lg:p-12">
              <div className="aspect-[4/3] bg-muted/20 rounded-sm" />
              <div className="flex flex-col justify-center">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary mb-4">
                  {getCategoryLabel(articles[0].category)}
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-4 group-hover:text-primary transition-colors">
                  {t(`journal.articles.${articles[0].id}.title`)}
                </h2>
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  {t(`journal.articles.${articles[0].id}.excerpt`)}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {formatDate(articles[0].date)}
                  </span>
                  <span>·</span>
                  <span>{articles[0].readTime} {t("journal.minRead")}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="pb-8 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-4">
            {["all", "materials", "care", "interiors", "craftsmanship"].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 font-sans text-xs uppercase tracking-[0.15em] border border-border/50 rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                {cat === "all" ? t("journal.allArticles") : t(`journal.categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {articles.slice(1).map((article) => (
              <Link
                key={article.id}
                to={`/journal/${article.slug}`}
                className="group"
              >
                <article>
                  <div className="aspect-[4/3] bg-muted/20 rounded-sm mb-5 transition-all duration-500 group-hover:bg-muted/30" />
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary mb-2 block">
                    {getCategoryLabel(article.category)}
                  </span>
                  <h3 className="font-serif text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {t(`journal.articles.${article.id}.title`)}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {t(`journal.articles.${article.id}.excerpt`)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(article.date)}</span>
                    <span>·</span>
                    <span>{article.readTime} {t("journal.minRead")}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-4">
            {t("journal.cta.title")}
          </h2>
          <p className="font-sans text-muted-foreground mb-8 max-w-lg mx-auto">
            {t("journal.cta.description")}
          </p>
          <Link
            to="/bespoke"
            className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-sans text-xs uppercase tracking-[0.15em] hover:bg-foreground/90 transition-colors"
          >
            {t("journal.cta.button")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}