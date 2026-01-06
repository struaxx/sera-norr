import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfiguratorTeaserProps {
  isNL: boolean;
}

type StepId = 'type' | 'dimensions' | 'stone';

interface Step {
  id: StepId;
  number: string;
  title: string;
  options: string[];
}

export function ConfiguratorTeaser({ isNL }: ConfiguratorTeaserProps) {
  const [selectedStep, setSelectedStep] = useState<StepId | null>(null);
  const [selections, setSelections] = useState<Record<StepId, string | null>>({
    type: null,
    dimensions: null,
    stone: null,
  });

  const steps: Step[] = isNL ? [
    { id: 'type', number: '01', title: 'Kies type', options: ['Eettafel', 'Salontafel', 'Console', 'Bijzettafel'] },
    { id: 'dimensions', number: '02', title: 'Afmetingen', options: ['Klein', 'Medium', 'Groot', 'Op maat'] },
    { id: 'stone', number: '03', title: 'Steensoort', options: ['Travertin', 'Calacatta Viola', 'Emperador', 'Anders'] },
  ] : [
    { id: 'type', number: '01', title: 'Choose type', options: ['Dining table', 'Coffee table', 'Console', 'Side table'] },
    { id: 'dimensions', number: '02', title: 'Dimensions', options: ['Small', 'Medium', 'Large', 'Custom'] },
    { id: 'stone', number: '03', title: 'Stone type', options: ['Travertine', 'Calacatta Viola', 'Emperador', 'Other'] },
  ];

  const handleOptionClick = (stepId: StepId, option: string) => {
    setSelections(prev => ({ ...prev, [stepId]: option }));
    // Auto-advance to next step
    const currentIndex = steps.findIndex(s => s.id === stepId);
    if (currentIndex < steps.length - 1) {
      setTimeout(() => setSelectedStep(steps[currentIndex + 1].id), 200);
    } else {
      setTimeout(() => setSelectedStep(null), 200);
    }
  };

  const completedSteps = Object.values(selections).filter(Boolean).length;

  return (
    <div className="bg-background border border-foreground/8">
      {/* Steps grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-foreground/8">
        {steps.map((step) => {
          const isActive = selectedStep === step.id;
          const isCompleted = selections[step.id] !== null;

          return (
            <div key={step.id} className="relative">
              {/* Step header - clickable */}
              <button
                onClick={() => setSelectedStep(isActive ? null : step.id)}
                className={cn(
                  "w-full text-left p-6 lg:p-8 transition-colors duration-300",
                  isActive && "bg-secondary/30",
                  !isActive && "hover:bg-secondary/20"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 block mb-2">
                      {isNL ? 'Stap' : 'Step'} {step.number}
                    </span>
                    <h3 className="font-serif text-lg lg:text-xl text-foreground mb-1">
                      {step.title}
                    </h3>
                    {isCompleted && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Check className="w-3 h-3 text-foreground/60" />
                        {selections[step.id]}
                      </p>
                    )}
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0",
                    isCompleted ? "bg-foreground border-foreground" : "border-foreground/20",
                  )}>
                    {isCompleted && <Check className="w-3 h-3 text-background" />}
                  </div>
                </div>
              </button>

              {/* Options dropdown */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8 space-y-2">
                      {step.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(step.id, option)}
                          className={cn(
                            "w-full text-left py-3 px-4 text-sm transition-all duration-200 border",
                            selections[step.id] === option
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent text-foreground border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.02]"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* CTA bar */}
      <div className="border-t border-foreground/8 p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {completedSteps === 0 && (isNL ? "Klik op een stap om te beginnen" : "Click a step to begin")}
            {completedSteps > 0 && completedSteps < 3 && (isNL ? `${completedSteps} van 3 stappen voltooid` : `${completedSteps} of 3 steps completed`)}
            {completedSteps === 3 && (isNL ? "Klaar om door te gaan" : "Ready to continue")}
          </p>
        </div>
        <Button asChild variant="sera-primary" size="default" className="h-12 px-7">
          <Link to="/bespoke">
            {isNL ? "Start uw project" : "Start your project"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
