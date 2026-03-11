

## Plan: Nieuwe foto's toevoegen + layout-aanpassingen Collections & Lookbook

### Wat er verandert

**1. Nieuwe foto's toevoegen aan beide pagina's**
Er zijn 18 nieuwe `hf_*` foto's in `public/lookbook/`. Deze worden toegevoegd als extra items aan zowel:
- `src/pages/Collections.tsx` — het masonry grid (nu 12 items, wordt ~30)
- `src/pages/Lookbook.tsx` — de lookbook galerij (nu 12 items, wordt ~30)

Elke nieuwe foto krijgt een passende naam, collectie (VANTA/TERRA), steensoort, en type op basis van de bestandsnamen.

**2. Sticky filter bar verwijderen (Collections)**
De hele `<section>` met de sticky filter bar (ALLES / VANTA / TERRA / EETTAFELS / etc.) wordt verwijderd uit `Collections.tsx`. De bijbehorende filter state (`activeFilter`, `filterOptions`, filter logic) wordt ook opgeruimd. Alle items worden altijd getoond.

**3. Duidelijke grens tussen header en foto's (Collections)**
In plaats van de zwevende overgang wordt er een zichtbare `border-b border-foreground/10` of een `<Hairline>` component toegevoegd onderaan de header section, zodat er een duidelijke visuele scheiding is voor het fotogrid begint.

### Bestanden die worden aangepast
- `src/pages/Collections.tsx` — nieuwe items, filter verwijderen, separator toevoegen
- `src/pages/Lookbook.tsx` — nieuwe items toevoegen

