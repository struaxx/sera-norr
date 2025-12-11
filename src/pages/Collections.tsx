import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";
import nordImage from "@/assets/nord-collection.jpg";

const Collections = () => {
  const { t } = useTranslation();

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

  return (
    <Layout>
      {/* Intro Block */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-muted-foreground text-body-lg leading-relaxed animate-fade-in">
              {t("collections.intro.line1")}
            </p>
            <p className="text-muted-foreground text-body-lg leading-relaxed mt-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t("collections.intro.line2")}
            </p>
          </div>
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
                        alt={`${collection.name} Collection`}
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
                    alt="Other Stones"
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
