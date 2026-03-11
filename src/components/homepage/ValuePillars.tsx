import { motion } from "framer-motion";
import { MapPin, Truck, Clock, Shield, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Hairline } from "@/components/ui/hairline";

interface ValuePillarsProps {
  isNL: boolean;
}

interface Pillar {
  icon: React.ElementType;
  title: string;
  description: string;
}

export function ValuePillars({ isNL }: ValuePillarsProps) {
  const { ref, isInView, variants } = useScrollReveal();

  const pillars: Pillar[] = isNL ? [
    {
      icon: MapPin,
      title: "Ontworpen in Nederland",
      description: "Elk stuk ontstaat in ons atelier.",
    },
    {
      icon: Truck,
      title: "White-glove levering",
      description: "Plaatsing op locatie in NL & BE.",
    },
    {
      icon: Clock,
      title: "12–16 weken levertijd",
      description: "Bij uitloop informeren wij u tijdig.",
    },
    {
      icon: Shield,
      title: "2 jaar garantie",
      description: "Op constructie en materiaal.",
    },
    {
      icon: Gem,
      title: "Geselecteerde materialen",
      description: "Travertin, marmer, natuursteen.",
    },
  ] : [
    {
      icon: MapPin,
      title: "Designed in Netherlands",
      description: "Each piece created in our atelier.",
    },
    {
      icon: Truck,
      title: "White-glove delivery",
      description: "Installation on location in NL & BE.",
    },
    {
      icon: Clock,
      title: "12–16 weeks lead time",
      description: "We inform you promptly of any delays.",
    },
    {
      icon: Shield,
      title: "2 year warranty",
      description: "On construction and materials.",
    },
    {
      icon: Gem,
      title: "Selected materials",
      description: "Travertine, marble, natural stone.",
    },
  ];

  return (
    <section className="py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div 
          className="flex items-center gap-6 mb-16 lg:mb-20"
          variants={variants.fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Hairline className="flex-1" />
          <span className="micro-label shrink-0">{isNL ? 'Waarom SERA NORR' : 'Why SERA NORR'}</span>
          <Hairline className="flex-1" />
        </motion.div>

        {/* Pillars grid - unified block */}
        <motion.div 
          className="border border-foreground/8"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    "p-6 lg:p-8 flex flex-col",
                    // Vertical dividers on desktop
                    index > 0 && "lg:border-l lg:border-foreground/8",
                    // Horizontal dividers on tablet
                    index > 0 && index < 2 && "md:border-l md:border-foreground/8",
                    index >= 2 && "md:border-t md:border-foreground/8",
                    index >= 2 && index % 2 === 1 && "md:border-l",
                    // Mobile: all have top border except first
                    index > 0 && "border-t border-foreground/8 lg:border-t-0",
                    // Reset tablet borders for 5-column desktop
                    "lg:border-t-0"
                  )}
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    {pillar.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
