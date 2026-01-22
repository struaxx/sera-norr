// ============================================
// Dossier Phase - Summary & Quote Request
// ============================================

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Download, 
  Link2, 
  Check, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Shield,
  Truck,
  Package,
  Send,
  Copy,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useConfiguratorStore } from '@/stores/configurator-store';
import { 
  formatPriceRange, 
  getLeadTimeEstimate,
  PRODUCT_TYPES,
  STONE_MATERIALS,
  SHAPES,
  FINISHES,
  EDGE_PROFILES,
  BASES,
  EXTRAS_PRICING,
  calculatePriceEstimate,
} from '@/lib/configurator';
import { requestQuote } from '@/lib/configurator/api';

interface DossierPhaseProps {
  onBack: () => void;
  isNL?: boolean;
}

export function DossierPhase({ onBack, isNL = true }: DossierPhaseProps) {
  const { toast } = useToast();
  const { config, inspirationItems, generateBuildCode, buildCode } = useConfiguratorStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wantsSamples, setWantsSamples] = useState(false);
  const [wantsCall, setWantsCall] = useState(false);
  
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    notes: '',
  });

  const priceEstimate = calculatePriceEstimate(config);
  const leadTime = getLeadTimeEstimate(config);
  const currentBuildCode = buildCode || generateBuildCode();

  // Get display names
  const productName = PRODUCT_TYPES.find(p => p.id === config.productType)?.name[isNL ? 'nl' : 'en'];
  const stoneName = STONE_MATERIALS.find(s => s.id === config.stone)?.name[isNL ? 'nl' : 'en'];
  const shapeName = SHAPES.find(s => s.id === config.shape)?.name[isNL ? 'nl' : 'en'];
  const finishName = FINISHES.find(f => f.id === config.finish)?.name[isNL ? 'nl' : 'en'];
  const edgeName = EDGE_PROFILES.find(e => e.id === config.edgeProfile)?.name[isNL ? 'nl' : 'en'];
  const baseName = BASES.find(b => b.id === config.baseType)?.name[isNL ? 'nl' : 'en'];

  const dimensionString = config.shape === 'round' && config.dimensions.radius
    ? `⌀${config.dimensions.radius * 2} × H${config.dimensions.height} cm`
    : `${config.dimensions.length} × ${config.dimensions.width} × H${config.dimensions.height} cm`;

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/atelier?build=${currentBuildCode}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: isNL ? 'Link gekopieerd' : 'Link copied',
      description: isNL ? 'Deel deze link om uw ontwerp te bewaren' : 'Share this link to save your design',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contact.name || !contact.email) {
      toast({
        title: isNL ? 'Vul uw gegevens in' : 'Enter your details',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await requestQuote({
        buildCode: currentBuildCode,
        configuration: config,
        priceEstimate: {
          min: priceEstimate.priceRange.min,
          max: priceEstimate.priceRange.max,
          total: priceEstimate.totalEstimate,
        },
        contact: {
          ...contact,
          notes: `${contact.notes}${wantsSamples ? '\n\n[Wil sample kit ontvangen]' : ''}${wantsCall ? '\n\n[Wil adviesgesprek plannen]' : ''}`,
        },
        inspirationItems: inspirationItems.map(i => i.id),
      });

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: isNL ? 'Aanvraag verzonden' : 'Request submitted',
          description: result.message,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: isNL ? 'Er ging iets mis' : 'Something went wrong',
        description: isNL ? 'Probeer het opnieuw' : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <SuccessScreen buildCode={currentBuildCode} isNL={isNL} />;
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
          {isNL ? 'Stap 3 van 3' : 'Step 3 of 3'}
        </span>
        <h1 className="text-3xl md:text-4xl font-serif mb-4">
          {isNL ? 'Uw Project Dossier' : 'Your Project Dossier'}
        </h1>
        <p className="text-muted-foreground">
          {isNL 
            ? 'Controleer uw selectie en vraag een vrijblijvend voorstel aan.'
            : 'Review your selection and request a non-binding proposal.'}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Dossier Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Dossier Card */}
          <div className="bg-background border border-border rounded-sm overflow-hidden">
            {/* Dossier Header */}
            <div className="bg-secondary/30 p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      SERA NORR Dossier
                    </span>
                  </div>
                  <h2 className="text-xl font-serif">{productName} — {shapeName}</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    #{currentBuildCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="p-6 space-y-4">
              <DossierRow 
                label={isNL ? 'Afmetingen' : 'Dimensions'} 
                value={dimensionString} 
              />
              <DossierRow 
                label={isNL ? 'Bladdikte' : 'Thickness'} 
                value={`${config.dimensions.thickness} cm`} 
              />
              <DossierRow 
                label={isNL ? 'Steensoort' : 'Stone'} 
                value={stoneName || ''} 
              />
              <DossierRow 
                label={isNL ? 'Afwerking' : 'Finish'} 
                value={finishName || ''} 
              />
              <DossierRow 
                label={isNL ? 'Randprofiel' : 'Edge'} 
                value={edgeName || ''} 
              />
              <DossierRow 
                label={isNL ? 'Onderstel' : 'Base'} 
                value={baseName || ''} 
              />
              
              {/* Extras */}
              {(config.extras.sealer || config.extras.delivery || config.extras.installation) && (
                <>
                  <div className="border-t border-border pt-4 mt-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {isNL ? 'Extra opties' : 'Extras'}
                    </span>
                  </div>
                  {config.extras.sealer && (
                    <DossierRow 
                      label={EXTRAS_PRICING.sealer.name[isNL ? 'nl' : 'en']} 
                      value={`€${EXTRAS_PRICING.sealer.price}`} 
                    />
                  )}
                  {config.extras.delivery && (
                    <DossierRow 
                      label={EXTRAS_PRICING.delivery.name[isNL ? 'nl' : 'en']} 
                      value={`€${EXTRAS_PRICING.delivery.price}`} 
                    />
                  )}
                  {config.extras.installation && (
                    <DossierRow 
                      label={EXTRAS_PRICING.installation.name[isNL ? 'nl' : 'en']} 
                      value={`€${EXTRAS_PRICING.installation.price}`} 
                    />
                  )}
                </>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-secondary/20 p-6 border-t border-border">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {isNL ? 'Prijsindicatie' : 'Price indication'}
                </span>
                <span className="text-2xl font-serif">
                  {config.stone === 'custom' 
                    ? (isNL ? 'Op aanvraag' : 'On request')
                    : formatPriceRange(priceEstimate.priceRange.min, priceEstimate.priceRange.max)
                  }
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {priceEstimate.disclaimer}
              </p>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="grid grid-cols-2 gap-4">
            <TrustCard 
              icon={<Clock className="w-5 h-5" />}
              title={isNL ? 'Levertijd' : 'Lead time'}
              value={`${leadTime.min}-${leadTime.max} ${isNL ? 'weken' : 'weeks'}`}
            />
            <TrustCard 
              icon={<Shield className="w-5 h-5" />}
              title={isNL ? 'Garantie' : 'Warranty'}
              value={isNL ? '2 jaar' : '2 years'}
            />
            <TrustCard 
              icon={<Truck className="w-5 h-5" />}
              title={isNL ? 'Bezorging' : 'Delivery'}
              value={isNL ? 'White-glove' : 'White-glove'}
            />
            <TrustCard 
              icon={<MapPin className="w-5 h-5" />}
              title={isNL ? 'Materiaal' : 'Material'}
              value={isNL ? 'Italië' : 'Italy'}
            />
          </div>

          {/* Inspiration Items */}
          {inspirationItems.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {isNL ? 'Uw inspiratie' : 'Your inspiration'}
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {inspirationItems.map(item => (
                  <img 
                    key={item.id}
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-sm object-cover flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Column - Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-background border border-border rounded-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-serif mb-1">
                  {isNL ? 'Vraag voorstel aan' : 'Request proposal'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isNL 
                    ? 'Wij reageren snel op uw aanvraag.'
                    : 'We will respond quickly to your request.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{isNL ? 'Naam' : 'Name'} *</Label>
                  <Input 
                    id="name"
                    value={contact.name}
                    onChange={(e) => setContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={isNL ? 'Uw volledige naam' : 'Your full name'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{isNL ? 'E-mail' : 'Email'} *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="naam@voorbeeld.nl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{isNL ? 'Telefoon' : 'Phone'}</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+31 6 12345678"
                  />
                </div>

                <div>
                  <Label htmlFor="location">{isNL ? 'Locatie / Postcode' : 'Location / Postcode'}</Label>
                  <Input 
                    id="location"
                    value={contact.location}
                    onChange={(e) => setContact(prev => ({ ...prev, location: e.target.value }))}
                    placeholder={isNL ? 'Voor bezorgkosten berekening' : 'For delivery cost calculation'}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">{isNL ? 'Opmerkingen' : 'Notes'}</Label>
                  <Textarea 
                    id="notes"
                    value={contact.notes}
                    onChange={(e) => setContact(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder={isNL ? 'Bijzondere wensen of vragen...' : 'Special requests or questions...'}
                    rows={3}
                  />
                </div>
              </div>

              {/* Soft CTAs */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="samples" 
                    checked={wantsSamples}
                    onCheckedChange={(checked) => setWantsSamples(checked === true)}
                  />
                  <div>
                    <Label htmlFor="samples" className="text-sm cursor-pointer">
                      <Package className="w-4 h-4 inline mr-2" />
                      {isNL ? 'Stuur mij een sample kit' : 'Send me a sample kit'}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isNL 
                        ? `Materiaalstalen per post (€${EXTRAS_PRICING.sampleKit.price})`
                        : `Material samples by mail (€${EXTRAS_PRICING.sampleKit.price})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="call" 
                    checked={wantsCall}
                    onCheckedChange={(checked) => setWantsCall(checked === true)}
                  />
                  <div>
                    <Label htmlFor="call" className="text-sm cursor-pointer">
                      <Phone className="w-4 h-4 inline mr-2" />
                      {isNL ? 'Plan een adviesgesprek' : 'Schedule a consultation'}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isNL 
                        ? '15 minuten telefonisch of video (gratis)'
                        : '15 minutes phone or video (free)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              variant="atelier"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                  {isNL ? 'Verzenden...' : 'Submitting...'}
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {isNL ? 'Vraag voorstel aan' : 'Request proposal'}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {isNL 
                ? 'Vrijblijvend en zonder verplichtingen'
                : 'Non-binding and without obligations'}
            </p>
          </form>
        </motion.div>
      </div>

      {/* Back Button */}
      <div className="pt-8 border-t border-border">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isNL ? 'Terug naar configurator' : 'Back to configurator'}
        </Button>
      </div>
    </div>
  );
}

// Helper Components
function DossierRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function TrustCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-secondary/20 border border-border rounded-sm p-4 text-center">
      <div className="text-muted-foreground mb-2 flex justify-center">{icon}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="text-sm font-medium mt-1">{value}</div>
    </div>
  );
}

function SuccessScreen({ buildCode, isNL }: { buildCode: string; isNL: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center py-16 space-y-6"
    >
      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-foreground" />
      </div>
      
      <div>
        <h2 className="text-2xl font-serif mb-2">
          {isNL ? 'Aanvraag ontvangen' : 'Request received'}
        </h2>
        <p className="text-muted-foreground">
          {isNL 
            ? 'Wij nemen snel contact met u op om uw project te bespreken.'
            : 'We will contact you soon to discuss your project.'}
        </p>
      </div>

      <div className="bg-secondary/20 border border-border rounded-sm p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          {isNL ? 'Uw dossier referentie' : 'Your dossier reference'}
        </div>
        <div className="font-mono text-lg">#{buildCode}</div>
      </div>

      <div className="space-y-3 pt-4">
        <Button variant="outline" className="w-full" asChild>
          <a href="/">
            {isNL ? 'Terug naar homepage' : 'Back to homepage'}
          </a>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <a href="/collecties">
            {isNL ? 'Bekijk collecties' : 'View collections'}
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
