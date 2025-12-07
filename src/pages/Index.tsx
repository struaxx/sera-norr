import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-vanta.jpg";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";
import nordImage from "@/assets/nord-collection.jpg";

const collections = [
  {
    id: "terra",
    name: "TERRA",
    subtitle: "Travertine Forms",
    description: "Warm, organic shapes carved from Italian travertine. Each piece celebrates the natural beauty of fossilized stone.",
    image: terraImage,
  },
  {
    id: "vanta",
    name: "VANTA",
    subtitle: "Calacatta Viola Sculptures",
    description: "Bold violet veining against pristine white. Sculptural statements in the rarest marble.",
    image: vantaImage,
  },
  {
    id: "nord",
    name: "NORD",
    subtitle: "Mineral Composites",
    description: "Raw concrete meets refined mineral aggregates. Brutalist elegance for the modern interior.",
    image: nordImage,
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="VANTA Collection - Sculptural marble dining table"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/20" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl stagger-children">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/80 mb-6">
            Bespoke Furniture Atelier
          </p>
          <h1 className="font-serif text-display-xl text-background mb-8 text-balance">
            VANTA
          </h1>
          <p className="font-serif text-xl lg:text-2xl text-background/90 max-w-2xl mx-auto mb-12 leading-relaxed">
            Sculpted in Calacatta Viola marble, the VANTA Collection embodies elegance 
            and strength, defined by striking violet veins and natural depth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
              <Link to="/collections">Discover Collections</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-background hover:bg-background/10">
              <Link to="/bespoke">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-background/60">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-background/30" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Our Philosophy
            </p>
            <h2 className="font-serif text-display-md text-foreground mb-8">
              Objects shaped by material, proportion, and silence.
            </h2>
            <p className="text-muted-foreground text-body-lg leading-relaxed max-w-2xl mx-auto">
              Every Sera Norr piece begins with stone—its weight, its history, its potential. 
              We collaborate with rare materials to create furniture that exists at the 
              intersection of sculpture and function.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Explore
              </p>
              <h2 className="font-serif text-display-sm text-foreground">
                Collections
              </h2>
            </div>
            <Button asChild variant="link" className="mt-4 lg:mt-0 text-muted-foreground hover:text-foreground">
              <Link to="/collections">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {collections.map((collection, index) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.id}`}
                className="group block"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="image-reveal aspect-[4/5] bg-muted mb-6">
                  <img
                    src={collection.image}
                    alt={`${collection.name} Collection`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                    {collection.name}
                  </h3>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {collection.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke CTA */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/60 mb-6">
              Bespoke Atelier
            </p>
            <h2 className="font-serif text-display-md mb-8">
              Your Vision, Our Craft
            </h2>
            <p className="text-background/80 text-body-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Every space deserves an object made for it alone. Our bespoke service 
              transforms your vision into sculptural permanence—from initial sketch 
              to final installation.
            </p>
            <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
              <Link to="/bespoke">Begin Your Project</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Teaser */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-4">
                Visit Our Showroom
              </h2>
              <p className="text-muted-foreground text-body-md">
                Experience our collections in person. By appointment only.
              </p>
            </div>
            <Button asChild variant="atelier" size="lg">
              <Link to="/contact">Schedule a Visit</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
