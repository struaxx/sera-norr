import ha1 from "@/assets/collections/herenhuis-amsterdam/ha-1.jpg.asset.json";
import ha2 from "@/assets/collections/herenhuis-amsterdam/ha-2.jpg.asset.json";
import ha3 from "@/assets/collections/herenhuis-amsterdam/ha-3.jpg.asset.json";
import ha4 from "@/assets/collections/herenhuis-amsterdam/ha-4.jpg.asset.json";
import ha5 from "@/assets/collections/herenhuis-amsterdam/ha-5.jpg.asset.json";
import ha6 from "@/assets/collections/herenhuis-amsterdam/ha-6.jpg.asset.json";
import ha7 from "@/assets/collections/herenhuis-amsterdam/ha-7.jpg.asset.json";
import ha8 from "@/assets/collections/herenhuis-amsterdam/ha-8.jpg.asset.json";
import gu1 from "@/assets/collections/grachtenpand-utrecht/gu-1.jpg.asset.json";
import gu2 from "@/assets/collections/grachtenpand-utrecht/gu-2.jpg.asset.json";
import gu3 from "@/assets/collections/grachtenpand-utrecht/gu-3.jpg.asset.json";
import gu4 from "@/assets/collections/grachtenpand-utrecht/gu-4.jpg.asset.json";
import gu5 from "@/assets/collections/grachtenpand-utrecht/gu-5.jpg.asset.json";
import gu6 from "@/assets/collections/grachtenpand-utrecht/gu-6.jpg.asset.json";
import gu7 from "@/assets/collections/grachtenpand-utrecht/gu-7.jpg.asset.json";

export interface StyleCollection {
  slug: string;
  name: string;
  tagline: string;
  cover: string | null;       // null → grey placeholder
  images: (string | null)[];  // null entries → grey placeholders
  comingSoon?: boolean;
}

export const STYLE_COLLECTIONS: StyleCollection[] = [
  {
    slug: 'herenhuis-amsterdam',
    name: 'Herenhuis Amsterdam',
    tagline: 'Klassieke grandeur, hedendaagse rust.',
    cover: ha1.url,
    images: [ha1.url, ha2.url, ha8.url, ha6.url, ha4.url, ha5.url, ha3.url, ha7.url],
  },
  {
    slug: 'grachtenpand-utrecht',
    name: 'Grachtenpand Utrecht',
    tagline: 'Historisch karakter, ingetogen luxe.',
    cover: gu1.url,
    images: [gu1.url, gu4.url, gu7.url, gu3.url, gu2.url, gu5.url, gu6.url],
  },
  { slug: 'villa-laren',          name: 'Villa Laren',          tagline: 'Ruimte, licht en natuursteen.',           cover: null, images: [null, null, null, null, null], comingSoon: true },
  { slug: 'loft-rotterdam',       name: 'Loft Rotterdam',       tagline: 'Industrieel, warm verzacht.',             cover: null, images: [null, null, null, null, null], comingSoon: true },
];

export const getCollectionBySlug = (slug: string) =>
  STYLE_COLLECTIONS.find((c) => c.slug === slug);
