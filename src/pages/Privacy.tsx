import { Layout } from "@/components/layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  return (
    <Layout>
      <SEOHead
        title={isNL ? 'Privacybeleid | SERA NORR' : 'Privacy Policy | SERA NORR'}
        description={isNL ? 'Lees hoe SERA NORR omgaat met uw persoonsgegevens conform de AVG.' : 'Read how SERA NORR handles your personal data in compliance with GDPR.'}
        noindex
      />

      <main className="pt-32 pb-20 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-12">
            {isNL ? 'Privacybeleid' : 'Privacy Policy'}
          </h1>

          <div className="prose prose-stone max-w-none space-y-8 text-muted-foreground text-body-md leading-relaxed">
            <p className="text-sm text-muted-foreground/70">
              {isNL ? 'Laatst bijgewerkt: februari 2026' : 'Last updated: February 2026'}
            </p>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? '1. Wie zijn wij' : '1. Who we are'}
              </h2>
              <p>
                {isNL
                  ? 'SERA NORR is een online designatelier voor maatwerk natuursteenmeubels, gevestigd in Nederland. KvK-nummer: 89004213.'
                  : 'SERA NORR is an online design atelier for bespoke natural stone furniture, based in the Netherlands. Chamber of Commerce (KvK) number: 89004213.'}
              </p>
              <p>
                {isNL
                   ? 'Voor vragen over dit privacybeleid kunt u contact opnemen via info@sera-norr.com.'
                   : 'For questions about this privacy policy, please contact us at info@sera-norr.com.'}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? '2. Welke gegevens verzamelen wij' : '2. What data we collect'}
              </h2>
              <p>{isNL ? 'Wij verwerken de volgende persoonsgegevens:' : 'We process the following personal data:'}</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>{isNL ? 'Naam en e-mailadres (bij het aanvragen van een voorstel of contact)' : 'Name and email address (when requesting a proposal or contacting us)'}</li>
                <li>{isNL ? 'Telefoonnummer (optioneel, indien opgegeven)' : 'Phone number (optional, if provided)'}</li>
                <li>{isNL ? 'Configuratiegegevens van uw ontwerp (vormen, materialen, afmetingen)' : 'Configuration data of your design (shapes, materials, dimensions)'}</li>
                <li>{isNL ? 'Anonieme analytische gegevens (paginabezoeken, apparaattype)' : 'Anonymous analytics data (page visits, device type)'}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? '3. Grondslag en doel' : '3. Legal basis and purpose'}
              </h2>
              <p>
                {isNL
                  ? 'Wij verwerken uw gegevens op basis van: (a) uw toestemming (contactformulier, cookies), (b) uitvoering van een overeenkomst (voorstelaanvraag), en (c) gerechtvaardigd belang (website-analyse).'
                  : 'We process your data based on: (a) your consent (contact form, cookies), (b) performance of a contract (proposal request), and (c) legitimate interest (website analytics).'}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? '4. Bewaartermijnen' : '4. Retention periods'}
              </h2>
              <p>
                {isNL
                  ? 'Persoonsgegevens worden niet langer bewaard dan noodzakelijk. Contactgegevens worden maximaal 2 jaar na laatste contact bewaard. Analytische data wordt geanonimiseerd na 26 maanden.'
                  : 'Personal data is not stored longer than necessary. Contact details are retained for a maximum of 2 years after last contact. Analytics data is anonymized after 26 months.'}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? '5. Delen met derden' : '5. Third-party sharing'}
              </h2>
              <p>
                {isNL
                  ? 'Wij delen uw gegevens niet met derden, behalve wanneer dit noodzakelijk is voor de uitvoering van onze diensten (bijv. bezorgpartners) of wettelijk vereist.'
                  : 'We do not share your data with third parties, except when necessary for the execution of our services (e.g., delivery partners) or legally required.'}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? '6. Cookies' : '6. Cookies'}
              </h2>
              <p>
                {isNL
                  ? 'Wij gebruiken functionele cookies en, met uw toestemming, analytische cookies. U kunt uw cookievoorkeuren te allen tijde aanpassen via de cookiebanner.'
                  : 'We use functional cookies and, with your consent, analytical cookies. You can adjust your cookie preferences at any time via the cookie banner.'}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? '7. Uw rechten' : '7. Your rights'}
              </h2>
              <p>
                {isNL
                  ? 'Op grond van de AVG (GDPR) heeft u recht op inzage, rectificatie, verwijdering, beperking en overdraagbaarheid van uw gegevens, alsmede het recht om bezwaar te maken. U kunt deze rechten uitoefenen door contact op te nemen via info@seranorr.com. U heeft tevens het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens.'
                  : 'Under the GDPR, you have the right to access, rectification, erasure, restriction, and portability of your data, as well as the right to object. You can exercise these rights by contacting info@seranorr.com. You also have the right to file a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).'}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">
                {isNL ? '8. Beveiliging' : '8. Security'}
              </h2>
              <p>
                {isNL
                  ? 'Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, ongeautoriseerde toegang en onrechtmatige verwerking.'
                  : 'We take appropriate technical and organizational measures to protect your personal data against loss, unauthorized access, and unlawful processing.'}
              </p>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}
