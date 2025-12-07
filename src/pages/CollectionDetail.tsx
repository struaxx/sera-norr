import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import terraImage from "@/assets/terra-collection.jpg";
import vantaImage from "@/assets/vanta-collection.jpg";
import nordImage from "@/assets/nord-collection.jpg";

const collectionsData = {
  terra: {
    name: "TERRA",
    subtitle: "Travertine Forms",
    description: "Warm, organic shapes carved from Italian travertine. Each piece celebrates the natural beauty of fossilized stone.",
    longDescription: "The TERRA collection draws from the ancient warmth of Italian travertine—stone formed over millennia from mineral springs, carrying within it the memory of water. Each piece reveals the characteristic pitting and honeyed tones that make travertine one of nature's most expressive materials. We work with the stone's natural inclusions, allowing its imperfections to become defining features rather than flaws to be hidden.",
    image: terraImage,
    materials: ["Italian Travertine", "Natural Finish", "Honed Surface"],
    products: [
      { id: 1, name: "TERRA Coffee Table — Organic Form", price: "From €3,200", dimensions: "L120 × W80 × H40 cm" },
      { id: 2, name: "TERRA Console — Curved Edge", price: "From €4,500", dimensions: "L160 × W45 × H85 cm" },
      { id: 3, name: "TERRA Side Table — Monolith", price: "From €1,800", dimensions: "Ø45 × H55 cm" },
      { id: 4, name: "TERRA Dining Table — Cathedral", price: "From €8,500", dimensions: "L240 × W110 × H75 cm" },
    ],
  },
  vanta: {
    name: "VANTA",
    subtitle: "Calacatta Viola Sculptures",
    description: "Bold violet veining against pristine white. Sculptural statements in the rarest marble.",
    longDescription: "VANTA celebrates Calacatta Viola—among the rarest and most dramatic marbles quarried from the Apuan Alps. Its bold violet veining against luminous white creates pieces that are as much sculpture as furniture. Each slab is carefully selected for its unique pattern, ensuring that no two VANTA pieces are ever identical. This is marble at its most expressive, transformed into functional art.",
    image: vantaImage,
    materials: ["Calacatta Viola Marble", "Polished Finish", "Bookmatched Veining"],
    products: [
      { id: 1, name: "VANTA Dining Table — Cylindrical Pedestal", price: "From €12,500", dimensions: "Ø150 × H75 cm" },
      { id: 2, name: "VANTA Coffee Table — Rectangular", price: "From €5,800", dimensions: "L140 × W70 × H35 cm" },
      { id: 3, name: "VANTA Console — Sculptural Base", price: "From €7,200", dimensions: "L180 × W40 × H90 cm" },
      { id: 4, name: "VANTA Side Table — Drum", price: "From €3,400", dimensions: "Ø50 × H50 cm" },
    ],
  },
  nord: {
    name: "NORD",
    subtitle: "Mineral Composites",
    description: "Raw concrete meets refined mineral aggregates. Brutalist elegance for the modern interior.",
    longDescription: "NORD explores the architectural potential of mineral composites—concrete enhanced with carefully selected aggregates that reveal themselves through the surface. Drawing inspiration from Nordic brutalism and Japanese minimalism, each piece balances raw texture with refined proportion. The collection speaks to those who find beauty in restraint, weight, and the honest expression of material.",
    image: nordImage,
    materials: ["Mineral Composite", "Natural Aggregate", "Matte Finish"],
    products: [
      { id: 1, name: "NORD Dining Table — Block", price: "From €4,200", dimensions: "L200 × W100 × H75 cm" },
      { id: 2, name: "NORD Side Table — Sculptural", price: "From €1,600", dimensions: "Ø40 × H50 cm" },
      { id: 3, name: "NORD Bench — Monolithic", price: "From €2,800", dimensions: "L160 × W40 × H45 cm" },
      { id: 4, name: "NORD Plinth — Display", price: "From €1,200", dimensions: "W40 × D40 × H100 cm" },
    ],
  },
};

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const collection = collectionsData[collectionId as keyof typeof collectionsData];

  if (!collection) {
    return (
      <Layout>
        <section className="pt-40 pb-24">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="font-serif text-display-md text-foreground mb-4">Collection Not Found</h1>
            <Button asChild variant="atelier">
              <Link to="/collections">View All Collections</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Link */}
      <div className="fixed top-24 left-6 lg:left-12 z-30">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link to="/collections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Collections
          </Link>
        </Button>
      </div>

      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {collection.subtitle}
              </p>
              <h1 className="font-serif text-display-lg text-foreground mb-6">
                {collection.name}
              </h1>
              <p className="text-muted-foreground text-body-lg leading-relaxed mb-8">
                {collection.longDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                {collection.materials.map((material) => (
                  <span
                    key={material}
                    className="px-4 py-2 bg-secondary text-foreground text-xs uppercase tracking-wider"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 image-reveal">
              <div className="aspect-[4/5] bg-muted">
                <img
                  src={collection.image}
                  alt={`${collection.name} Collection`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="font-serif text-display-sm text-foreground">
              Pieces
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {collection.products.map((product) => (
              <article key={product.id} className="group">
                <div className="aspect-[4/3] bg-muted mb-6 overflow-hidden image-reveal">
                  <img
                    src={collection.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {product.dimensions}
                    </p>
                  </div>
                  <p className="font-sans text-sm text-foreground whitespace-nowrap">
                    {product.price}
                  </p>
                </div>
                <div className="mt-4">
                  <Button asChild variant="atelier-subtle" size="sm">
                    <Link to="/contact">
                      Request Quote
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke CTA */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-display-sm mb-6">
            Custom Dimensions or Materials?
          </h2>
          <p className="text-background/80 text-body-md max-w-xl mx-auto mb-8">
            Every {collection.name} piece can be customized. Discuss your vision with our atelier.
          </p>
          <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
            <Link to="/bespoke">Start Bespoke Project</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CollectionDetail;
