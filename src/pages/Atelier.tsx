// ============================================
// Atelier Page - Complete 3-Phase Flow
// ============================================

import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, HelpCircle, Package, Phone } from 'lucide-react';
import { Layout } from '@/components/layout';
import { SEOHead } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { useConfiguratorStore, type AtelierPhase } from '@/stores/configurator-store';
import { LookbookPhase, ConfiguratorPhase, DossierPhase } from '@/components/atelier';
import { loadConfiguration } from '@/lib/configurator/api';

// Phase indicator component with reset
function PhaseIndicator({ currentPhase, onReset }: { currentPhase: AtelierPhase; onReset: () => void }) {
  const phases: { id: AtelierPhase; label: string; step: number }[] = [
    { id: 'lookbook', label: 'Inspiratie', step: 1 },
    { id: 'configurator', label: 'Ontwerp', step: 2 },
    { id: 'dossier', label: 'Dossier', step: 3 },
  ];

  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="flex items-center justify-between mb-12">
      {/* Reset button */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Reset ontwerp"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Reset</span>
      </button>

      {/* Phase steps */}
      <div className="flex items-center gap-2">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                  ${index <= currentIndex 
                    ? 'bg-foreground text-background' 
                    : 'bg-secondary text-muted-foreground'
                  }
                `}
              >
                {phase.step}
              </div>
              <span 
                className={`
                  text-sm hidden sm:block transition-colors
                  ${index <= currentIndex ? 'text-foreground' : 'text-muted-foreground'}
                `}
              >
                {phase.label}
              </span>
            </div>
            {index < phases.length - 1 && (
              <div 
                className={`
                  w-8 sm:w-16 h-px mx-2 transition-colors
                  ${index < currentIndex ? 'bg-foreground' : 'bg-border'}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Spacer for balance */}
      <div className="w-16" />
    </div>
  );
}

// Help sidebar component
function HelpSidebar({ isNL }: { isNL: boolean }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
      <Link
        to="/contact?subject=sample-kit"
        className="flex items-center gap-2 px-4 py-2.5 bg-background border border-foreground/10 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors shadow-sm"
      >
        <Package className="w-4 h-4" />
        <span className="hidden sm:inline">{isNL ? "Vraag sample kit" : "Request sample kit"}</span>
      </Link>
      <Link
        to="/contact?subject=advies"
        className="flex items-center gap-2 px-4 py-2.5 bg-background border border-foreground/10 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors shadow-sm"
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">{isNL ? "Plan kort advies" : "Schedule quick advice"}</span>
      </Link>
    </div>
  );
}

export default function Atelier() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    phase, 
    setPhase, 
    setStone, 
    setProductType,
    setSelectedCollection,
    reset
  } = useConfiguratorStore();

  // Reset function - clears state and goes to step 1
  const handleReset = () => {
    reset();
    setPhase('lookbook');
    // Clear URL params
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load saved configuration or presets from URL
  useEffect(() => {
    const buildCode = searchParams.get('build');
    const styleParam = searchParams.get('style');
    const typeParam = searchParams.get('type');

    // If no params, always start at lookbook (step 1)
    if (!buildCode && !styleParam && !typeParam) {
      // Only reset to lookbook if coming fresh (not from internal navigation)
      const hasInternalNav = sessionStorage.getItem('atelier-internal-nav');
      if (!hasInternalNav) {
        setPhase('lookbook');
      }
      return;
    }

    // Handle build code (saved configuration)
    if (buildCode) {
      loadConfiguration(buildCode).then(result => {
        if (result.success && result.configuration) {
          // Restore configuration
          const store = useConfiguratorStore.getState();
          Object.entries(result.configuration).forEach(([key, value]) => {
            if (key in store.config) {
              (store.config as any)[key] = value;
            }
          });
          // Jump to configurator if loading saved build
          setPhase('configurator');
        }
      });
      return;
    }

    // Handle style preset (from collection pages)
    if (styleParam) {
      const styleLower = styleParam.toLowerCase();
      if (styleLower === 'vanta') {
        setStone('calacattaViola');
        setSelectedCollection('vanta');
      } else if (styleLower === 'terra') {
        setStone('travertine');
        setSelectedCollection('terra');
      }
      // Skip lookbook, go directly to configurator
      setPhase('configurator');
    }

    // Handle type preset (from product pages)
    if (typeParam) {
      const typeLower = typeParam.toLowerCase();
      if (typeLower === 'dining' || typeLower === 'eettafel') {
        setProductType('dining-table');
      } else if (typeLower === 'coffee' || typeLower === 'salontafel') {
        setProductType('coffee-table');
      } else if (typeLower === 'console') {
        setProductType('console');
      } else if (typeLower === 'side' || typeLower === 'bijzettafel') {
        setProductType('side-table');
      }
      // If type is set without style, still skip to configurator
      if (!styleParam) {
        setPhase('configurator');
      }
    }
  }, [searchParams, setPhase, setStone, setProductType, setSelectedCollection]);

  const handlePhaseTransition = (newPhase: AtelierPhase) => {
    // Mark internal navigation
    sessionStorage.setItem('atelier-internal-nav', 'true');
    setPhase(newPhase);
    // Scroll to top on phase change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine language
  const isNL = true; // Could be from i18n context

  return (
    <Layout>
      <SEOHead 
        title="Atelier | Ontwerp uw maatwerk stuk | SERA NORR"
        description="Stel uw unieke natuurstenen meubel samen in ons digitale atelier. Kies materiaal, afmetingen en afwerking voor een persoonlijk voorstel."
      />

      <main className="min-h-screen py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Phase Indicator with Reset */}
          <PhaseIndicator currentPhase={phase} onReset={handleReset} />

          {/* Help sidebar */}
          <HelpSidebar isNL={isNL} />

          {/* Phase Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {phase === 'lookbook' && (
                <LookbookPhase 
                  onContinue={() => handlePhaseTransition('configurator')}
                  isNL={true}
                />
              )}

              {phase === 'configurator' && (
                <ConfiguratorPhase 
                  onBack={() => handlePhaseTransition('lookbook')}
                  onContinue={() => handlePhaseTransition('dossier')}
                  isNL={true}
                />
              )}

              {phase === 'dossier' && (
                <DossierPhase 
                  onBack={() => handlePhaseTransition('configurator')}
                  isNL={true}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </Layout>
  );
}
