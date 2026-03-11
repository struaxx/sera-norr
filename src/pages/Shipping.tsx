import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead, generateBreadcrumbSchema, generateFAQSchema, Breadcrumbs } from "@/components/seo";
import { ArrowRight, Truck, ShieldCheck, Package, Clock } from "lucide-react";
import { Hairline } from "@/components/ui/hairline";

const Shipping = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  const faqItems = isNL ? [
    { question: 'Wat kost de levering?', answer: 'Levering, plaatsing en verpakkingsafvoer zijn inbegrepen in de prijs van elk meubel. Er zijn geen verborgen kosten.' },
    { question: 'Hoe lang duurt de levertijd?', answer: 'De productietijd bedraagt gemiddeld 12–16 weken na definitieve goedkeuring van uw ontwerp. U ontvangt een persoonlijke planning zodra uw bestelling is bevestigd.' },
    { question: 'Leveren jullie in heel Nederland en België?', answer: 'Ja, wij leveren door heel Nederland en België. Levering in andere Europese landen is op aanvraag mogelijk.' },
    { question: 'Wat houdt white-glove levering in?', answer: 'Ons team levert uw meubel tot in de gewenste ruimte, plaatst het op de juiste positie en neemt alle verpakkingsmaterialen mee. U hoeft niets zelf te doen.' },
    { question: 'Kan ik een specifieke leverdag kiezen?', answer: 'Ja, wij plannen de levering in overleg op een dag en tijdstip dat u schikt. U wordt vooraf gecontacteerd om een afspraak te maken.' },
    { question: 'Wat als mijn meubel beschadigd aankomt?', answer: 'Alle meubels zijn volledig verzekerd tijdens transport. In het onwaarschijnlijke geval van schade lossen wij dit kosteloos op — reparatie of volledige vervanging.' },
  ] : [
    { question: 'What does delivery cost?', answer: 'Delivery, placement and packaging removal are included in the price of every piece. There are no hidden costs.' },
    { question: 'How long is the lead time?', answer: 'Production time averages 12–16 weeks after final approval of your design. You receive a personal timeline once your order is confirmed.' },
    { question: 'Do you deliver throughout the Netherlands and Belgium?', answer: 'Yes, we deliver throughout the Netherlands and Belgium. Delivery to other European countries is available on request.' },
    { question: 'What does white-glove delivery include?', answer: 'Our team delivers your piece to the desired room, positions it exactly where you want it, and removes all packaging materials. You don\'t need to do a thing.' },
    { question: 'Can I choose a specific delivery day?', answer: 'Yes, we schedule delivery in consultation on a day and time that suits you. You will be contacted in advance to arrange an appointment.' },
    { question: 'What if my furniture arrives damaged?', answer: 'All pieces are fully insured during transport. In the unlikely event of damage, we resolve this at no cost — repair or full replacement.' },
  ];

  const seoTitle = isNL
    ? "Verzending & Levering | SERA NORR"
    : "Shipping & Delivery | SERA NORR";

  const seoDescription = isNL
    ? "White-glove levering inbegrepen bij elk SERA NORR meubel. Plaatsing, verpakkingsafvoer en volledige verzekering — zonder extra kosten."
    : "White-glove delivery included with every SERA NORR piece. Placement, packaging removal and full insurance — at no extra cost.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: isNL ? 'Verzending & Levering' : 'Shipping & Delivery', url: '/shipping' },
  ]);

  const faqSchema = generateFAQSchema(faqItems);

  const steps = isNL ? [
    { icon: ShieldCheck, title: 'Goedkeuring ontwerp', description: 'Na uw definitieve akkoord op het ontwerp en de materialen starten wij de productie.' },
    { icon: Clock, title: 'Productie: 12–16 weken', description: 'Uw meubel wordt op maat vervaardigd in ons atelier. U ontvangt updates over de voortgang.' },
    { icon: Package, title: 'Zorgvuldige verpakking', description: 'Elk stuk wordt individueel beschermd met op maat gemaakte beschermingsmaterialen voor veilig transport.' },
    { icon: Truck, title: 'White-glove levering', description: 'Ons team levert tot in uw ruimte, plaatst het meubel en neemt alle verpakking mee.' },
  ] : [
    { icon: ShieldCheck, title: 'Design approval', description: 'After your final approval of the design and materials, we begin production.' },
    { icon: Clock, title: 'Production: 12–16 weeks', description: 'Your piece is crafted to order in our atelier. You receive progress updates along the way.' },
    { icon: Package, title: 'Careful packaging', description: 'Each piece is individually protected with custom-made protective materials for safe transport.' },
    { icon: Truck, title: 'White-glove delivery', description: 'Our team delivers to your room, positions the piece and removes all packaging.' },
  ];

  return (
    <Layout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        structuredData={[breadcrumbSchema, faqSchema]}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: isNL ? 'Verzending & Levering' : 'Shipping & Delivery', href: '/shipping' },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground">
            {isNL ? 'Verzending & Levering' : 'Shipping & Delivery'}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isNL
              ? 'White-glove levering is inbegrepen bij elk SERA NORR meubel. Wij verzorgen het transport, de plaatsing en de verpakkingsafvoer — zodat u alleen hoeft te genieten.'
              : 'White-glove delivery is included with every SERA NORR piece. We handle transport, placement and packaging removal — so all you need to do is enjoy.'}
          </p>
        </div>
      </section>

      <Hairline />

      {/* Process steps */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 text-center">
            {isNL ? 'Van atelier tot uw interieur' : 'From atelier to your interior'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 p-6 bg-secondary/30 rounded-sm border border-border">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-foreground/5 rounded-sm">
                  <step.icon className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {isNL ? 'Stap' : 'Step'} {i + 1}
                  </p>
                  <h3 className="font-serif text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Hairline />

      {/* Included services */}
      <section className="py-16 lg:py-24 bg-secondary/20">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
            {isNL ? 'Altijd inbegrepen' : 'Always included'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {(isNL ? [
              { label: 'Levering & plaatsing', desc: 'Tot in de gewenste ruimte, op de juiste positie.' },
              { label: 'Volledige verzekering', desc: 'Uw meubel is beschermd tijdens het hele transport.' },
              { label: 'Verpakkingsafvoer', desc: 'Wij nemen alle materialen mee — u houdt een schone ruimte.' },
            ] : [
              { label: 'Delivery & placement', desc: 'To the desired room, in the exact position.' },
              { label: 'Full insurance', desc: 'Your piece is protected throughout transport.' },
              { label: 'Packaging removal', desc: 'We take all materials with us — you keep a clean space.' },
            ]).map((item, i) => (
              <div key={i} className="p-5 bg-background border border-border rounded-sm">
                <h3 className="text-sm font-medium text-foreground mb-2">{item.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Hairline />

      {/* FAQ */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 text-center">
            {isNL ? 'Veelgestelde vragen' : 'Frequently asked questions'}
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-sm px-5">
                <AccordionTrigger className="text-sm text-foreground hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Hairline />

      {/* CTA */}
      <section className="py-16 lg:py-24 text-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            {isNL ? 'Klaar om te beginnen?' : 'Ready to get started?'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isNL
              ? 'Ontwerp uw tafel in ons atelier en ontvang een vrijblijvend voorstel.'
              : 'Design your table in our atelier and receive a no-obligation proposal.'}
          </p>
          <Button asChild size="lg">
            <Link to="/atelier">
              {isNL ? 'Start in het atelier' : 'Start in the atelier'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Shipping;
