import { Layout } from "@/components/layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  return (
    <Layout>
      <SEOHead
        title={isNL ? 'Algemene Voorwaarden | SERA NORR' : 'Terms & Conditions | SERA NORR'}
        description={isNL ? 'Algemene voorwaarden van SERA NORR, inclusief retour- en annuleringsbeleid.' : 'Terms and conditions of SERA NORR, including return and cancellation policy.'}
        noindex
      />

      <main className="pt-32 pb-20 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-12">
            {isNL ? 'Algemene Voorwaarden' : 'Terms & Conditions'}
          </h1>

          <div className="prose prose-stone max-w-none space-y-8 text-muted-foreground text-body-md leading-relaxed">
            <p className="text-sm text-muted-foreground/70">
              {isNL ? 'Laatst bijgewerkt: februari 2026' : 'Last updated: February 2026'}
            </p>

            {/* Bedrijfsgegevens */}
            <section className="bg-secondary/30 rounded-lg p-6 border border-border/50">
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Bedrijfsgegevens' : 'Company details'}
              </h2>
              <ul className="space-y-1 text-sm">
                <li><strong>SERA NORR</strong></li>
                <li>{isNL ? 'KvK-nummer' : 'Chamber of Commerce (KvK)'}: 89004213</li>
                <li>E-mail: info@seranorr.com</li>
                <li>{isNL ? 'Vestiging: Nederland' : 'Based in: The Netherlands'}</li>
              </ul>
            </section>

            {/* Artikel 1 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 1 — Definities' : 'Article 1 — Definitions'}
              </h2>
              <p>
                {isNL
                  ? 'In deze algemene voorwaarden wordt verstaan onder: "SERA NORR" de onderneming ingeschreven bij de KvK onder nummer 89004213; "Klant" de natuurlijke of rechtspersoon die een bestelling plaatst of voorstel aanvraagt; "Maatwerk" een product dat op specificatie van de klant wordt vervaardigd.'
                  : 'In these terms, "SERA NORR" refers to the business registered with the Dutch Chamber of Commerce under number 89004213; "Customer" means the natural or legal person placing an order or requesting a proposal; "Bespoke" means a product manufactured to the customer\'s specifications.'}
              </p>
            </section>

            {/* Artikel 2 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 2 — Toepasselijkheid' : 'Article 2 — Applicability'}
              </h2>
              <p>
                {isNL
                  ? 'Deze voorwaarden zijn van toepassing op alle aanbiedingen, offertes, bestellingen en overeenkomsten van SERA NORR. Door het plaatsen van een bestelling of aanvragen van een voorstel gaat de klant akkoord met deze voorwaarden.'
                  : 'These terms apply to all offers, quotations, orders, and agreements with SERA NORR. By placing an order or requesting a proposal, the customer agrees to these terms.'}
              </p>
            </section>

            {/* Artikel 3 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 3 — Offertes en overeenkomsten' : 'Article 3 — Quotations and agreements'}
              </h2>
              <p>
                {isNL
                  ? 'Alle prijsindicaties op de website zijn richtprijzen. Een bindende overeenkomst komt pas tot stand na schriftelijke bevestiging van SERA NORR. Offertes zijn 30 dagen geldig, tenzij anders vermeld. Prijzen zijn inclusief BTW voor particuliere klanten binnen Nederland, tenzij anders aangegeven.'
                  : 'All price indications on the website are guide prices. A binding agreement is only established upon written confirmation by SERA NORR. Quotations are valid for 30 days unless stated otherwise. Prices include VAT for private customers in the Netherlands, unless otherwise indicated.'}
              </p>
            </section>

            {/* Artikel 4 — Retour & Annulering */}
            <section id="retour" className="border-l-2 border-primary/30 pl-6">
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 4 — Herroepingsrecht, retour & annulering' : 'Article 4 — Right of withdrawal, returns & cancellation'}
              </h2>

              <h3 className="font-sans text-sm uppercase tracking-wider text-foreground mt-4 mb-2">
                {isNL ? '4.1 Maatwerkproducten' : '4.1 Bespoke products'}
              </h3>
              <p>
                {isNL
                  ? 'Conform artikel 6:230p lid 1 sub f BW zijn maatwerkproducten uitgesloten van het herroepingsrecht. Aangezien alle SERA NORR producten op maat worden vervaardigd uit natuursteen, is retournering na productie niet mogelijk. Dit wordt duidelijk vermeld bij het plaatsen van een bestelling.'
                  : 'In accordance with Dutch law (article 6:230p paragraph 1 sub f BW), bespoke products are excluded from the right of withdrawal. Since all SERA NORR products are custom-made from natural stone, returns after production are not possible. This is clearly communicated at the time of ordering.'}
              </p>

              <h3 className="font-sans text-sm uppercase tracking-wider text-foreground mt-4 mb-2">
                {isNL ? '4.2 Annulering vóór productie' : '4.2 Cancellation before production'}
              </h3>
              <p>
                {isNL
                  ? 'Annulering is kosteloos mogelijk zolang de productie nog niet is gestart. Na aanvang van de productie is annulering niet meer mogelijk. SERA NORR informeert de klant tijdig wanneer de productie start.'
                  : 'Cancellation is free of charge as long as production has not yet started. After production begins, cancellation is no longer possible. SERA NORR will inform the customer in advance when production starts.'}
              </p>

              <h3 className="font-sans text-sm uppercase tracking-wider text-foreground mt-4 mb-2">
                {isNL ? '4.3 Beschadigde of afwijkende producten' : '4.3 Damaged or deviating products'}
              </h3>
              <p>
                {isNL
                  ? 'Bij ontvangst van een beschadigd product of een product dat wezenlijk afwijkt van de overeenkomst, dient de klant dit binnen 48 uur na levering schriftelijk (per e-mail met foto\'s) te melden. SERA NORR zal in overleg met de klant zorgen voor herstel of vervanging. Natuursteen is een natuurproduct; kleur- en adervariaties zijn inherent aan het materiaal en vormen geen grond voor retour.'
                  : 'Upon receipt of a damaged product or one that materially deviates from the agreement, the customer must report this in writing (by email with photos) within 48 hours of delivery. SERA NORR will arrange for repair or replacement in consultation with the customer. Natural stone is a natural product; color and vein variations are inherent to the material and do not constitute grounds for return.'}
              </p>
            </section>

            {/* Artikel 5 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 5 — Betaling' : 'Article 5 — Payment'}
              </h2>
              <p>
                {isNL
                  ? 'Betaling geschiedt conform de afspraken in de offerte. In de regel wordt een aanbetaling van 50% gevraagd bij bevestiging, en het resterende bedrag vóór levering. Bij niet-tijdige betaling is SERA NORR gerechtigd de levering op te schorten.'
                  : 'Payment is made according to the terms in the quotation. Typically, a 50% deposit is required upon confirmation, with the remaining balance due before delivery. In case of late payment, SERA NORR is entitled to suspend delivery.'}
              </p>
            </section>

            {/* Artikel 6 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 6 — Levering' : 'Article 6 — Delivery'}
              </h2>
              <p>
                {isNL
                  ? 'Leveringstermijnen zijn indicatief en afhankelijk van het type steen en de complexiteit van het ontwerp. Gangbare levertijden zijn 12–16 weken. SERA NORR is niet aansprakelijk voor vertragingen door overmacht. Levering geschiedt met white-glove bezorgservice, inclusief plaatsing in de gewenste ruimte. Zie onze pagina Verzending & Levering voor meer details.'
                  : 'Delivery times are indicative and depend on the type of stone and complexity of the design. Typical lead times are 12–16 weeks. SERA NORR is not liable for delays due to force majeure. Delivery includes white-glove service with placement in the desired room. See our Shipping & Delivery page for more details.'}
              </p>
            </section>

            {/* Artikel 7 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 7 — Garantie' : 'Article 7 — Warranty'}
              </h2>
              <p>
                {isNL
                  ? 'SERA NORR garandeert dat producten voldoen aan de overeengekomen specificaties en vrij zijn van fabricagefouten. Garantie geldt niet voor schade door onjuist gebruik, onvoldoende onderhoud of normale slijtage. Structurele fabricagefouten worden kosteloos hersteld of vervangen.'
                  : 'SERA NORR guarantees that products meet the agreed specifications and are free from manufacturing defects. Warranty does not cover damage from improper use, insufficient maintenance, or normal wear. Structural manufacturing defects will be repaired or replaced free of charge.'}
              </p>
            </section>

            {/* Artikel 8 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 8 — Aansprakelijkheid' : 'Article 8 — Liability'}
              </h2>
              <p>
                {isNL
                  ? 'De aansprakelijkheid van SERA NORR is beperkt tot het factuurbedrag van de betreffende bestelling. SERA NORR is niet aansprakelijk voor indirecte schade, gevolgschade of schade door overmacht.'
                  : 'The liability of SERA NORR is limited to the invoice amount of the relevant order. SERA NORR is not liable for indirect damage, consequential damage, or damage due to force majeure.'}
              </p>
            </section>

            {/* Artikel 9 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 9 — Intellectueel eigendom' : 'Article 9 — Intellectual property'}
              </h2>
              <p>
                {isNL
                  ? 'Alle ontwerpen, afbeeldingen en content op sera-norr.com zijn eigendom van SERA NORR en mogen niet zonder schriftelijke toestemming worden gereproduceerd of verspreid.'
                  : 'All designs, images, and content on sera-norr.com are the property of SERA NORR and may not be reproduced or distributed without written permission.'}
              </p>
            </section>

            {/* Artikel 10 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 10 — Privacy' : 'Article 10 — Privacy'}
              </h2>
              <p>
                {isNL
                  ? 'Voor informatie over hoe wij omgaan met persoonsgegevens verwijzen wij naar ons '
                  : 'For information about how we handle personal data, please refer to our '}
                <a href="/privacy" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
                  {isNL ? 'privacybeleid' : 'privacy policy'}
                </a>.
              </p>
            </section>

            {/* Artikel 11 */}
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? 'Artikel 11 — Geschillen en toepasselijk recht' : 'Article 11 — Disputes and applicable law'}
              </h2>
              <p>
                {isNL
                  ? 'Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden bij voorkeur in onderling overleg opgelost. Indien dat niet lukt, is de bevoegde rechter in Nederland bevoegd. Consumenten kunnen ook gebruik maken van het Europees platform voor onlinegeschillenbeslechting (ODR): ec.europa.eu/consumers/odr.'
                  : 'All agreements are governed by Dutch law. Disputes are preferably resolved through mutual consultation. If that fails, the competent court in the Netherlands has jurisdiction. Consumers may also use the European Online Dispute Resolution platform (ODR): ec.europa.eu/consumers/odr.'}
              </p>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}
