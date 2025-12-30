import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Lock, Calendar } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics";

// Curated lookbook items
const lookbookItems = [
  { id: 1, title: 'Eettafel Travertin', stone: 'Travertin', useCase: 'Eetkamer', dimensions: '240×100 cm' },
  { id: 2, title: 'Salontafel Rond', stone: 'Travertin', useCase: 'Woonkamer', dimensions: 'Ø120 cm' },
  { id: 3, title: 'Console Marmer', stone: 'Calacatta Viola', useCase: 'Hal', dimensions: '160×40 cm' },
  { id: 4, title: 'Bijzettafel', stone: 'Travertin', useCase: 'Zithoek', dimensions: 'Ø45 cm' },
  { id: 5, title: 'Eettafel Ovaal', stone: 'Marmer licht', useCase: 'Eetkamer', dimensions: '220×110 cm' },
  { id: 6, title: 'Statement Console', stone: 'Calacatta Viola', useCase: 'Entree', dimensions: '180×45 cm' },
  { id: 7, title: 'Salon Set', stone: 'Travertin', useCase: 'Woonkamer', dimensions: '140×80 cm' },
  { id: 8, title: 'Ronde Eettafel', stone: 'Marmer donker', useCase: 'Eetkamer', dimensions: 'Ø150 cm' },
  { id: 9, title: 'Minimalist Console', stone: 'Travertin', useCase: 'Gang', dimensions: '140×35 cm' },
  { id: 10, title: 'Sculptural Side', stone: 'Calacatta', useCase: 'Slaapkamer', dimensions: 'Ø50 cm' },
  { id: 11, title: 'Grand Dining', stone: 'Travertin', useCase: 'Eetkamer', dimensions: '280×110 cm' },
  { id: 12, title: 'Petit Console', stone: 'Marmer licht', useCase: 'Hal', dimensions: '120×35 cm' },
];

const Lookbook = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    // Track lead submission
    trackLeadSubmit('lookbook' as const, {
      interest: interest,
    });

    setIsUnlocked(true);

    toast({
      title: isNL ? "Toegang verleend" : "Access granted",
      description: isNL ? "Bekijk alle voorbeelden hieronder." : "View all examples below.",
    });
  };

  const seoTitle = isNL 
    ? "Online voorbeelden | SERA NORR Lookbook"
    : "Online examples | SERA NORR Lookbook";

  const seoDescription = isNL
    ? "Ontvang toegang tot ons curated lookbook met toepassingen, maten en steensoorten. SERA NORR online atelier voor maatwerk natuursteenmeubels."
    : "Get access to our curated lookbook with applications, sizes and stone types. SERA NORR online atelier for bespoke natural stone furniture.";

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
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <header className="text-center mb-10 max-w-2xl mx-auto">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {isNL ? "Inspiratie" : "Inspiration"}
            </p>
            <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-4">
              {isNL ? "Online voorbeelden" : "Online examples"}
            </h1>
            <p className="text-muted-foreground text-body-md">
              {isNL 
                ? "Ontvang toegang tot ons curated lookbook met toepassingen, maten en steensoorten."
                : "Get access to our curated lookbook with applications, sizes and stone types."}
            </p>
          </header>

          {/* Email Gate */}
          {!isUnlocked && (
            <div className="max-w-md mx-auto mb-12">
              <form onSubmit={handleSubmit} className="space-y-4 bg-secondary/30 border border-border/30 p-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {isNL ? "E-mail" : "Email"} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={isNL ? "uw@email.nl" : "your@email.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest" className="text-sm font-medium">
                    {isNL ? "Waar bent u naar op zoek?" : "What are you looking for?"} ({isNL ? "optioneel" : "optional"})
                  </Label>
                  <Select value={interest} onValueChange={setInterest}>
                    <SelectTrigger>
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
                <Button 
                  type="submit" 
                  variant="atelier-filled" 
                  className="w-full"
                >
                  {isNL ? "Ontvang toegang" : "Get access"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {lookbookItems.map((item, index) => (
              <div 
                key={item.id}
                className={`group relative ${!isUnlocked ? 'pointer-events-none' : ''}`}
              >
                {/* Image placeholder */}
                <div className="aspect-[4/5] bg-secondary/50 mb-3 overflow-hidden relative">
                  {/* Placeholder gradient simulating stone texture */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${
                      index % 4 === 0 ? 'from-stone-200 to-stone-300' :
                      index % 4 === 1 ? 'from-stone-100 to-stone-200' :
                      index % 4 === 2 ? 'from-purple-50 to-stone-200' :
                      'from-stone-300 to-stone-400'
                    }`}
                  />
                  
                  {/* Locked overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 backdrop-blur-md bg-background/60 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
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

          {/* CTA Strip (shown after unlock) */}
          {isUnlocked && (
            <div className="mt-16 py-10 border-t border-b border-border/30">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="font-serif text-xl lg:text-2xl text-foreground mb-3">
                  {isNL ? "Vertaal dit naar uw ruimte" : "Translate this to your space"}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {isNL 
                    ? "Deel uw afmetingen en voorkeuren — wij maken een voorstel op maat."
                    : "Share your dimensions and preferences — we create a tailored proposal."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="atelier-filled" size="lg">
                    <Link to="/voorstel">
                      {isNL ? "Ontvang voorstel binnen 48 uur" : "Receive proposal within 48 hours"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="atelier" size="lg">
                    <Link to="/contact">
                      <Calendar className="mr-2 h-4 w-4" />
                      {isNL ? "Plan vrijblijvend gesprek" : "Schedule free consultation"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Lookbook;
