export interface StyleCollection {
  slug: string;
  name: string;
  tagline: string;
  cover: string | null;       // null → grey placeholder
  images: (string | null)[];  // null entries → grey placeholders
}

export const STYLE_COLLECTIONS: StyleCollection[] = [
  { slug: 'herenhuis-amsterdam',  name: 'Herenhuis Amsterdam',  tagline: 'Klassieke grandeur, hedendaagse rust.',  cover: null, images: [null, null, null, null, null, null] },
  { slug: 'grachtenpand-utrecht', name: 'Grachtenpand Utrecht', tagline: 'Historisch karakter, ingetogen luxe.',    cover: null, images: [null, null, null, null, null] },
  { slug: 'villa-laren',          name: 'Villa Laren',          tagline: 'Ruimte, licht en natuursteen.',           cover: null, images: [null, null, null, null, null] },
  { slug: 'loft-rotterdam',       name: 'Loft Rotterdam',       tagline: 'Industrieel, warm verzacht.',             cover: null, images: [null, null, null, null, null] },
];

export const getCollectionBySlug = (slug: string) =>
  STYLE_COLLECTIONS.find((c) => c.slug === slug);
