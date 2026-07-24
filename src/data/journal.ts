// Journal articles — data-driven so the list page and the article detail page
// render from one source. Body is authored as typed blocks (no raw HTML) so it
// stays styleable and safe to render.

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export interface JournalArticle {
  slug: string;
  category: "materials" | "care" | "interiors" | "craftsmanship";
  /** ISO date, e.g. "2026-07-01" */
  date: string;
  /** Estimated reading time in minutes */
  readTime: number;
  title: string;
  excerpt: string;
  metaDescription: string;
  blocks: ArticleBlock[];
}

// NOTE: body content is filled from the vetted writing pipeline. Placeholder
// blocks below keep the build valid until the final copy is dropped in.
export const journalArticles: JournalArticle[] = [
  {
    slug: "travertijn-of-marmer-eettafel",
    category: "materials",
    date: "2026-07-01",
    readTime: 6,
    title: "Travertijn of marmer: welke natuursteen past bij jouw eettafel?",
    excerpt:
      "Twee populaire natuurstenen voor een tafel op maat, naast elkaar gelegd — uiterlijk, onderhoud en wat de prijs bepaalt.",
    metaDescription:
      "Travertijn of marmer voor je natuurstenen tafel? Een objectieve vergelijking van uiterlijk, onderhoud en prijs, zodat je een onderbouwde keuze maakt.",
    blocks: [
      { type: "p", text: "Placeholder — wordt vervangen door de definitieve, gecontroleerde tekst." },
    ],
  },
];

export const getArticleBySlug = (slug: string): JournalArticle | undefined =>
  journalArticles.find((a) => a.slug === slug);
