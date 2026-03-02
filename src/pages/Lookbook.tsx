import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEOHead, generateBreadcrumbSchema, Breadcrumbs } from "@/components/seo";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Lock, Calendar } from "lucide-react";
import { Hairline } from "@/components/ui/hairline";
import { supabase } from "@/integrations/supabase/client";
import { 
  trackLookbookOpen, 
  trackLookbookSubmit, 
  trackFormStart,
  trackFormSubmit,
  identify 
} from "@/lib/tracking";

// Curated lookbook items
const lookbookItems = [
  { id: 1, title: 'Eettafel Ovaal', stone: 'Calacatta Viola', useCase: 'Eetkamer', dimensions: '240×100 cm', image: '/lookbook/marble-oval-dining.png' },
  { id: 2, title: 'Ronde Eettafel', stone: 'Travertin', useCase: 'Eetkamer', dimensions: 'Ø130 cm', image: '/lookbook/travertine-round-fluted.png' },
  { id: 3, title: 'Ronde Eettafel', stone: 'Travertin', useCase: 'Eetkamer', dimensions: 'Ø140 cm', image: '/lookbook/travertine-round-cone.png' },
  { id: 4, title: 'Salon Set', stone: 'Calacatta Viola & Travertin', useCase: 'Woonkamer', dimensions: 'Ø120 + Ø80 cm', image: '/lookbook/marble-round-livingroom.png' },
  { id: 5, title: 'Ronde Eettafel', stone: 'Calacatta Viola', useCase: 'Eetkamer', dimensions: 'Ø150 cm', image: '/lookbook/calacatta-viola-round.png' },
  { id: 6, title: 'Eettafel Ovaal', stone: 'Travertin', useCase: 'Eetkamer', dimensions: '220×110 cm', image: '/lookbook/travertine-oval-slab.png' },
  { id: 7, title: 'Console Marmer', stone: 'Calacatta Viola', useCase: 'Hal', dimensions: '160×40 cm', image: '/lookbook/marble-oval-fluted.png' },
  { id: 8, title: 'Bijzettafel', stone: 'Travertin', useCase: 'Zithoek', dimensions: 'Ø45 cm', image: '/lookbook/travertine-coffee-fluted.png' },
  { id: 9, title: 'Statement Console', stone: 'Calacatta Viola', useCase: 'Entree', dimensions: '180×45 cm', image: '/lookbook/marble-coffee-fluted.png' },
  { id: 10, title: 'Sculptural Side', stone: 'Calacatta', useCase: 'Slaapkamer', dimensions: 'Ø50 cm', image: '/lookbook/marble-round-fluted.png' },
  { id: 11, title: 'Grand Dining', stone: 'Travertin', useCase: 'Eetkamer', dimensions: '280×110 cm', image: '/lookbook/travertine-oval-fluted.png' },
  { id: 12, title: 'Petit Console', stone: 'Travertin', useCase: 'Hal', dimensions: '120×35 cm', image: '/lookbook/travertine-coffee-set.png' },
  // New photos
  { id: 13, title: 'Fluted Round', stone: 'Travertin', useCase: 'Eetkamer', dimensions: 'Ø120 cm', image: '/lookbook/hf_20260302_192947_bf2d5c2a-accf-4eab-91f9-6c9e232a8ca9.png' },
  { id: 14, title: 'Viola Dining', stone: 'Calacatta Viola', useCase: 'Eetkamer', dimensions: '260×110 cm', image: '/lookbook/hf_20260302_193457_5241fec0-6f29-443e-8611-215c123acaf1.png' },
  { id: 15, title: 'Sculptural Base', stone: 'Calacatta Viola', useCase: 'Eetkamer', dimensions: 'Ø140 cm', image: '/lookbook/hf_20260302_193517_2927dca0-dc35-42d3-8ebc-96aa8765aa6c.png' },
  { id: 16, title: 'Terra Cylinder', stone: 'Travertin', useCase: 'Zithoek', dimensions: 'Ø40 cm', image: '/lookbook/hf_20260302_193525_76bc9c3a-11ea-468b-b16c-eeec413641ca.png' },
  { id: 17, title: 'Grand Oval', stone: 'Travertin', useCase: 'Eetkamer', dimensions: '240×120 cm', image: '/lookbook/hf_20260302_193532_4c68463b-e3dd-49e2-941a-e0c0f60f4afb.png' },
  { id: 18, title: 'Viola Salon', stone: 'Calacatta Viola', useCase: 'Woonkamer', dimensions: 'Ø90 cm', image: '/lookbook/hf_20260302_193814_33d614cc-9ed5-4e85-81cb-0a3d33634771.png' },
  { id: 19, title: 'Fluted Console', stone: 'Travertin', useCase: 'Hal', dimensions: '150×40 cm', image: '/lookbook/hf_20260302_193827_5a71d56c-3f4a-48ac-9040-fd839818e611.png' },
  { id: 20, title: 'Duo Set', stone: 'Calacatta Viola', useCase: 'Woonkamer', dimensions: 'Ø100 + Ø60 cm', image: '/lookbook/hf_20260302_193938_bc08d013-b022-4ec3-96ab-5006204810c6.png' },
  { id: 21, title: 'Terra Pedestal', stone: 'Travertin', useCase: 'Entree', dimensions: 'Ø35 cm', image: '/lookbook/hf_20260302_193948_92c5aa02-a535-40c6-b836-5a8d17caefed.png' },
  { id: 22, title: 'Ribbed Dining', stone: 'Travertin', useCase: 'Eetkamer', dimensions: 'Ø150 cm', image: '/lookbook/hf_20260302_194905_1f39a000-891d-4b16-aef9-02f8443a887b.png' },
  { id: 23, title: 'Viola Statement', stone: 'Calacatta Viola', useCase: 'Eetkamer', dimensions: '220×100 cm', image: '/lookbook/hf_20260302_194910_7db0cac4-07f6-46aa-ae79-7b4c3078d449.png' },
  { id: 24, title: 'Terra Slab Side', stone: 'Travertin', useCase: 'Zithoek', dimensions: '50×40 cm', image: '/lookbook/hf_20260302_194922_d503480e-9df6-4cde-a61b-cb9d6f776e3c.png' },
  { id: 25, title: 'Arch Dining', stone: 'Calacatta Viola', useCase: 'Eetkamer', dimensions: '240×110 cm', image: '/lookbook/hf_20260302_194927_0ddf7cfd-6888-4e9c-b499-7cdca489110e.png' },
  { id: 26, title: 'Cone Coffee', stone: 'Travertin', useCase: 'Woonkamer', dimensions: 'Ø80 cm', image: '/lookbook/hf_20260302_195406_c9467450-e5a7-40e7-a4e6-b3053747232b.png' },
  { id: 27, title: 'Viola Round XL', stone: 'Calacatta Viola', useCase: 'Eetkamer', dimensions: 'Ø180 cm', image: '/lookbook/hf_20260302_195410_0a0fa54f-3736-407b-8463-9eab503b8efb.png' },
  { id: 28, title: 'Stacked Console', stone: 'Travertin', useCase: 'Hal', dimensions: '140×35 cm', image: '/lookbook/hf_20260302_195415_9bfd5a3b-8d26-426f-8a03-dd5e617e4d83.png' },
  { id: 29, title: 'Viola Nest', stone: 'Calacatta Viola', useCase: 'Slaapkamer', dimensions: 'Ø45 + Ø35 cm', image: '/lookbook/hf_20260302_195421_fc214e7f-6dcd-46f8-9843-775188d1e8df.png' },
  { id: 30, title: 'Terra Grand', stone: 'Travertin', useCase: 'Eetkamer', dimensions: '280×120 cm', image: '/lookbook/hf_20260302_195442_6ac8dcca-0aac-451d-981e-bd80eeccce5b.png' },
];

