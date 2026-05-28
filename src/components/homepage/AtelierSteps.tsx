import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hairline } from "@/components/ui/hairline";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface AtelierStepsProps {
  isNL: boolean;
}

export function AtelierSteps({ isNL }: AtelierStepsProps) {
  const { ref, isInView, variants } = useScrollReveal();

  const steps = isNL ? [
    { number: '01', title: 'Inspiratie kiezen', description: 'Blader door onze lookbook en selecteer een stijlrichting die bij u past.' },
    { number: '02', title: 'Samenstellen in 3D', description: 'Kies materiaal, vorm en afmetingen in onze interactieve configurator.' },
    { number: '03', title: 'Dossier & aanvraag', description: 'Ontvang uw persoonlijke atelier-dossier met specificaties en voorstel.' },
  ] : [
    { number: '01', title: 'Choose inspiration', description: 'Browse our lookbook and select a style direction that suits you.' },
    { number: '02', title: 'Configure in 3D', description: 'Choose material, shape and dimensions in our interactive configurator.' },
    { number: '03', title: 'Dossier & request', description: 'Receive your personal atelier dossier with specifications and proposal.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-foreground text-background" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div 
          className="flex items-center gap-6 mb-16 lg:mb-20"
          variants={variants.fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Hairline className="flex-1 bg-background/20" />
          <span className="micro-label text-background/60 shrink-0">
            {isNL ? 'Hoe het werkt' : 'How it works'}
          </span>
          <Hairline className="flex-1 bg-background/20" />
        </motion.div>

        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="font-serif text-display-sm lg:text-display-md text-background mb-4">
            {isNL ? "Drie stappen naar uw unieke stuk" : "Three steps to your unique piece"}
          </h2>
          <p className="text-body-md text-background/70">
            {isNL 
              ? "Van inspiratie tot op maat gemaakt. Ons digitale atelier begeleidt u." 
              : "From inspiration to made-to-measure. Our digital atelier guides you."}
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-background/10 mb-16"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="bg-foreground p-8 lg:p-10"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-background/40 block mb-4">
                {isNL ? 'Stap' : 'Step'} {step.number}
              </span>
              <h3 className="font-serif text-xl lg:text-2xl text-background mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-background/60 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
            <Link to="/atelier">
              {isNL ? "Ontwerp uw tafel" : "Design your table"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-[11px] text-background/40 mt-4">
            {isNL ? "Prijsindicatie • Levertijd • Maatwerk begeleiding" : "Price indication • Lead time • Bespoke guidance"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
