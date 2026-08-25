import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, ArrowRight, CheckCircle, Phone } from "lucide-react";
import { SEOHead, localBusinessSchema, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { trackLeadSubmit } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });

  // Vul onderwerp voor vanuit ?subject=... (bijv. het design-afspraak-blok).
  useEffect(() => {
    const s = searchParams.get("subject");
    if (s === "design-afspraak" || s === "advies") {
      setFormData((prev) => ({ ...prev, subject: "design-afspraak" }));
    } else if (s === "trade" || s === "samenwerking") {
      setFormData((prev) => ({ ...prev, subject: "samenwerking" }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name || !formData.message) {
      toast({
        title: isNL ? "Vul alle verplichte velden in" : "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: isNL ? "Ongeldig e-mailadres" : "Invalid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-form', {
        body: {
          form_type: 'contact',
          email: formData.email,
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
          honeypot: formData.honeypot,
        },
      });

      if (error) throw error;

      trackLeadSubmit('contact');
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Form submission error:", error);
      }
      
      if (error.message?.includes("429") || error.message?.includes("Too many")) {
        toast({
          title: isNL ? "Te veel pogingen" : "Too many attempts",
          description: isNL ? "Probeer het later opnieuw." : "Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: isNL ? "Verzenden mislukt" : "Submission failed",
          description: isNL ? "Probeer het opnieuw of neem contact op via e-mail." : "Please try again or contact us via email.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoTitle = isNL 
    ? "Contact | SERA NORR Atelier"
    : "Contact | SERA NORR Atelier";

  const seoDescription = isNL
    ? "Neem contact op met SERA NORR. Deel uw vraag of idee voor maatwerk stenen meubels in travertijn of marmer."
    : "Contact SERA NORR. Share your question or idea for bespoke stone furniture in travertine or marble.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]);

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': 'https://sera-norr.com/contact/#page',
    name: 'Contact SERA NORR',
    description: seoDescription,
    url: 'https://sera-norr.com/contact',
    mainEntity: {
      '@id': 'https://sera-norr.com/#organization',
    },
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [localBusinessSchema, breadcrumbSchema, contactPageSchema],
  };

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "contact SERA NORR, online atelier, maatwerk natuursteenmeubels, travertijn tafel, marmeren meubels" 
          : "contact SERA NORR, online atelier, bespoke natural stone furniture, travertine table, marble furniture"}
        structuredData={combinedSchema}
      />

      {/*
        Kop en formulier staan naast elkaar in plaats van onder elkaar: de
        vorige opzet duwde het formulier ruim een scherm naar beneden, waardoor
        bezoekers eerst door lege ruimte moesten scrollen voordat ze iets
        konden invullen.
      */}
      <section className="pt-28 lg:pt-32 pb-20 lg:pb-28 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <Breadcrumbs className="mb-8 opacity-60 text-[10px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Linkerkolom: wie u spreekt en hoe u ons anders bereikt */}
            <div className="lg:col-span-5">
              <p className="micro-label mb-5">Contact</p>
              <h1 className="font-serif text-display-sm lg:text-display-md text-foreground leading-[1.05] mb-5">
                {isNL ? 'Vertel ons over uw ruimte' : 'Tell us about your space'}
              </h1>
              <p className="text-body-md text-muted-foreground leading-relaxed max-w-md">
                {isNL
                  ? 'Deel uw vraag of idee. Wij denken mee over steensoort, formaat en vorm, en u krijgt van ons een eerlijk beeld van de mogelijkheden.'
                  : 'Share your question or idea. We think along on stone, size and shape, and give you an honest picture of what is possible.'}
              </p>

              {/* Direct contact */}
              <div className="mt-8 border-t border-foreground/10">
                <a
                  href="mailto:info@sera-norr.com"
                  className="group flex items-center gap-4 py-4 border-b border-foreground/10 transition-colors hover:text-foreground"
                >
                  <Mail className="w-4 h-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-body-md text-foreground">info@sera-norr.com</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href="tel:+31683991158"
                  className="group flex items-center gap-4 py-4 border-b border-foreground/10 transition-colors hover:text-foreground"
                >
                  <Phone className="w-4 h-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-body-md text-foreground">+31 6 83 99 11 58</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>

              {/* Wat u van ons kunt verwachten */}
              <dl className="mt-8">
                {[
                  [isNL ? 'Reactie' : 'Response', isNL ? 'Binnen 48 uur' : 'Within 48 hours'],
                  [isNL ? 'Levertijd' : 'Lead time', isNL ? '12–16 weken' : '12–16 weeks'],
                  [isNL ? 'Levering' : 'Delivery', isNL ? 'White-glove, NL & BE' : 'White-glove, NL & BE'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between py-2.5 border-b border-foreground/10">
                    <dt className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="text-sm text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="hidden lg:block mt-8 text-body-sm text-muted-foreground">
                {isNL
                  ? 'Liever meteen zelf samenstellen? '
                  : 'Rather start configuring right away? '}
                <Link
                  to="/atelier"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
                >
                  {isNL ? 'Ontwerp uw tafel' : 'Design your table'}
                </Link>
              </p>
            </div>

            {/* Rechterkolom: het formulier, direct in beeld */}
            <div className="lg:col-span-7">
            {isSubmitted ? (
              /* Success State */
              <div className="bg-secondary/30 p-12 lg:p-16 border border-foreground/10 text-center">
                <CheckCircle className="w-12 h-12 text-foreground/60 mx-auto mb-6" strokeWidth={1} />
                <h2 className="font-serif text-display-sm text-foreground mb-4">
                  {isNL ? 'Dank u.' : 'Thank you.'}
                </h2>
                <p className="text-body-md text-muted-foreground mb-8">
                  {isNL 
                    ? 'Uw bericht is verzonden. We reageren snel.'
                    : 'Your message has been sent. We respond quickly.'}
                </p>
                <Button 
                  variant="sera-secondary" 
                  onClick={() => setIsSubmitted(false)}
                >
                  {isNL ? 'Nieuw bericht' : 'New message'}
                </Button>
              </div>
            ) : (
              /* Form */
              <div className="bg-secondary/30 p-8 lg:p-10 border border-foreground/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      type="text"
                      name="website"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block editorial-caption-label mb-2">
                        {isNL ? 'Naam' : 'Name'} *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        maxLength={100}
                        className="bg-background border-foreground/15 focus:border-foreground"
                        placeholder={isNL ? 'Uw naam' : 'Your name'}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block editorial-caption-label mb-2">
                        E-mail *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        maxLength={255}
                        className="bg-background border-foreground/15 focus:border-foreground"
                        placeholder="uw@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block editorial-caption-label mb-2">
                      {isNL ? 'Onderwerp' : 'Subject'}
                    </label>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                      <SelectTrigger className="bg-background border-foreground/15 focus:border-foreground">
                        <SelectValue placeholder={isNL ? 'Selecteer onderwerp' : 'Select subject'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design-afspraak">
                          <div className="flex flex-col items-start">
                            <span>{isNL ? 'Design-afspraak' : 'Design consultation'}</span>
                            <span className="text-xs text-muted-foreground">
                              {isNL ? 'Gratis gesprek van 20 min over uw tafel op maat' : 'Free 20-min conversation about your bespoke table'}
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="algemeen">
                          <div className="flex flex-col items-start">
                            <span>{isNL ? 'Algemene vraag' : 'General inquiry'}</span>
                            <span className="text-xs text-muted-foreground">
                              {isNL ? 'Vragen over een project, levering of atelier' : 'Questions about a project, delivery or atelier'}
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="maatwerk">
                          <div className="flex flex-col items-start">
                            <span>{isNL ? 'Maatwerk' : 'Bespoke'}</span>
                            <span className="text-xs text-muted-foreground">
                              {isNL ? 'Ontwerp op maat: afmetingen, materialen, afwerking' : 'Custom design: dimensions, materials, finish'}
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="samenwerking">
                          <div className="flex flex-col items-start">
                            <span>{isNL ? 'Samenwerking' : 'Collaboration'}</span>
                            <span className="text-xs text-muted-foreground">
                              {isNL ? 'Voor architecten, interieurontwerpers & projectontwikkelaars' : 'For architects, interior designers & developers'}
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block editorial-caption-label mb-2">
                      {isNL ? 'Bericht' : 'Message'} *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      maxLength={5000}
                      className="bg-background border-foreground/15 focus:border-foreground resize-none"
                      placeholder={isNL ? 'Hoe kunnen we u helpen?' : 'How can we help you?'}
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      variant="sera-primary" 
                      size="lg" 
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting 
                        ? (isNL ? 'Verzenden...' : 'Sending...') 
                        : (isNL ? 'Verstuur bericht' : 'Send message')}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </div>
            )}


              <p className="lg:hidden mt-8 text-body-sm text-muted-foreground">
                {isNL
                  ? 'Liever meteen zelf samenstellen? '
                  : 'Rather start configuring right away? '}
                <Link
                  to="/atelier"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
                >
                  {isNL ? 'Ontwerp uw tafel' : 'Design your table'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;