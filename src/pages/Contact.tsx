import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { SEOHead, localBusinessSchema, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hairline } from "@/components/ui/hairline";
import { trackLeadSubmit } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // Hidden spam prevention field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.email || !formData.name || !formData.message) {
      toast({
        title: isNL ? "Vul alle verplichte velden in" : "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
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

      // Track lead submission
      trackLeadSubmit('contact');

      toast({
        title: isNL ? "Bericht Verzonden" : "Message Sent",
        description: isNL 
          ? "Bedankt voor uw bericht. We reageren binnen 24-48 uur."
          : "Thank you for reaching out. We will respond within 24-48 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Form submission error:", error);
      }
      
      // Handle rate limiting
      if (error.message?.includes("429") || error.message?.includes("Too many")) {
        toast({
          title: isNL ? "Te veel pogingen" : "Too many attempts",
          description: isNL 
            ? "Probeer het later opnieuw."
            : "Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: isNL ? "Verzenden mislukt" : "Submission failed",
          description: isNL 
            ? "Probeer het opnieuw of neem contact op via e-mail."
            : "Please try again or contact us via email.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoTitle = isNL 
    ? "Contact | SERA NORR — Online Atelier voor Maatwerk Natuursteenmeubels"
    : "Contact | SERA NORR — Online Atelier for Bespoke Natural Stone Furniture";

  const seoDescription = isNL
    ? "Neem contact op met SERA NORR online atelier. Vraag een voorstel aan voor maatwerk stenen meubels in travertin of marmer. Reactie binnen 48 uur."
    : "Contact SERA NORR online atelier. Request a proposal for bespoke stone furniture in travertine or marble. Response within 48 hours.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]);

  // Contact page schema
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
          ? "contact SERA NORR, online atelier, maatwerk natuursteenmeubels, travertin tafel, marmeren meubels" 
          : "contact SERA NORR, online atelier, bespoke natural stone furniture, travertine table, marble furniture"}
        structuredData={combinedSchema}
      />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8 opacity-60 text-[10px]" />
          
          <div className="max-w-3xl">
            <p className="micro-label mb-6">Contact</p>
            <h1 className="font-serif text-display-md lg:text-display-lg text-foreground mb-6">
              {isNL ? 'Laten We Beginnen' : "Let's Begin"}
            </h1>
            <p className="text-body-lg text-muted-foreground leading-relaxed max-w-2xl">
              {isNL
                ? 'Of u nu interesse heeft in onze collecties of een maatwerkopdracht overweegt—we verwelkomen uw vraag.'
                : "Whether you're interested in our collections or considering a bespoke commission—we welcome your inquiry."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <Hairline className="flex-1" />
            <span className="micro-label shrink-0">{isNL ? 'Neem contact op' : 'Get in touch'}</span>
            <Hairline className="flex-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-12">
                {isNL ? 'Het Atelier' : 'The Atelier'}
              </h2>

              <address className="space-y-10 not-italic">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-foreground/10">
                    <MapPin className="w-5 h-5 text-muted-foreground" aria-hidden="true" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="editorial-caption-label mb-2">
                      {isNL ? 'Online Atelier' : 'Online Atelier'}
                    </h3>
                    <p className="text-body-md text-muted-foreground leading-relaxed">
                      {isNL ? 'Ontworpen in Nederland' : 'Designed in the Netherlands'}<br />
                      {isNL ? 'Persoonlijke begeleiding op afstand' : 'Personal guidance remotely'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-foreground/10">
                    <Mail className="w-5 h-5 text-muted-foreground" aria-hidden="true" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="editorial-caption-label mb-2">E-mail</h3>
                    <a 
                      href="mailto:atelier@seranorr.com" 
                      className="text-body-md text-muted-foreground hover:text-foreground transition-colors"
                    >
                      atelier@seranorr.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-foreground/10">
                    <Clock className="w-5 h-5 text-muted-foreground" aria-hidden="true" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="editorial-caption-label mb-2">
                      {isNL ? 'Reactietijd' : 'Response Time'}
                    </h3>
                    <p className="text-body-md text-muted-foreground leading-relaxed">
                      {isNL ? 'Binnen 48 uur' : 'Within 48 hours'}<br />
                      {isNL ? 'Maandag – Vrijdag' : 'Monday – Friday'}
                    </p>
                  </div>
                </div>
              </address>

              <div className="mt-12 pt-12 border-t border-foreground/8">
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  {isNL
                    ? 'Als online atelier begeleiden we u door het volledige ontwerpproces op afstand. Via foto\'s, video en gedetailleerde visualisaties zorgen we dat u precies weet wat u kunt verwachten.'
                    : 'As an online atelier, we guide you through the complete design process remotely. Through photos, video and detailed visualizations, we ensure you know exactly what to expect.'}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-background p-8 lg:p-10 border border-foreground/8">
              <h2 className="font-serif text-xl lg:text-2xl text-foreground mb-8">
                {isNL ? 'Neem Contact Op' : 'Get in Touch'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - hidden from users, visible to bots */}
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
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    maxLength={200}
                    className="bg-background border-foreground/15 focus:border-foreground"
                    placeholder={isNL ? 'Collecties, Maatwerk, Algemene vraag...' : 'Collections, Bespoke, General inquiry...'}
                  />
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
                      : (isNL ? 'Verstuur Bericht' : 'Send Message')}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <figure className="max-w-3xl mx-auto text-center">
            <blockquote className="font-serif text-display-sm text-background mb-6 italic">
              {isNL 
                ? '"De beste objecten zijn zij die stil spreken maar niet kunnen worden genegeerd."'
                : '"The best objects are those that speak quietly but cannot be ignored."'}
            </blockquote>
            <figcaption className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-background/60">
              — Sera Norr Atelier
            </figcaption>
          </figure>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;