// Post-build SEO prerender.
//
// A client-side React SPA serves the same empty index.html for every route, so
// crawlers and social scrapers that don't run JS see only the homepage's meta.
// This script writes a per-route dist/<path>/index.html with the correct
// <title>, description, canonical and Open Graph / Twitter tags baked into the
// static HTML. The JS bundle still boots the full SPA on load.
//
// Runs in plain Node (no headless browser), so it works in any CI including
// Cloudflare Workers Builds. Route meta mirrors the values in each page's
// <SEOHead> (Dutch, the site's default language).

import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const SITE = 'https://sera-norr.com';
const DIST = 'dist';
const OG_IMAGE = `${SITE}/og-image.jpg`;

// path -> { title, description, noindex? }
const ROUTES = {
  '/': {
    title: 'SERA NORR | Natuurstenen Tafels op Maat',
    description:
      'Natuurstenen tafels op maat: handgemaakte eettafels en salontafels in travertijn, Calacatta Viola en Statuario. White-glove geleverd.',
  },
  '/collections': {
    title: 'Lookbook Natuurstenen Tafels | Sera Norr',
    description:
      'Lookbook ter inspiratie: interieurs met natuurstenen tafels als startpunt voor uw eigen ontwerp in travertijn of marmer.',
  },
  '/atelier': {
    title: 'Natuurstenen Tafel op Maat Samenstellen | Sera Norr Atelier',
    description:
      'Stel uw natuurstenen tafel op maat samen: steensoort, formaat, onderstel. Directe prijsindicatie. Geen verplichtingen.',
  },
  '/over': {
    title: 'Over Sera Norr | Atelier voor natuursteen meubels op maat',
    description:
      'Sera Norr is een atelier voor maatwerk meubels in natuursteen. Eén materiaal, volle aandacht, sculpturale stukken die generaties meegaan.',
  },
  '/contact': {
    title: 'Contact | SERA NORR Atelier',
    description:
      'Neem contact op met SERA NORR. Deel uw vraag of idee voor maatwerk stenen meubels in travertin of marmer.',
  },
  '/journal': {
    title: 'Journal, Inzichten over Stenen Meubels | SERA NORR',
    description:
      'Artikelen over natuursteen, onderhoud, interieurs en Europees vakmanschap. Verdiep u in travertin, Calacatta Viola en het maakproces.',
  },
  '/care': {
    title: 'Onderhoud & verzorging | SERA NORR',
    description:
      'Natuursteen is een levend materiaal. Algemene basis plus specifieke verzorging voor marmer, travertijn en kwartsiet.',
  },
  '/shipping': {
    title: 'Verzending & Levering | SERA NORR',
    description:
      'White-glove levering inbegrepen bij elk SERA NORR meubel. Plaatsing, verpakkingsafvoer en volledige verzekering, zonder extra kosten.',
  },
  '/voorstel': {
    title: 'Uw voorstel | Sera Norr',
    description: 'Bekijk uw configuratie en vraag vrijblijvend een persoonlijk voorstel aan.',
  },
  '/journal/travertijn-of-marmer-eettafel': {
    title: 'Travertijn of marmer voor uw natuurstenen tafel',
    description:
      'Twijfelt u tussen travertijn en marmer voor een natuurstenen tafel? Lees hoe ze verschillen in uiterlijk en onderhoud, en wat de prijs bepaalt.',
  },
  '/collections/herenhuis-amsterdam': {
    title: 'Herenhuis Amsterdam | Sera Norr',
    description: 'Klassieke grandeur, hedendaagse rust.',
  },
  '/collections/grachtenpand-utrecht': {
    title: 'Grachtenpand Utrecht | Sera Norr',
    description: 'Historisch karakter, ingetogen luxe.',
  },
  '/trade': {
    title: 'Trade Program | Sera Norr',
    description:
      'Voor interieurontwerpers, architecten en projectontwikkelaars. Trade-tarieven, prioriteit en uitgebreide slab-pre-selectie.',
    noindex: true,
  },
  '/privacy': {
    title: 'Privacybeleid | SERA NORR',
    description: 'Hoe SERA NORR omgaat met uw persoonsgegevens.',
    noindex: true,
  },
  '/terms': {
    title: 'Algemene Voorwaarden | SERA NORR',
    description: 'De algemene voorwaarden van SERA NORR.',
    noindex: true,
  },
};

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Add SERA NORR branding when the title lacks it (case-insensitive).
const brand = (title) => (/sera\s*norr/i.test(title) ? title : `${title} | SERA NORR`);

