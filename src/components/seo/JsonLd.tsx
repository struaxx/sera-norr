import { Helmet } from "react-helmet-async";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://sera-norr.com/#organization",
  name: "SERA NORR",
  url: "https://sera-norr.com",
  logo: "https://sera-norr.com/logo.png",
  description:
    "Online atelier voor maatwerk stenen meubels in travertin en marmer. Ontworpen in Nederland.",
  email: "info@sera-norr.com",
  telephone: "+31 6 83 99 11 58",
  areaServed: { "@type": "Country", name: "Netherlands" },
  sameAs: [
    "https://www.instagram.com/seranorr/",
    "https://www.pinterest.com/seranorr/",
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://sera-norr.com/#website",
  name: "SERA NORR",
  url: "https://sera-norr.com",
  description:
    "Online atelier voor maatwerk stenen meubels in travertin en marmer.",
  inLanguage: ["nl", "en"],
  publisher: { "@id": "https://sera-norr.com/#organization" },
};

interface JsonLdProps {
  data: object | object[];
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <Helmet>
      {items.map((item, i) => (
        <script
          key={`${id ?? "jsonld"}-${i}`}
          type="application/ld+json"
        >
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}

export function OrganizationJsonLd() {
  return <JsonLd data={organizationJsonLd} id="organization" />;
}

export function WebSiteJsonLd() {
  return <JsonLd data={websiteJsonLd} id="website" />;
}
