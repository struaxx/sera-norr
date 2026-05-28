// ============================================
// Dossier Phase - Summary & Quote Request (V2)
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
  MapPin,
  Clock,
  Shield,
  Truck,
  Send,
  FileText,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useConfiguratorStore } from '@/stores/configurator-store';
import { 
  SHAPES,
  FINISHES,
  EDGE_PROFILES,
  BASES,
} from '@/lib/configurator';
import { getStoneById } from '@/lib/configurator/stone-library';
import { getLegById } from '@/lib/configurator/leg-library';
import { getModularLeadTime } from '@/lib/configurator/pricing-v2';
import { requestQuote } from '@/lib/configurator/api';
import { downloadDossierPDF } from '@/lib/configurator/pdf-generator';
import { supabase } from '@/integrations/supabase/client';

interface DossierPhaseProps {
  onBack: () => void;
  isNL?: boolean;
}

export function DossierPhase({ onBack, isNL = true }: DossierPhaseProps) {
  const { toast } = useToast();
  const { config, inspirationItems, generateBuildCode, buildCode, customStoneRequest, customRequests, getShareUrl } = useConfiguratorStore();
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    notes: '',
  });

  const leadTime = getModularLeadTime(config);
  const currentBuildCode = buildCode || generateBuildCode();

  // Get display names from stone library
  const stone = getStoneById(config.stone);
  const customStoneName = customStoneRequest?.stoneName;
  const stoneName = customStoneName || stone?.name || (config.stone === 'custom' ? (isNL ? 'Steen op aanvraag' : 'Stone on request') : config.stone);
  const shapeName = SHAPES.find(s => s.id === config.shape)?.name[isNL ? 'nl' : 'en'] || '';
  const finishName = FINISHES.find(f => f.id === config.finish)?.name[isNL ? 'nl' : 'en'] || '';
  const edgeName = EDGE_PROFILES.find(e => e.id === config.edgeProfile)?.name[isNL ? 'nl' : 'en'] || '';
  
  // Use new leg library if legStyle is set, otherwise fall back to legacy BASES
  const leg = config.legStyle ? getLegById(config.legStyle) : null;
  const baseName = leg?.name || BASES.find(b => b.id === config.baseType)?.name[isNL ? 'nl' : 'en'] || '';

  const dimensionString = config.shape === 'round' && config.dimensions.radius
    ? `⌀${config.dimensions.radius * 2} × H${config.dimensions.height} cm`
    : `${config.dimensions.length} × ${config.dimensions.width} × H${config.dimensions.height} cm`;

  const thicknessString = `${config.dimensions.thickness * 10}mm`;

  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: isNL ? 'Link gekopieerd' : 'Link copied',
      description: isNL ? 'Deel deze link om uw ontwerp te bewaren' : 'Share this link to save your design',
    });
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Try to find the 3D viewer element
      const viewerElement = document.querySelector('[data-viewer-capture]') as HTMLElement | null;
      
      await downloadDossierPDF({
        config,
        buildCode: currentBuildCode,
        customStoneRequest: customStoneName,
        viewerElement,
        isNL,
      });
      
      toast({
        title: isNL ? 'PDF gedownload' : 'PDF downloaded',
        description: isNL ? 'Uw dossier is opgeslagen' : 'Your dossier has been saved',
      });
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: isNL ? 'Download mislukt' : 'Download failed',
        description: isNL ? 'Probeer het opnieuw' : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields: naam, email, postcode, telefoon
    if (!contact.name || !contact.email || !contact.location || !contact.phone) {
      toast({
        title: isNL ? 'Vul alle verplichte velden in' : 'Fill in all required fields',
        description: isNL ? 'Naam, email, postcode en telefoon zijn verplicht' : 'Name, email, postcode and phone are required',
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      toast({
        title: isNL ? 'Ongeldig e-mailadres' : 'Invalid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const shareUrl = getShareUrl();
      
      // Submit the quote request
      const result = await requestQuote({
        buildCode: currentBuildCode,
        configuration: config,
        priceEstimate: {
          min: 0,
          max: 0,
          total: 0,
        },
        contact: {
          ...contact,
          notes: `${contact.notes}${customStoneName ? `\n\n[Custom steen aanvraag: ${customStoneName}]` : ''}${customRequests && Object.keys(customRequests).length > 0 ? `\n\n[Aanvullende wensen: ${Object.entries(customRequests).map(([k, v]) => `${k}: ${v}`).join(', ')}]` : ''}\n\n[Service inbegrepen: White-glove levering, plaatsing, nivelleren, verpakking retour, onderhoudsadvies]`,
        },
        inspirationItems: inspirationItems.map(i => i.id),
      });

      if (result.success) {
        // Send confirmation emails via edge function
        try {
          // Send both customer confirmation + admin notification
          await supabase.functions.invoke('send-confirmation-email', {
            body: {
              type: 'both',
              buildCode: currentBuildCode,
              shareUrl,
              customerEmail: contact.email,
              customerName: contact.name,
              customerPhone: contact.phone,
              customerPostcode: contact.location,
              configuration: config,
              priceEstimate: { vanafPrice: 0 },
              stoneName,
              shapeName,
              dimensionString,
              thicknessString,
              finishName,
              edgeName,
              baseName,
              customStoneRequest: customStoneName,
              notes: contact.notes,
              leadTime,
            },
          });
        } catch (emailError) {
          console.error('Email sending error:', emailError);
          // Don't fail the submission if emails fail
        }

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
    return <SuccessScreen buildCode={currentBuildCode} shareUrl={getShareUrl()} isNL={isNL} />;
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
          {isNL ? 'Stap 2 van 2' : 'Step 2 of 2'}
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
                  <h2 className="text-xl font-serif">{shapeName}: {stoneName}</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    #{currentBuildCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyLink}
                    title={isNL ? 'Link kopiëren' : 'Copy link'}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    title={isNL ? 'Download PDF' : 'Download PDF'}
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="p-6 space-y-4">
              <DossierRow 
                label={isNL ? 'Vorm' : 'Shape'} 
                value={customRequests?.shape ? `Op aanvraag (${customRequests.shape})` : (shapeName || '')} 
                isCustom={!!customRequests?.shape}
              />
              <DossierRow 
                label={isNL ? 'Afmetingen' : 'Dimensions'} 
                value={customRequests?.dimension ? `Op aanvraag (${customRequests.dimension})` : dimensionString} 
                isCustom={!!customRequests?.dimension}
              />
              <DossierRow 
                label={isNL ? 'Bladdikte' : 'Thickness'} 
                value={customRequests?.thickness ? `Op aanvraag (${customRequests.thickness})` : thicknessString} 
                isCustom={!!customRequests?.thickness}
              />
              <DossierRow 
                label={isNL ? 'Steensoort' : 'Stone'} 
                value={stoneName} 
              />
              <DossierRow 
                label={isNL ? 'Afwerking' : 'Finish'} 
                value={finishName || ''} 
              />
              <DossierRow 
                label={isNL ? 'Randprofiel' : 'Edge'} 
                value={customRequests?.edge ? `Op aanvraag (${customRequests.edge})` : (edgeName || '')} 
                isCustom={!!customRequests?.edge}
              />
              <DossierRow 
                label={isNL ? 'Onderstel' : 'Base'} 
                value={customRequests?.leg ? `Op aanvraag (${customRequests.leg})` : (baseName || '')} 
                isCustom={!!customRequests?.leg}
              />
            </div>

            {/* Service & Delivery - Info Only (Included) */}
            <div className="p-6 border-t border-border bg-secondary/10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {isNL ? 'Service & levering (inbegrepen)' : 'Service & delivery (included)'}
                </span>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  {isNL 
                    ? 'White-glove levering tot in de ruimte, inclusief uitpakken, plaatsing en nivelleren.'
                    : 'White-glove delivery to your space, including unpacking, placement and leveling.'}
                </p>
                <p>
                  {isNL 
                    ? 'Verpakkingsmateriaal nemen we mee retour.'
                    : 'We take all packaging material with us.'}
                </p>
                <p>
                  {isNL 
                    ? 'Onderhoudsadvies ontvang je bij oplevering.'
                    : 'Care instructions are provided upon delivery.'}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground/70 mt-4 italic">
                {isNL 
                  ? 'Impregneren is op aanvraag mogelijk, afhankelijk van de steensoort.'
                  : 'Impregnation is available on request, depending on the stone type.'}
              </p>
            </div>

            {/* Pricing Note */}
            <div className="bg-foreground/5 p-6 border-t border-border">
              <p className="text-sm text-foreground font-serif mb-1">
                {isNL ? 'Prijs op maat' : 'Tailored pricing'}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isNL 
                  ? 'Elke tafel is uniek. De definitieve prijs ontvangt u in uw persoonlijk voorstel, afgestemd op slab-keuze, afwerking en levering.'
                  : 'Every table is unique. You will receive the final price in your personal proposal, tailored to slab selection, finish and delivery.'}
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
              value={isNL ? 'Inbegrepen' : 'Included'}
            />
            <TrustCard 
              icon={<MapPin className="w-5 h-5" />}
              title={isNL ? 'Oorsprong' : 'Origin'}
              value={isNL ? 'Ontworpen in NL' : 'Designed in NL'}
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
                    alt={`${item.name} inspiratie SERA NORR`}
                    className="w-16 h-16 rounded-sm object-cover flex-shrink-0"
                    loading="lazy"
                    decoding="async"
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
                    ? 'Wij nemen zo spoedig mogelijk contact met u op.'
                    : 'We will be in touch as soon as possible.'}
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
                  <Label htmlFor="phone">{isNL ? 'Telefoon' : 'Phone'} *</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+31 6 12345678"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">{isNL ? 'Postcode' : 'Postcode'} *</Label>
                  <Input 
                    id="location"
                    value={contact.location}
                    onChange={(e) => setContact(prev => ({ ...prev, location: e.target.value }))}
                    placeholder={isNL ? 'bijv. 1017 Amsterdam' : 'e.g. 1017 Amsterdam'}
                    required
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
function DossierRow({ label, value, isCustom }: { label: string; value: string; isCustom?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium max-w-[60%] text-right", isCustom && "italic text-muted-foreground")}>{isCustom ? `"${value}"` : value}</span>
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

function SuccessScreen({ buildCode, shareUrl, isNL }: { buildCode: string; shareUrl: string; isNL: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            ? 'Wij nemen zo spoedig mogelijk contact met u op om uw project te bespreken. U ontvangt een bevestiging per e-mail.'
            : 'We will be in touch as soon as possible to discuss your project. You will receive a confirmation email.'}
        </p>
      </div>

      <div className="bg-secondary/20 border border-border rounded-sm p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          {isNL ? 'Uw dossier referentie' : 'Your dossier reference'}
        </div>
        <div className="font-mono text-lg">#{buildCode}</div>
      </div>

      {/* Share link */}
      <div className="bg-secondary/10 border border-border rounded-sm p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          {isNL ? 'Link naar uw ontwerp' : 'Link to your design'}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            readOnly 
            value={shareUrl} 
            className="flex-1 bg-background border border-border rounded-sm px-3 py-2 text-xs font-mono"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopyLink}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button variant="outline" className="w-full" asChild>
          <a href="/">
            {isNL ? 'Terug naar homepage' : 'Back to homepage'}
          </a>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <a href="/collections">
            {isNL ? 'Bekijk collecties' : 'View collections'}
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
