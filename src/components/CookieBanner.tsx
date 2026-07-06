import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Settings2 } from 'lucide-react';
import { 
  getConsent, 
  setConsent, 
  hasConsentDecision, 
  acceptAll, 
  acceptNecessaryOnly,
  type ConsentState 
} from '@/lib/consent';
import { initMarketingScripts } from '@/lib/marketing-scripts';

export function CookieBanner() {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsentState] = useState<ConsentState>(getConsent());
  
  useEffect(() => {
    // Show banner if no consent decision has been made
    if (!hasConsentDecision()) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    
    // If consent was already given for marketing, initialize scripts
    const currentConsent = getConsent();
    if (currentConsent.marketing) {
      initMarketingScripts();
    }
  }, []);
  
  const handleAcceptAll = () => {
    const newConsent = acceptAll();
    setConsentState(newConsent);
    setIsVisible(false);
    initMarketingScripts();
  };
  
  const handleAcceptNecessary = () => {
    acceptNecessaryOnly();
    setIsVisible(false);
  };
  
  const handleSavePreferences = () => {
    const newConsent = setConsent({
      analytics: consent.analytics,
      marketing: consent.marketing,
    });
    setConsentState(newConsent);
    setIsVisible(false);
    
    if (newConsent.marketing) {
      initMarketingScripts();
    }
  };
  
  const toggleAnalytics = () => {
    setConsentState((prev) => ({ ...prev, analytics: !prev.analytics }));
  };
  
  const toggleMarketing = () => {
    setConsentState((prev) => ({ ...prev, marketing: !prev.marketing }));
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-3xl mx-auto bg-background border border-border shadow-elevated">
            {/* Header */}
            <div className="flex items-start justify-between p-4 md:p-6 pb-0">
              <div>
                <h3 className="font-serif text-lg text-foreground">
                  {isNL ? 'Cookie voorkeuren' : 'Cookie preferences'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  {isNL 
                    ? 'Wij gebruiken cookies om uw ervaring te verbeteren en onze diensten te optimaliseren.'
                    : 'We use cookies to enhance your experience and optimize our services.'}
                </p>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={isNL ? 'Sluiten' : 'Close'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Preferences Panel */}
            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 md:px-6 py-4 space-y-4 border-t border-border mt-4">
                    {/* Necessary - Always on */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">
                          {isNL ? 'Noodzakelijk' : 'Necessary'}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isNL 
                            ? 'Essentieel voor de werking van de website.'
                            : 'Essential for the website to function.'}
                        </p>
                      </div>
                      <Switch checked disabled className="opacity-50" />
                    </div>
                    
                    {/* Analytics */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics" className="text-sm font-medium text-foreground">
                          {isNL ? 'Analytisch' : 'Analytics'}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isNL 
                            ? 'Helpt ons te begrijpen hoe bezoekers de site gebruiken.'
                            : 'Helps us understand how visitors use the site.'}
                        </p>
                      </div>
                      <Switch 
                        id="analytics"
                        checked={consent.analytics}
                        onCheckedChange={toggleAnalytics}
                      />
                    </div>
                    
                    {/* Marketing */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing" className="text-sm font-medium text-foreground">
                          Marketing
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isNL 
                            ? 'Maakt gepersonaliseerde advertenties mogelijk.'
                            : 'Enables personalized advertising.'}
                        </p>
                      </div>
                      <Switch 
                        id="marketing"
                        checked={consent.marketing}
                        onCheckedChange={toggleMarketing}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 md:p-6 pt-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings2 className="h-4 w-4" />
                  {isNL ? 'Voorkeuren' : 'Preferences'}
                </button>
                <Link 
                  to="/privacy" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
                >
                  {isNL ? 'Privacybeleid' : 'Privacy policy'}
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {showPreferences ? (
                  <Button
                    onClick={handleSavePreferences}
                    variant="atelier-filled"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {isNL ? 'Voorkeuren opslaan' : 'Save preferences'}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleAcceptNecessary}
                      variant="atelier"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      {isNL ? 'Alleen noodzakelijk' : 'Necessary only'}
                    </Button>
                    <Button
                      onClick={handleAcceptAll}
                      variant="atelier-filled"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      {isNL ? 'Alles accepteren' : 'Accept all'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Component to open cookie preferences from footer
 */
export function CookiePreferencesButton() {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  
  const handleOpenPreferences = () => {
    // Dispatch custom event to show cookie banner
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  };
  
  return (
    <button
      onClick={handleOpenPreferences}
      className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline text-left"
    >
      {isNL ? 'Cookievoorkeuren' : 'Cookie preferences'}
    </button>
  );
}
