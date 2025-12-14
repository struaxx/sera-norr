import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Clock } from "lucide-react";
import { SEOHead, localBusinessSchema, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isNL ? "Bericht Verzonden" : "Message Sent",
      description: isNL 
        ? "Bedankt voor uw bericht. We reageren binnen 24-48 uur."
        : "Thank you for reaching out. We will respond within 24-48 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const seoTitle = isNL 
    ? "Contact | SERA NORR Showroom Amsterdam"
    : "Contact | SERA NORR Showroom Amsterdam";

  const seoDescription = isNL
    ? "Neem contact op met SERA NORR. Bezoek onze showroom in Amsterdam op afspraak. Vraag een voorstel aan voor maatwerk stenen meubels."
    : "Contact SERA NORR. Visit our Amsterdam showroom by appointment. Request a proposal for bespoke stone furniture.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [localBusinessSchema, breadcrumbSchema],
  };

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "contact SERA NORR, showroom Amsterdam, afspraak maken, maatwerk aanvraag" 
          : "contact SERA NORR, showroom Amsterdam, schedule appointment, bespoke inquiry"}
        structuredData={combinedSchema}
      />

      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8" />
          
          <header className="max-w-3xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Contact
            </p>
            <h1 className="font-serif text-display-lg text-foreground mb-8">
              {isNL ? 'Laten We Beginnen' : "Let's Begin"}
            </h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed">
              {isNL
                ? 'Of u nu interesse heeft in onze collecties, een maatwerkopdracht overweegt, of simpelweg onze showroom wilt bezoeken—we verwelkomen uw vraag.'
                : "Whether you're interested in our collections, considering a bespoke commission, or simply wish to visit our showroom—we welcome your inquiry."}
            </p>
          </header>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-12">
                {isNL ? 'Het Atelier' : 'The Atelier'}
              </h2>

              <address className="space-y-10 not-italic">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-border">
                    <MapPin className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-wider text-foreground mb-2">
                      Showroom
                    </h3>
                    <p className="text-muted-foreground text-body-md leading-relaxed">
                      Keizersgracht 585<br />
                      1017 DR Amsterdam<br />
                      {isNL ? 'Nederland' : 'The Netherlands'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-border">
                    <Mail className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-wider text-foreground mb-2">
                      E-mail
                    </h3>
                    <a 
                      href="mailto:atelier@seranorr.com" 
                      className="text-muted-foreground hover:text-foreground transition-colors text-body-md link-underline"
                    >
                      atelier@seranorr.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-border">
                    <Clock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-wider text-foreground mb-2">
                      {isNL ? 'Bezoekuren' : 'Visiting Hours'}
                    </h3>
                    <p className="text-muted-foreground text-body-md leading-relaxed">
                      {isNL ? 'Alleen op afspraak' : 'By appointment only'}<br />
                      {isNL ? 'Maandag – Vrijdag, 10:00 – 18:00' : 'Monday – Friday, 10:00 – 18:00'}
                    </p>
                  </div>
                </div>
              </address>

              <div className="mt-12 pt-12 border-t border-border">
                <p className="text-muted-foreground text-body-sm leading-relaxed">
                  {isNL
                    ? 'Onze showroom bezoeken zijn privé en alleen op afspraak. Ervaar onze collecties in een intieme setting, begeleid door ons team dat u alles kan vertellen over materialen, proces en aanpassingsmogelijkheden.'
                    : 'Our showroom visits are private and by appointment. Experience our collections in an intimate setting, guided by our team who can speak to materials, process, and customization possibilities.'}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-12">
                {isNL ? 'Neem Contact Op' : 'Get in Touch'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      {isNL ? 'Naam' : 'Name'}
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background border-border focus:border-foreground"
                      placeholder={isNL ? 'Uw naam' : 'Your name'}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background border-border focus:border-foreground"
                      placeholder="uw@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {isNL ? 'Onderwerp' : 'Subject'}
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-background border-border focus:border-foreground"
                    placeholder={isNL ? 'Collecties, Maatwerk, Showroom Bezoek...' : 'Collections, Bespoke, Showroom Visit...'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {isNL ? 'Bericht' : 'Message'}
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="bg-background border-border focus:border-foreground resize-none"
                    placeholder={isNL ? 'Hoe kunnen we u helpen?' : 'How can we help you?'}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="atelier-filled" size="lg" className="w-full md:w-auto">
                    {isNL ? 'Verstuur Bericht' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <figure className="max-w-3xl mx-auto text-center">
            <blockquote className="font-serif text-display-sm text-foreground mb-6 italic">
              {isNL 
                ? '"De beste objecten zijn zij die stil spreken maar niet kunnen worden genegeerd."'
                : '"The best objects are those that speak quietly but cannot be ignored."'}
            </blockquote>
            <figcaption className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
              — Sera Norr Atelier
            </figcaption>
          </figure>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
