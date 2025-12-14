import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TrustBadges } from "@/components/trust";

const Bespoke = () => {
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    projectType: "",
    timeline: "",
    message: "",
  });

  const processSteps = [
    {
      number: "01",
      title: t('bespoke.step1Title'),
      description: t('bespoke.step1Description'),
    },
    {
      number: "02",
      title: t('bespoke.step2Title'),
      description: t('bespoke.step2Description'),
    },
    {
      number: "03",
      title: t('bespoke.step3Title'),
      description: t('bespoke.step3Description'),
    },
    {
      number: "04",
      title: t('bespoke.step4Title'),
      description: t('bespoke.step4Description'),
    },
    {
      number: "05",
      title: t('bespoke.step5Title'),
      description: t('bespoke.step5Description'),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('bespoke.formSuccess'),
      description: t('bespoke.formSuccessDescription'),
    });
    setFormData({ name: "", email: "", location: "", projectType: "", timeline: "", message: "" });
  };

  const seoTitle = isNL 
    ? "Maatwerk Stenen Meubels | Bespoke Atelier | SERA NORR"
    : "Bespoke Stone Furniture | Custom Atelier | SERA NORR";

  const seoDescription = isNL
    ? "Maatwerk stenen meubels op maat gemaakt voor uw interieur. Travertin, Calacatta Viola en andere steensoorten. 12-20 weken levertijd. Europees vakmanschap."
    : "Bespoke stone furniture custom-made for your interior. Travertine, Calacatta Viola and other stones. 12-20 weeks lead time. European craftsmanship.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Maatwerk' : 'Bespoke', url: '/bespoke' },
  ]);

  return (
    <Layout>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={isNL 
          ? "maatwerk meubels, bespoke, stenen tafel op maat, marmeren tafel maatwerk, Europees vakmanschap" 
          : "bespoke furniture, custom stone table, marble table custom, European craftsmanship"}
        structuredData={breadcrumbSchema}
      />

      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Breadcrumbs className="mb-8" />
          
          <header className="max-w-3xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              {t('bespoke.subtitle')}
            </p>
            <h1 className="font-serif text-display-lg text-foreground mb-8">
              {t('bespoke.title')}
            </h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed">
              {t('bespoke.description')}
            </p>
          </header>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 lg:py-16 bg-ivory/50 border-y border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <TrustBadges variant="horizontal" />
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {t('bespoke.journeySubtitle')}
            </p>
            <h2 className="font-serif text-display-sm text-foreground">
              {t('bespoke.journeyTitle')}
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {processSteps.map((step, index) => (
              <article
                key={step.number}
                className={`${index === 3 || index === 4 ? "lg:col-span-1" : ""}`}
              >
                <span className="font-serif text-6xl text-border mb-4 block" aria-hidden="true">
                  {step.number}
                </span>
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-body-sm leading-relaxed">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Materials & Finishes */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {t('bespoke.materialsSubtitle')}
              </p>
              <h2 className="font-serif text-display-sm text-foreground mb-8">
                {t('bespoke.materialsTitle')}
              </h2>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-8">
                {t('bespoke.materialsDescription')}
              </p>
              <div className="space-y-4">
                <div className="border-l-2 border-brass pl-6">
                  <h3 className="font-sans text-sm uppercase tracking-wider text-foreground mb-1">
                    {t('bespoke.naturalStone')}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t('bespoke.naturalStoneList')}
                  </p>
                </div>
                <div className="border-l-2 border-stone pl-6">
                  <h3 className="font-sans text-sm uppercase tracking-wider text-foreground mb-1">
                    {t('bespoke.mineralComposites')}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t('bespoke.mineralCompositesList')}
                  </p>
                </div>
                <div className="border-l-2 border-muted-foreground pl-6">
                  <h3 className="font-sans text-sm uppercase tracking-wider text-foreground mb-1">
                    {t('bespoke.metalAccents')}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t('bespoke.metalAccentsList')}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {t('bespoke.craftsmanshipSubtitle')}
              </p>
              <h2 className="font-serif text-display-sm text-foreground mb-8">
                {t('bespoke.craftsmanshipTitle')}
              </h2>
              <p className="text-muted-foreground text-body-md leading-relaxed mb-6">
                {t('bespoke.craftsmanshipDescription')}
              </p>
              <p className="text-muted-foreground text-body-md leading-relaxed">
                {t('bespoke.leadTimeDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <header className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-background/60 mb-4">
                {t('bespoke.formSubtitle')}
              </p>
              <h2 className="font-serif text-display-sm">
                {t('bespoke.formTitle')}
              </h2>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bespoke-name" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    {t('bespoke.formName')}
                  </label>
                  <Input
                    id="bespoke-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder={t('bespoke.formNamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="bespoke-email" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    {t('bespoke.formEmail')}
                  </label>
                  <Input
                    id="bespoke-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder={t('bespoke.formEmailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bespoke-location" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    {t('bespoke.formLocation')}
                  </label>
                  <Input
                    id="bespoke-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder={t('bespoke.formLocationPlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="bespoke-projectType" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                    {t('bespoke.formProjectType')}
                  </label>
                  <Input
                    id="bespoke-projectType"
                    type="text"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                    placeholder={t('bespoke.formProjectTypePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bespoke-timeline" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                  {t('bespoke.formTimeline')}
                </label>
                <Input
                  id="bespoke-timeline"
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60"
                  placeholder={t('bespoke.formTimelinePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="bespoke-message" className="block font-sans text-xs uppercase tracking-wider text-background/60 mb-2">
                  {t('bespoke.formVision')}
                </label>
                <Textarea
                  id="bespoke-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-transparent border-background/20 text-background placeholder:text-background/40 focus:border-background/60 resize-none"
                  placeholder={t('bespoke.formVisionPlaceholder')}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" variant="outline" size="lg" className="w-full border-background/40 text-background hover:bg-background hover:text-foreground">
                  {t('bespoke.formSubmit')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bespoke;
