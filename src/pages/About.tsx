import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              About the Atelier
            </p>
            <h1 className="font-serif text-display-lg text-foreground mb-8">
              Form Follows Material
            </h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed max-w-2xl">
              Sera Norr is a bespoke furniture atelier dedicated to the sculptural 
              potential of natural stone. We create objects that exist at the 
              intersection of architecture, art, and function.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-8">
                Objects shaped by material, proportion, and silence.
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-muted-foreground text-body-md leading-relaxed">
                We believe furniture should be more than functional—it should be 
                meaningful. Each Sera Norr piece begins with stone: its weight, 
                its history, its unique character. We do not impose forms upon 
                our materials. Instead, we listen to them, allowing their natural 
                qualities to guide our hands.
              </p>
              <p className="text-muted-foreground text-body-md leading-relaxed">
                Our name draws from the northern light—the soft, diffused quality 
                that reveals truth in surfaces. Like that light, we seek to 
                illuminate the inherent beauty of rare materials, creating pieces 
                that grow more beautiful with time and use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Our Values
            </p>
            <h2 className="font-serif text-display-sm text-foreground">
              Principles of Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            <div>
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Material Obsession
              </h3>
              <p className="text-muted-foreground text-body-sm leading-relaxed">
                We source only exceptional materials—stones quarried in limited 
                quantities, chosen for their unique character. Every piece of 
                Calacatta Viola, every block of travertine, is personally 
                selected for its narrative potential.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Sculptural Intent
              </h3>
              <p className="text-muted-foreground text-body-sm leading-relaxed">
                Our furniture is designed to command space, to create moments of 
                pause. We consider negative space as carefully as form, allowing 
                each piece to breathe within its environment.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-foreground mb-4">
                European Craft
              </h3>
              <p className="text-muted-foreground text-body-sm leading-relaxed">
                Every piece is crafted by master artisans in our European 
                workshop. We combine centuries-old stone-working traditions 
                with contemporary precision, honoring both heritage and innovation.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Permanence
              </h3>
              <p className="text-muted-foreground text-body-sm leading-relaxed">
                We create objects meant to last generations. In an age of 
                disposability, we believe in the quiet revolution of making 
                things that endure—pieces that will be inherited, not discarded.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Restraint
              </h3>
              <p className="text-muted-foreground text-body-sm leading-relaxed">
                True luxury lies in what is left out. We design with 
                deliberate restraint, eliminating the unnecessary to 
                reveal the essential. Every line, every curve, every 
                joint is considered and justified.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Collaboration
              </h3>
              <p className="text-muted-foreground text-body-sm leading-relaxed">
                The most meaningful pieces emerge from dialogue—between 
                material and maker, between atelier and client. We 
                welcome your vision as the starting point for something 
                extraordinary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/60 mb-6">
              The Studio
            </p>
            <h2 className="font-serif text-display-sm mb-8">
              Crafted in Europe
            </h2>
            <p className="text-background/80 text-body-lg leading-relaxed mb-12">
              Our atelier is both workshop and sanctuary—a space where rare materials 
              are transformed into objects of permanence. Visitors are welcome 
              by appointment to experience our craft firsthand.
            </p>
            <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
              <Link to="/contact">Arrange a Visit</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
