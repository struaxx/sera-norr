

## Plan: Consolideer naar /collections, verwijder /lookbook en /collections/:collectionId

### Wat er verandert

**1. Routes opschonen (App.tsx)**
- `/collections` blijft → toont `Collections.tsx` (masonry grid, geen email-gate)
- `/lookbook` route verwijderd (was de email-gated versie)
- `/collections/:collectionId` route verwijderd
- `/lookbook` redirect naar `/collections` voor eventuele oude links

**2. Navigatie-links updaten**
Alle verwijzingen naar `/lookbook` worden `/collections`:
- **Header.tsx**: nav link "Collecties" → `/collections`
- **Footer.tsx**: "Lookbook" link + "Online voorbeelden" link → `/collections`
- **Index.tsx**: lookbook preview grid link + CTA button → `/collections`
- **Voorstel.tsx**: "Bekijk online voorbeelden" link → `/collections`

**3. Opruimen**
- `Lookbook.tsx` lazy import verwijderen uit App.tsx (bestand kan later verwijderd)
- `CollectionDetail.tsx` lazy import verwijderen uit App.tsx

### Bestanden die worden aangepast
- `src/App.tsx` — routes + imports
- `src/components/layout/Header.tsx` — nav path
- `src/components/layout/Footer.tsx` — 2 links
- `src/pages/Index.tsx` — preview grid link + CTA
- `src/pages/Voorstel.tsx` — CTA link