const Lookbook = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Track lookbook page open
  useEffect(() => {
    trackLookbookOpen('page_load');
  }, []);

  // Track form start on first interaction
  const handleFormInteraction = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackFormStart('lookbook');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: isNL ? "Ongeldig e-mailadres" : "Invalid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-form', {
        body: {
          form_type: 'lookbook',
          email: email,
          metadata: { 
            interest,
            marketing_opt_in: marketingOptIn,
          },
          honeypot,
        },
      });

      if (error) throw error;

      // Track lookbook submission with opt-in status
      trackLookbookSubmit(true, marketingOptIn);
      trackFormSubmit('lookbook');

      // Identify user and link interest data (only after explicit opt-in)
      await identify(email, marketingOptIn);

      setIsUnlocked(true);

      toast({
        title: isNL ? "Toegang verleend" : "Access granted",
        description: isNL ? "Bekijk alle voorbeelden hieronder." : "View all examples below.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '';
      
      if (errorMessage.includes("429") || errorMessage.includes("Too many")) {
        toast({
          title: isNL ? "Te veel pogingen" : "Too many attempts",
          description: isNL ? "Probeer het later opnieuw." : "Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: isNL ? "Verzenden mislukt" : "Submission failed",
          description: isNL ? "Probeer het opnieuw." : "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoTitle = isNL 
    ? "Online voorbeelden | SERA NORR Lookbook"
    : "Online examples | SERA NORR Lookbook";

  const seoDescription = isNL
    ? "Ontvang toegang tot ons curated lookbook met toepassingen, maten en steensoorten. SERA NORR online atelier voor maatwerk natuursteenmeubels."
    : "Get access to our curated lookbook with applications, sizes and stone types. SERA NORR online atelier for bespoke natural stone furniture.";

  const breadcrumbItems = [
    { label: "SERA NORR", href: "/" },
    { label: isNL ? 'Voorbeelden' : 'Examples', href: "/lookbook" },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Voorbeelden' : 'Examples', url: '/lookbook' },
  ]);

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        structuredData={breadcrumbSchema}
      />
      
      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbItems} className="mb-8 opacity-60 text-[10px]" />
          
          <div className="max-w-2xl mx-auto text-center">
            <p className="micro-label mb-6">
              {isNL ? "Inspiratie" : "Inspiration"}
            </p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {isNL ? "Online voorbeelden" : "Online examples"}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed">
              {isNL 
                ? "Ontvang toegang tot ons curated lookbook met toepassingen, maten en steensoorten."
                : "Get access to our curated lookbook with applications, sizes and stone types."}
            </p>
          </div>
        </div>
      </section>

      {/* Email Gate */}
      {!isUnlocked && (
        <section className="pb-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="p-8 lg:p-10 border border-foreground/8 bg-background">
                {/* Honeypot field - hidden from users */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website-lookbook">Website</label>
                  <input
                    id="website-lookbook"
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="editorial-caption-label">
                      {isNL ? "E-mail" : "Email"} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={isNL ? "uw@email.nl" : "your@email.com"}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        handleFormInteraction();
                      }}
                      onFocus={handleFormInteraction}
                      required
                      maxLength={255}
                      className="bg-background border-foreground/15 focus:border-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interest" className="editorial-caption-label">
                      {isNL ? "Waar bent u naar op zoek?" : "What are you looking for?"} ({isNL ? "optioneel" : "optional"})
                    </Label>
                    <Select value={interest} onValueChange={(value) => {
                      setInterest(value);
                      handleFormInteraction();
                    }}>
                      <SelectTrigger className="bg-background border-foreground/15 focus:border-foreground">
                        <SelectValue placeholder={isNL ? "Selecteer..." : "Select..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eettafel">{isNL ? "Eettafel" : "Dining table"}</SelectItem>
                        <SelectItem value="salontafel">{isNL ? "Salontafel" : "Coffee table"}</SelectItem>
                        <SelectItem value="console">Console</SelectItem>
                        <SelectItem value="bijzettafel">{isNL ? "Bijzettafel" : "Side table"}</SelectItem>
                        <SelectItem value="advies">{isNL ? "Advies" : "Advice"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Marketing opt-in checkbox */}
                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="marketing"
                      checked={marketingOptIn}
                      onCheckedChange={(checked) => {
                        setMarketingOptIn(checked === true);
                        handleFormInteraction();
                      }}
                      className="mt-0.5"
                    />
                    <div className="space-y-1">
                      <Label 
                        htmlFor="marketing" 
                        className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                      >
                        {isNL 
                          ? "Ja, stuur mij inspiratie en updates" 
                          : "Yes, send me inspiration and updates"}
                      </Label>
                      <p className="text-xs text-muted-foreground/70">
                        {isNL 
                          ? "U kunt zich altijd uitschrijven. " 
                          : "You can unsubscribe at any time. "}
                        <Link 
                          to="/privacy" 
                          className="underline hover:text-foreground transition-colors"
                        >
                          {isNL ? "Privacybeleid" : "Privacy policy"}
                        </Link>
                      </p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="sera-primary" 
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (isNL ? "Laden..." : "Loading...") 
                      : (isNL ? "Ontvang toegang" : "Get access")}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Voorbeelden' : 'Examples'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {lookbookItems.map((item, index) => (
              <div 
                key={item.id}
                className={`group relative ${!isUnlocked ? 'pointer-events-none' : ''}`}
              >
                {/* Image placeholder */}
                <div className="relative mb-4">
                  <span className="font-serif text-[40px] lg:text-[50px] text-foreground/[0.03] absolute -top-1 -left-0.5 leading-none select-none pointer-events-none z-10">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="aspect-[4/5] bg-background overflow-hidden relative">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={`${item.title} — ${item.stone} ${item.dimensions}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div 
                        className={`absolute inset-0 bg-gradient-to-br ${
                          index % 4 === 0 ? 'from-stone-200 to-stone-300' :
                          index % 4 === 1 ? 'from-stone-100 to-stone-200' :
                          index % 4 === 2 ? 'from-purple-50 to-stone-200' :
                          'from-stone-300 to-stone-400'
                        }`}
                      />
                    )}
                    
                    {/* Locked overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 backdrop-blur-md bg-background/60 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Caption */}
                <div className={`${!isUnlocked ? 'blur-sm' : ''}`}>
                  <p className="text-sm text-foreground font-medium">{item.stone}</p>
                  <p className="text-xs text-muted-foreground">
                    {isNL ? item.useCase : item.useCase} · {item.dimensions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip (shown after unlock) */}
      {isUnlocked && (
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-display-sm text-background mb-4">
                {isNL ? "Vertaal dit naar uw ruimte" : "Translate this to your space"}
              </h2>
              <p className="text-background/70 text-body-md mb-10">
                {isNL 
                  ? "Deel uw afmetingen en voorkeuren — wij maken een voorstel op maat."
                  : "Share your dimensions and preferences — we create a tailored proposal."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="sera-primary" size="lg" className="bg-background text-foreground hover:bg-background/95">
                  <Link to="/atelier">
                    {isNL ? "Ontwerp uw tafel" : "Design your table"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="sera-secondary" size="lg" className="border-background/40 text-background hover:border-background/60 hover:bg-background/5">
                  <Link to="/contact">
                    <Calendar className="mr-2 h-4 w-4" />
                    {isNL ? "Plan vrijblijvend gesprek" : "Schedule free consultation"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Lookbook;