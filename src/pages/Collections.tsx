import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { BlurImage } from "@/components/ui/blur-image";
import { Hairline } from "@/components/ui/hairline";
import { STYLE_COLLECTIONS, type StyleCollection } from "@/data/collections";

// Elk project krijgt een tweeluik: een staand hoofdbeeld en een liggend
// tweede beeld, met de projectgegevens ertussen. De richting wisselt per
// project, zodat de pagina leest als een spread en niet als een stapel
// banners van gelijke hoogte.
const ProjectSpread = ({
  project,
  index,
  isNL,
}: {
  project: StyleCollection;
  index: number;
  isNL: boolean;
}) => {
  const flip = index % 2 === 1;
  const [lead, second] = [project.images[0], project.images[1] ?? project.images[0]];
  const tagline = isNL ? project.tagline : project.taglineEn;

  return (
    <article className="group">
      {/* Projectregel: nummer, naam en herkomst op één hairline */}
      <div className="flex items-baseline gap-4 lg:gap-6 pb-5">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-serif text-2xl lg:text-4xl text-foreground shrink-0">
          {project.name}
        </h2>
        <Hairline variant="dark" className="flex-1 translate-y-[-0.4em] hidden sm:block" />
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground shrink-0 hidden sm:block">
          {project.material}
        </span>
      </div>

      {/*
        Twee grid-rijen: het hoofdbeeld overspant ze allebei en bepaalt daarmee
        de hoogte van het blok. Rij 1 is zo hoog als het bijschrift, rij 2 krijgt
        precies de rest, zodat het tweede beeld exact met het hoofdbeeld
        uitlijnt zonder gat of overschot.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-6 lg:gap-x-10 lg:gap-y-6">
        {/* Hoofdbeeld */}
        <Link
          to={`/collections/${project.slug}`}
          className={`block relative overflow-hidden bg-muted lg:col-span-8 lg:row-start-1 lg:row-span-2 ${
            flip ? "lg:col-start-5" : "lg:col-start-1"
          }`}
        >
          <div className="aspect-[4/3] lg:aspect-[5/4]">
            {lead && (
              <BlurImage
                src={lead}
                alt={`${project.name}, ${tagline}`}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
            )}
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10 pointer-events-none" />
        </Link>

        {/* Bijschrift */}
        <div
          className={`lg:col-span-4 lg:row-start-1 ${
            flip ? "lg:col-start-1" : "lg:col-start-9"
          }`}
        >
          <p className="font-serif text-body-lg lg:text-xl text-foreground leading-snug">
            {tagline}
          </p>

          <dl className="mt-6 lg:mt-8 border-t border-foreground/10">
            {[
              [isNL ? "Steensoort" : "Stone", project.material],
              [
                isNL ? "Toepassing" : "Application",
                isNL ? project.application : project.applicationEn,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between py-2.5 border-b border-foreground/10"
              >
                <dt className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {label}
                </dt>
                <dd className="text-sm text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <Link
            to={`/collections/${project.slug}`}
            className="inline-flex items-center gap-2 mt-6 font-sans text-[10px] uppercase tracking-[0.25em] text-foreground border-b border-foreground/30 pb-1 transition-colors hover:border-foreground"
          >
            {isNL ? "Bekijk project" : "View project"}
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Tweede beeld, vult de resthoogte naast het hoofdbeeld */}
        <Link
          to={`/collections/${project.slug}`}
          className={`relative block overflow-hidden bg-muted lg:col-span-4 lg:row-start-2 lg:min-h-[140px] ${
            flip ? "lg:col-start-1" : "lg:col-start-9"
          }`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="aspect-[4/3] lg:aspect-auto lg:absolute lg:inset-0">
            {second && (
              <BlurImage
                src={second}
                alt=""
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
            )}
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10 pointer-events-none" />
        </Link>
      </div>
    </article>
  );
};

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
    { name: "Lookbook", url: "/collections" },
  ]);

  return (
    <Layout>
      <SEOHead title={seoTitle} description={seoDescription} structuredData={breadcrumbSchema} />

      {/* ── Kop ─────────────────────────────────────────────── */}
      <section className="pt-28 lg:pt-36 pb-10 lg:pb-14 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="flex items-center gap-6 mb-10 lg:mb-14">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? "Inspiratie" : "Inspiration"}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
            <h1 className="lg:col-span-7 font-serif text-display-md lg:text-display-lg text-foreground leading-[1.05]">
              {isNL ? "Lookbook" : "Lookbook"}
            </h1>
            <p className="lg:col-span-5 text-muted-foreground text-body-md lg:pb-2">
              {isNL
                ? "Een verzameling sferen die laat zien hoe natuursteen in uiteenlopende interieurs kan landen. Bedoeld ter inspiratie, als startpunt voor uw eigen ontwerp."
                : "A collection of moods showing how natural stone can land in different interiors. Intended as inspiration, as a starting point for your own design."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Projecten ───────────────────────────────────────── */}
      <section className="pb-20 lg:pb-28 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="flex flex-col gap-20 lg:gap-32">
            {STYLE_COLLECTIONS.map((project, i) => (
              <ProjectSpread key={project.slug} project={project} index={i} isNL={isNL} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Afsluiting ──────────────────────────────────────── */}
      <section className="pb-24 lg:pb-36 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="border-t border-foreground/10 pt-12 lg:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
            <div className="lg:col-span-7">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-5">
                {isNL ? "Uw project" : "Your project"}
              </p>
              <p className="font-serif text-2xl lg:text-4xl text-foreground leading-snug max-w-xl">
                {isNL
                  ? "Elk blad wordt op maat gezaagd. Het volgende project is dat van u."
                  : "Every top is cut to measure. The next project is yours."}
              </p>
            </div>
            <div className="lg:col-span-5 lg:pb-2">
              <p className="text-muted-foreground text-body-md mb-6">
                {isNL
                  ? "Stel uw tafel samen in de configurator, of leg uw idee voor en wij denken mee over formaat en steensoort."
                  : "Configure your table, or share your idea and we will think along on size and stone."}
              </p>
              <Link
                to="/configurator"
                className="inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.25em] text-foreground border-b border-foreground/30 pb-1 transition-colors hover:border-foreground"
              >
                {isNL ? "Ontwerp uw tafel" : "Design your table"}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
