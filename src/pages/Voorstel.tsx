import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Upload, Check, Calendar, MessageSquare } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics";

type FormStep = 'form' | 'success';

const Voorstel = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<FormStep>('form');
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: "",
    vorm: "",
    afmeting: "",
    customAfmeting: "",
    steenvoorkeur: "",
    afwerking: "",
    postcode: "",
    timing: "",
    budget: "",
    email: "",
    telefoon: "",
    opmerkingen: "",
  });

  // Dimension presets per type
  const dimensionPresets: Record<string, string[]> = {
    eettafel: isNL 
      ? ['180×90 cm', '200×100 cm', '220×100 cm', '240×100 cm', '260×100 cm', 'Anders']
      : ['180×90 cm', '200×100 cm', '220×100 cm', '240×100 cm', '260×100 cm', 'Other'],
    salontafel: isNL
      ? ['100×60 cm', '120×70 cm', '140×80 cm', 'Anders']
      : ['100×60 cm', '120×70 cm', '140×80 cm', 'Other'],
    console: isNL
      ? ['140×35 cm', '160×40 cm', '180×45 cm', 'Anders']
      : ['140×35 cm', '160×40 cm', '180×45 cm', 'Other'],
    bijzettafel: isNL
      ? ['Ø40 cm', 'Ø45 cm', 'Ø50 cm', 'Anders']
      : ['Ø40 cm', 'Ø45 cm', 'Ø50 cm', 'Other'],
    anders: [],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track lead
    trackLeadSubmit('voorstel', {
      productType: formData.type,
      stone: formData.steenvoorkeur,
      budget: formData.budget,
    });

    // Show success state
    setStep('success');

    toast({
      title: isNL ? "Aanvraag ontvangen" : "Request received",
      description: isNL ? "Wij reageren binnen 48 uur." : "We will respond within 48 hours.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const seoTitle = isNL 
    ? "Ontvang voorstel binnen 48 uur | SERA NORR"
    : "Receive proposal within 48 hours | SERA NORR";

  const seoDescription = isNL
    ? "Deel uw afmetingen en voorkeuren — wij maken een voorstel op maat. Prijs op aanvraag. SERA NORR online atelier voor maatwerk natuursteenmeubels."
    : "Share your dimensions and preferences — we create a tailored proposal. Price on request. SERA NORR online atelier for bespoke natural stone furniture.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Voorstel' : 'Proposal', url: '/voorstel' },
  ]);

  const showVormField = ['eettafel', 'salontafel'].includes(formData.type);
  const showDimensionPresets = formData.type && formData.type !== 'anders';

  if (step === 'success') {
    return (
      <Layout>
        <SEOHead 
          title={seoTitle}
          description={seoDescription}
          structuredData={breadcrumbSchema}
        />
        
        <section className="pt-28 lg:pt-36 pb-16 lg:pb-24 bg-background min-h-screen">
          <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
            {/* Success Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8" />
              </div>
              <h1 className="font-serif text-display-sm text-foreground mb-3">
                {isNL ? "Dank u — wij reageren binnen 48 uur." : "Thank you — we will respond within 48 hours."}
              </h1>
              <p className="text-muted-foreground text-body-md">
                {isNL ? "Vrijblijvend — geen verplichtingen." : "No obligation — no commitments."}
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-secondary/30 border border-border/30 p-6 mb-8">
              <h2 className="font-serif text-lg text-foreground mb-4">
                {isNL ? "Uw selectie" : "Your selection"}
              </h2>
              <dl className="space-y-2 text-sm">
                {formData.type && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isNL ? "Type" : "Type"}</dt>
                    <dd className="text-foreground capitalize">{formData.type}</dd>
                  </div>
                )}
                {formData.vorm && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isNL ? "Vorm" : "Shape"}</dt>
                    <dd className="text-foreground capitalize">{formData.vorm}</dd>
                  </div>
                )}
                {(formData.afmeting || formData.customAfmeting) && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isNL ? "Afmeting" : "Dimensions"}</dt>
                    <dd className="text-foreground">{formData.customAfmeting || formData.afmeting}</dd>
                  </div>
                )}
                {formData.steenvoorkeur && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isNL ? "Steenvoorkeur" : "Stone preference"}</dt>
                    <dd className="text-foreground">{formData.steenvoorkeur}</dd>
                  </div>
                )}
                {formData.afwerking && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isNL ? "Afwerking" : "Finish"}</dt>
                    <dd className="text-foreground">{formData.afwerking}</dd>
                  </div>
                )}
                {formData.budget && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isNL ? "Budgetrange" : "Budget range"}</dt>
                    <dd className="text-foreground">{formData.budget}</dd>
                  </div>
                )}
                {formData.timing && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{isNL ? "Timing" : "Timing"}</dt>
                    <dd className="text-foreground">{formData.timing}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="atelier-filled" size="lg">
                <Link to="/contact">
                  <Calendar className="mr-2 h-4 w-4" />
                  {isNL ? "Plan vrijblijvend gesprek" : "Schedule free consultation"}
                </Link>
              </Button>
              <Button asChild variant="atelier" size="lg">
                <Link to="/lookbook">
                  {isNL ? "Bekijk online voorbeelden" : "View online examples"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        structuredData={breadcrumbSchema}
      />
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
          {/* Header */}
          <header className="text-center mb-10">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {isNL ? "Maatwerk Atelier" : "Bespoke Atelier"}
            </p>
            <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-4">
              {isNL ? "Ontvang voorstel binnen 48 uur" : "Receive proposal within 48 hours"}
            </h1>
            <p className="text-muted-foreground text-body-md max-w-lg mx-auto">
              {isNL 
                ? "Deel uw afmetingen en voorkeuren — wij maken een voorstel op maat. Prijs op aanvraag."
                : "Share your dimensions and preferences — we create a tailored proposal. Price on request."}
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {isNL ? "Type meubel" : "Type of furniture"} *
              </Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value, afmeting: '', vorm: '' })}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              >
                {[
                  { value: 'eettafel', label: isNL ? 'Eettafel' : 'Dining table' },
                  { value: 'salontafel', label: isNL ? 'Salontafel' : 'Coffee table' },
                  { value: 'console', label: 'Console' },
                  { value: 'bijzettafel', label: isNL ? 'Bijzettafel' : 'Side table' },
                  { value: 'anders', label: isNL ? 'Anders' : 'Other' },
                ].map((item) => (
                  <div key={item.value}>
                    <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
                    <Label
                      htmlFor={item.value}
                      className="flex items-center justify-center px-4 py-3 border border-border/50 text-sm cursor-pointer transition-all peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground/50"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Vorm (conditional) */}
            {showVormField && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {isNL ? "Vorm" : "Shape"}
                </Label>
                <RadioGroup
                  value={formData.vorm}
                  onValueChange={(value) => setFormData({ ...formData, vorm: value })}
                  className="flex gap-2"
                >
                  {[
                    { value: 'rond', label: isNL ? 'Rond' : 'Round' },
                    { value: 'ovaal', label: isNL ? 'Ovaal' : 'Oval' },
                    { value: 'rechthoek', label: isNL ? 'Rechthoek' : 'Rectangle' },
                  ].map((item) => (
                    <div key={item.value}>
                      <RadioGroupItem value={item.value} id={`vorm-${item.value}`} className="peer sr-only" />
                      <Label
                        htmlFor={`vorm-${item.value}`}
                        className="flex items-center justify-center px-4 py-3 border border-border/50 text-sm cursor-pointer transition-all peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground/50"
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Afmeting */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {isNL ? "Afmeting indicatie" : "Dimension indication"} *
              </Label>
              {showDimensionPresets && (
                <RadioGroup
                  value={formData.afmeting}
                  onValueChange={(value) => setFormData({ ...formData, afmeting: value })}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {dimensionPresets[formData.type]?.map((preset) => (
                    <div key={preset}>
                      <RadioGroupItem value={preset} id={`dim-${preset}`} className="peer sr-only" />
                      <Label
                        htmlFor={`dim-${preset}`}
                        className="flex items-center justify-center px-4 py-3 border border-border/50 text-sm cursor-pointer transition-all peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground/50"
                      >
                        {preset}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {(formData.afmeting === 'Anders' || formData.afmeting === 'Other' || formData.type === 'anders') && (
                <Input
                  placeholder={isNL ? "Bijv. 250×110 cm" : "E.g. 250×110 cm"}
                  value={formData.customAfmeting}
                  onChange={(e) => setFormData({ ...formData, customAfmeting: e.target.value })}
                  className="mt-2"
                />
              )}
            </div>

            {/* Steenvoorkeur */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {isNL ? "Steenvoorkeur" : "Stone preference"} *
              </Label>
              <RadioGroup
                value={formData.steenvoorkeur}
                onValueChange={(value) => setFormData({ ...formData, steenvoorkeur: value })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {[
                  { value: 'travertin', label: isNL ? 'Travertin (warm)' : 'Travertine (warm)' },
                  { value: 'marmer-licht', label: isNL ? 'Marmer licht (airy)' : 'Light marble (airy)' },
                  { value: 'marmer-donker', label: isNL ? 'Marmer donker (dramatic)' : 'Dark marble (dramatic)' },
                  { value: 'calacatta', label: 'Calacatta statement (premium)' },
                  { value: 'advies', label: isNL ? 'Ik wil advies' : 'I want advice' },
                ].map((item) => (
                  <div key={item.value}>
                    <RadioGroupItem value={item.value} id={`stone-${item.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`stone-${item.value}`}
                      className="flex items-center justify-center px-4 py-3 border border-border/50 text-sm cursor-pointer transition-all peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground/50"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Afwerking */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {isNL ? "Afwerking rand (optioneel)" : "Edge finish (optional)"}
              </Label>
              <RadioGroup
                value={formData.afwerking}
                onValueChange={(value) => setFormData({ ...formData, afwerking: value })}
                className="flex gap-2"
              >
                {[
                  { value: 'strak', label: isNL ? 'Strak' : 'Sharp' },
                  { value: 'afgerond', label: isNL ? 'Zacht afgerond' : 'Soft rounded' },
                  { value: 'bevel', label: 'Bevel' },
                ].map((item) => (
                  <div key={item.value}>
                    <RadioGroupItem value={item.value} id={`finish-${item.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`finish-${item.value}`}
                      className="flex items-center justify-center px-4 py-3 border border-border/50 text-sm cursor-pointer transition-all peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground/50"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Postcode */}
            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-sm font-medium">
                {isNL ? "Postcode" : "Postal code"} *
              </Label>
              <Input
                id="postcode"
                placeholder={isNL ? "1234 AB" : "1234 AB"}
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                required
                className="max-w-xs"
              />
            </div>

            {/* Timing */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {isNL ? "Timing" : "Timing"} *
              </Label>
              <RadioGroup
                value={formData.timing}
                onValueChange={(value) => setFormData({ ...formData, timing: value })}
                className="grid grid-cols-2 gap-2"
              >
                {[
                  { value: 'flexibel', label: isNL ? 'Flexibel' : 'Flexible' },
                  { value: '1-2', label: isNL ? 'Binnen 1–2 maanden' : 'Within 1–2 months' },
                  { value: '2-4', label: isNL ? '2–4 maanden' : '2–4 months' },
                  { value: 'later', label: isNL ? 'Later' : 'Later' },
                ].map((item) => (
                  <div key={item.value}>
                    <RadioGroupItem value={item.value} id={`timing-${item.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`timing-${item.value}`}
                      className="flex items-center justify-center px-4 py-3 border border-border/50 text-sm cursor-pointer transition-all peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground/50"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {isNL ? "Budgetrange" : "Budget range"} *
              </Label>
              <RadioGroup
                value={formData.budget}
                onValueChange={(value) => setFormData({ ...formData, budget: value })}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              >
                {[
                  { value: '<3000', label: isNL ? 'Onder €3.000' : 'Under €3,000' },
                  { value: '3000-6000', label: '€3.000–€6.000' },
                  { value: '6000-10000', label: '€6.000–€10.000' },
                  { value: '>10000', label: '€10.000+' },
                  { value: 'advies', label: isNL ? 'Ik wil advies' : 'I want advice' },
                ].map((item) => (
                  <div key={item.value}>
                    <RadioGroupItem value={item.value} id={`budget-${item.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`budget-${item.value}`}
                      className="flex items-center justify-center px-4 py-3 border border-border/50 text-sm cursor-pointer transition-all peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground/50"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {isNL ? "E-mail" : "Email"} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isNL ? "uw@email.nl" : "your@email.com"}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefoon" className="text-sm font-medium">
                  {isNL ? "Telefoon" : "Phone"} *
                </Label>
                <Input
                  id="telefoon"
                  type="tel"
                  placeholder="+31 6 12345678"
                  value={formData.telefoon}
                  onChange={(e) => setFormData({ ...formData, telefoon: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isNL ? "Foto van de ruimte (optioneel)" : "Photo of the space (optional)"}
              </Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-border/50 p-6 text-center cursor-pointer hover:border-foreground/50 transition-colors"
              >
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {fileName || (isNL ? "Klik om te uploaden" : "Click to upload")}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Opmerkingen */}
            <div className="space-y-2">
              <Label htmlFor="opmerkingen" className="text-sm font-medium">
                {isNL ? "Opmerkingen (optioneel)" : "Comments (optional)"}
              </Label>
              <Textarea
                id="opmerkingen"
                placeholder={isNL ? "Extra wensen of vragen..." : "Additional wishes or questions..."}
                value={formData.opmerkingen}
                onChange={(e) => setFormData({ ...formData, opmerkingen: e.target.value })}
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="atelier-filled" 
                size="lg"
                className="w-full sm:w-auto"
                disabled={!formData.type || !formData.steenvoorkeur || !formData.timing || !formData.budget || !formData.email || !formData.telefoon || !formData.postcode}
              >
                {isNL ? "Ontvang voorstel" : "Receive proposal"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                {isNL ? "Vrijblijvend — geen verplichtingen." : "No obligation — no commitments."}
              </p>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Voorstel;