// Replace an existing <meta attr="key" content="..."> value, or insert one.
function setMeta(html, attr, key, value) {
  const v = escapeHtml(value);
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${v}$2`);
  return html.replace('</head>', `    <meta ${attr}="${key}" content="${v}">\n</head>`);
}

function setLink(html, rel, href, extra = '') {
  const re = new RegExp(`<link\\s+rel="${rel}"[^>]*>`, 'i');
  const tag = `<link rel="${rel}"${extra} href="${escapeHtml(href)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `    ${tag}\n</head>`);
}

// Organization + WebSite JSON-LD, baked statically so crawlers that skip JS
// still see it. The client-side SEOHead injects the same @ids, so consumers
// that run JS dedupe on @id.
const BASE_JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'SERA NORR',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png`, caption: 'SERA NORR logo' },
      image: OG_IMAGE,
      description:
        'SERA NORR is een online atelier voor maatwerk meubels in natuursteen (travertin, marmer en geselecteerde steensoorten). Ontworpen in Nederland.',
      areaServed: { '@type': 'Country', name: 'Netherlands' },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@sera-norr.com',
        telephone: '+31 6 83 99 11 58',
        contactType: 'customer service',
        availableLanguage: ['Dutch', 'English'],
      },
      sameAs: ['https://www.instagram.com/seranorr/', 'https://www.pinterest.com/seranorr/'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      name: 'SERA NORR',
      url: SITE,
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: ['nl', 'en'],
    },
  ],
});

// Replace the static hreflang block with per-route alternates.
function setHreflang(html, url) {
  html = html.replace(/[ \t]*<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\s*\n?/gi, '');
  const sep = url.includes('?') ? '&' : '?';
  const block = [
    `    <link rel="alternate" hreflang="nl" href="${url}" />`,
    `    <link rel="alternate" hreflang="en" href="${url}${sep}lang=en" />`,
    `    <link rel="alternate" hreflang="x-default" href="${url}" />`,
  ].join('\n');
  return html.replace('</head>', `${block}\n</head>`);
}

function render(template, route, meta) {
  const title = brand(meta.title);
  const url = `${SITE}${route}`;
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, 'name', 'description', meta.description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', meta.description);
  html = setMeta(html, 'property', 'og:type', meta.type || 'website');
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', OG_IMAGE);
  html = setMeta(html, 'property', 'og:image:width', '1200');
  html = setMeta(html, 'property', 'og:image:height', '630');
  html = setMeta(html, 'property', 'og:site_name', 'SERA NORR');
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', meta.description);
  html = setMeta(html, 'name', 'twitter:image', OG_IMAGE);
  html = setLink(html, 'canonical', url);
  html = setHreflang(html, url);
  if (meta.noindex) html = setMeta(html, 'name', 'robots', 'noindex,nofollow');
  html = html.replace(
    '</head>',
    `    <script type="application/ld+json">${BASE_JSONLD}</script>\n</head>`
  );
  return html;
}

// Sitemap: only canonical, indexable routes — generated from the same ROUTES
// map so it can never drift from what is actually prerendered.
function buildSitemap() {
  const urls = Object.entries(ROUTES)
    .filter(([, meta]) => !meta.noindex)
    .map(([route]) => {
      const priority = route === '/' ? '1.0' : route.split('/').length > 2 ? '0.7' : '0.8';
      return `  <url><loc>${SITE}${route}</loc><priority>${priority}</priority></url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
let count = 0;
for (const [route, meta] of Object.entries(ROUTES)) {
  const html = render(template, route, meta);
  const outPath =
    route === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, route.replace(/^\//, ''), 'index.html');
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  count++;
}
await writeFile(path.join(DIST, 'sitemap.xml'), buildSitemap());
console.log(`Prerendered SEO for ${count} routes + sitemap.xml.`);
