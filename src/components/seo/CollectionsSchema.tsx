import { Helmet } from "react-helmet-async";

const collectionsItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SERA NORR Collecties",
  description:
    "Maatwerk meubels in natuursteen: travertin, Calacatta Viola en geselecteerde steensoorten.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Travertin eettafel op maat",
      url: "https://sera-norr.com/collections",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Marmeren tafel Calacatta Viola",
      url: "https://sera-norr.com/collections",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Natuursteen meubels op maat",
      url: "https://sera-norr.com/collections",
    },
  ],
};

export function CollectionsSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(collectionsItemList)}
      </script>
    </Helmet>
  );
}
