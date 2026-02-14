

## Systematische Fix: Vormen, Poten en Textures

### Huidige Problemen

**1. Twee losgekoppelde vormensystemen**
Er zijn twee type-systemen die niet op elkaar aansluiten:
- `TableShape` (UI): ellips, ovale, round, corner, cut-corner
- `RuleShape` (3D/rules): round, oval, rect, racetrack, square

De configurator gebruikt `RuleShape` direct, waardoor de vormen die jij aanbiedt niet correct worden weergegeven.

**2. Poten worden handmatig gekozen (1 of 2)**
Nu moet de gebruiker kiezen tussen "Pedestal" (1 poot) en "Double Pedestal" (2 poten). Dit moet automatisch gaan op basis van de tafelmaat. Kies je een grote ovaal (>=2000mm), dan worden het automatisch 2 poten. Kies je een ronde tafel, dan 1 poot.

**3. Poten staan op de verkeerde as**
`ExtrudeGeometry` (voor ovaal/racetrack) tekent de lengte langs de X-as, maar de plaatsingscode zet poten langs de Z-as. Hierdoor staan poten aan de zijkant in plaats van aan de uiteinden.

**4. Zebra-strepen textuur**
`ExtrudeGeometry` genereert slechte UV-coordinaten. De textuur wordt als strepen uitgerekt in plaats van als natuurlijk marmerpatroon.

---

### Stap 1: Eenvormig vormensysteem

De 5 vormen die jullie aanbieden met hun 3D-mapping:

| Jouw Vorm | 3D Geometrie | Beschrijving |
|-----------|-------------|-------------|
| Ellips | Elliptische ExtrudeGeometry | Echte ellips, overal rond |
| Round | CylinderGeometry | Perfect rond |
| Ovale | Stadium/Racetrack ExtrudeGeometry | Ovaal met iets rechtere zijdes |
| Corner | BoxGeometry met radius | Rechthoek met afgeronde hoeken |
| Cut-corner | Chamfered polygon | Rechthoek met afgeschuinde hoeken |

**Actie**: `RuleShape` type aanpassen naar `'ellips' | 'round' | 'ovale' | 'corner' | 'cut-corner'` zodat het exact overeenkomt met de UI. Alle verwijzingen in productRules, resolveConfiguration, TableMeshV3 en ConfiguratorPhase worden aangepast.

---

### Stap 2: Automatische pootlogica (1 of 2)

De gebruiker kiest een potstijl (bijv. "Pedestal" of "Fluted"). Het systeem bepaalt automatisch of het 1 of 2 poten worden:

| Situatie | Aantal poten |
|----------|-------------|
| Round (alle maten) | 1 |
| Ellips < 2000mm | 1 |
| Ellips >= 2000mm | 2 |
| Ovale < 2000mm | 1 |
| Ovale >= 2000mm | 2 |
| Corner (alle maten) | 4 poten of trestle |
| Cut-corner (alle maten) | 4 poten of trestle |

**Actie**: 
- `pedestal` en `double_pedestal` samenvoegen tot 1 stijl "Pedestal" die automatisch 1 of 2 wordt
- `fluted_pedestal` en `fluted_double` samenvoegen tot 1 stijl "Fluted" die automatisch 1 of 2 wordt
- De resolver bepaalt het aantal op basis van vorm + afmeting
- UI toont alleen: Pedestal, Fluted, Four Legs, Trestle (4 opties in plaats van 6)

---

### Stap 3: As-correctie voor pootplaatsing

In `resolveConfiguration.ts` de X/Z assen corrigeren zodat poten aan de uiteinden van de lengte-as staan:

- `computeDoublePedestalPlacement`: offset langs X-as (lengte) ipv Z
- `computeFourLegsPlacement`: X = lengte-offset, Z = breedte-offset
- `computeTrestlePlacement`: offset langs X-as (lengte) ipv Z
- Validatie-checks ook X/Z swappen

---

### Stap 4: UV-mapping fix voor Ellips en Ovale

Voor vormen die `ExtrudeGeometry` gebruiken (Ellips, Ovale):
- Na het aanmaken van de geometry, de UV-coordinaten handmatig overschrijven met planaire top-down projectie
- Formule: `u = vertex.x / lengthM + 0.5`, `v = vertex.y / widthM + 0.5`
- Dit zorgt dat de textuur als een plat vlak over het blad valt, zonder strepen

---

### Stap 5: Cut-corner geometrie toevoegen

Nieuwe geometrie voor de chamfered rectangle (cut-corner):
- Rechthoek met 45-graden afgeschuinde hoeken
- Chamfer-grootte proportioneel aan de kleinste zijde (bijv. 10% van de breedte)
- Zelfde planaire UV-mapping als de andere vormen

---

### Bestanden die wijzigen

1. **`src/lib/configurator/rules/productRules.ts`**
   - `RuleShape` type wijzigen naar 5 nieuwe vormen
   - `RuleLegStyle` vereenvoudigen (4 stijlen ipv 6)
   - `LEG_DEFINITIONS` updaten met auto-count logica
   - `SHAPE_DEFINITIONS` updaten naar nieuwe vormen
   - `isForbidden` en `getValidLegStyles` aanpassen

2. **`src/lib/configurator/engine/resolveConfiguration.ts`**
   - X/Z as-swap in alle placement functies
   - Nieuwe logica: `determineLegCount(shape, lengthMm)` functie
   - Placements aanpassen op basis van auto-count

3. **`src/components/configurator/TableMeshV3.tsx`**
   - `createTabletopGeometry`: cut-corner geometrie toevoegen
   - UV-fix voor ExtrudeGeometry vormen (planaire projectie)
   - Shape mapping updaten naar nieuwe namen

4. **`src/components/atelier/ConfiguratorPhase.tsx`**
   - `ShapeSelectorV3`: nieuwe vormen met correcte iconen
   - `DIM_PRESETS`: presets per nieuwe vorm
   - `LegSelectorV3`: 4 stijlen ipv 6
   - Default state aanpassen

5. **`src/components/configurator/ConfiguratorViewerV3.tsx`**
   - Shape type-referenties updaten

6. **`src/lib/configurator/types.ts`**
   - `TableShape` type is al correct (ellips, ovale, round, corner, cut-corner)
   - Geen wijzigingen nodig

