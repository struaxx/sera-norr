import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";
import nordImage from "@/assets/nord-collection.jpg";

const collections = [
  {
    id: "terra",
    name: "TERRA",
    subtitle: "Travertine Forms",
    description: "Warm, organic shapes carved from Italian travertine. Each piece celebrates the natural beauty of fossilized stone, with characteristic pitting and warm honey tones that speak of ancient seas and timeless elegance.",
    image: terraImage,
    pieces: 8,
  },
  {
    id: "vanta",
    name: "VANTA",
    subtitle: "Calacatta Viola Sculptures",
    description: "Bold violet veining against pristine white marble creates dramatic sculptural statements. The VANTA collection transforms the rarest Calacatta Viola into functional art, each piece a celebration of geological drama.",
    image: vantaImage,
    pieces: 6,
  },
  {
    id: "nord",
    name: "NORD",
    subtitle: "Mineral Composites",
    description: "Raw concrete meets refined mineral aggregates in our most architectural collection. NORD brings brutalist elegance to the modern interior, with textured surfaces that reveal hidden depths.",
    image: nordImage,
    pieces: 5,
  },
];

const Collections = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-in">
              The Collections
            </p>
            <h1 className="font-serif text-display-lg text-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Material Narratives
            </h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Each collection represents a dialogue between form and material. 
              We do not impose shapes upon stone—we discover them, guided by 
              the unique character of each rare material.
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
                  <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                    {collection.pieces} Pieces
                  </p>
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
                        Explore Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke CTA */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Beyond the Collections
          </p>
          <h2 className="font-serif text-display-sm text-foreground mb-6 max-w-2xl mx-auto">
            Envision something unique?
          </h2>
          <p className="text-muted-foreground text-body-md max-w-xl mx-auto mb-8">
            Our bespoke service creates one-of-a-kind pieces tailored to your space, 
            your materials, your vision.
          </p>
          <Button asChild variant="atelier-filled">
            <Link to="/bespoke">Start a Bespoke Project</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
