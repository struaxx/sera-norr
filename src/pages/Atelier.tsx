// ============================================
// Atelier Page - Complete 3-Phase Flow
// ============================================

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout';
import { SEOHead } from '@/components/seo';
import { useConfiguratorStore, type AtelierPhase } from '@/stores/configurator-store';
import { LookbookPhase, ConfiguratorPhase, DossierPhase } from '@/components/atelier';
import { loadConfiguration } from '@/lib/configurator/api';

// Phase indicator component
function PhaseIndicator({ currentPhase }: { currentPhase: AtelierPhase }) {
  const phases: { id: AtelierPhase; label: string; step: number }[] = [
    { id: 'lookbook', label: 'Inspiratie', step: 1 },
    { id: 'configurator', label: 'Ontwerp', step: 2 },
    { id: 'dossier', label: 'Dossier', step: 3 },
  ];

  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="flex items-center justify-center gap-2 mb-12">
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
  );
}

export default function Atelier() {
  const [searchParams] = useSearchParams();
  const { 
    phase, 
    setPhase, 
    setStone, 
    setProductType,
    setSelectedCollection 
  } = useConfiguratorStore();

  // Load saved configuration or presets from URL
  useEffect(() => {
    const buildCode = searchParams.get('build');
    const styleParam = searchParams.get('style');
    const typeParam = searchParams.get('type');

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
    setPhase(newPhase);
    // Scroll to top on phase change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <SEOHead 
        title="Atelier | Ontwerp uw maatwerk stuk | SERA NORR"
        description="Stel uw unieke natuurstenen meubel samen in ons digitale atelier. Kies materiaal, afmetingen en afwerking voor een persoonlijk voorstel."
      />

      <main className="min-h-screen py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Phase Indicator */}
          <PhaseIndicator currentPhase={phase} />

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
