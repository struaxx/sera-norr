import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const processSteps = [
  {
    number: "01",
    title: "Consultation",
    description: "We begin with a conversation about your space, your needs, and your aesthetic vision. Share inspiration, dimensions, and dreams.",
  },
  {
    number: "02",
    title: "Concept & Materials",
    description: "Our atelier develops initial sketches and material proposals. We source rare stones and present options tailored to your project.",
  },
  {
    number: "03",
    title: "Design Development",
    description: "Refined drawings, 3D visualizations, and material samples. Every proportion is considered, every detail refined.",
  },
  {
    number: "04",
    title: "Craftsmanship",
    description: "Your piece is crafted by our European artisans. We document the process, keeping you connected to your object's creation.",
  },
  {
    number: "05",
    title: "Delivery & Installation",
    description: "White-glove delivery and professional installation. Your bespoke piece finds its home.",
  },
];

const Bespoke = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    projectType: "",
    timeline: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry Received",
      description: "Thank you for your interest. Our atelier will be in touch within 48 hours.",
    });
    setFormData({ name: "", email: "", location: "", projectType: "", timeline: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Bespoke Atelier
            </p>
            <h1 className="font-serif text-display-lg text-foreground mb-8">
              Your Vision, Realized
            </h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed">
              Every space has its own language. Our bespoke service translates your vision 
              into sculptural permanence—furniture designed for one space alone, crafted 
              with materials chosen for you, and built to last generations.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              The Journey
            </p>
            <h2 className="font-serif text-display-sm text-foreground">
              From Concept to Creation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className={`${index === 3 || index === 4 ? "lg:col-span-1" : ""}`}
              >
                <span className="font-serif text-6xl text-border mb-4 block">
                  {step.number}
                </span>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-body-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials & Finishes */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Material Palette
              </p>
              <h2 className="font-serif text-display-sm text-foreground mb-8">
                Rare & Refined
              </h2>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-8">
                Our atelier works with an ever-evolving library of exceptional materials. 
                From rare marbles quarried in limited quantities to bespoke concrete 
                formulations, we source materials that elevate your piece beyond the ordinary.
              </p>
              <div className="space-y-4">
                <div className="border-l-2 border-brass pl-6">
                  <h4 className="font-sans text-sm uppercase tracking-wider text-foreground mb-1">Natural Stone</h4>
                  <p className="text-muted-foreground text-sm">Travertine, Calacatta Viola, Verde Alpi, Nero Marquina</p>
                </div>
                <div className="border-l-2 border-stone pl-6">
                  <h4 className="font-sans text-sm uppercase tracking-wider text-foreground mb-1">Mineral Composites</h4>
                  <p className="text-muted-foreground text-sm">Architectural concrete, terrazzo, custom aggregates</p>
                </div>
                <div className="border-l-2 border-muted-foreground pl-6">
                  <h4 className="font-sans text-sm uppercase tracking-wider text-foreground mb-1">Metal Accents</h4>
                  <p className="text-muted-foreground text-sm">Brushed brass, blackened steel, bronze patina</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Craftsmanship
              </p>
              <h2 className="font-serif text-display-sm text-foreground mb-8">
                European Heritage
              </h2>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-6">
                Every Sera Norr piece is crafted by master artisans in our European 
                workshop. We combine traditional stone-working techniques with 
                contemporary precision, ensuring each piece meets our exacting standards.
              </p>
              <p className="text-muted-foreground text-body-md leading-relaxed">
                Lead times for bespoke commissions typically range from 12 to 20 weeks, 
                depending on material sourcing and complexity. We believe in craftsmanship 
                that cannot be rushed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/60 mb-4">
                Begin Your Project
              </p>
              <h2 className="font-serif text-display-sm">
                Commission Inquiry
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    Project Type
                  </label>
                  <Input
                    type="text"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder="Dining table, console, custom..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                  Desired Timeline
                </label>
                <Input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                  placeholder="When do you envision completion?"
                />
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                  Tell Us About Your Vision
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60 resize-none"
                  placeholder="Describe your space, inspiration, materials you're drawn to..."
                />
              </div>

              <div className="pt-4">
                <Button type="submit" variant="outline" size="lg" className="w-full border-background/40 text-background hover:bg-background hover:text-foreground">
                  Submit Inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bespoke;
