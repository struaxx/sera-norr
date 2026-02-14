

## Nieuw Pootsysteem: 9 Specifieke Stijlen

### Wat er verandert

Het huidige systeem met 4 abstracte stijlen (pedestal, fluted, four_legs, trestle) wordt vervangen door 9 concrete pootvormen. Het systeem bepaalt automatisch het aantal poten -- de gebruiker kiest nooit "1 of 2".

### Nieuwe pootstructuur

**Categorie A -- Pedestal (automatisch 1 of 2)**

| Key | Naam NL | Beschrijving |
|-----|---------|-------------|
| cylindrical | Cilindrisch | Rechte kolom, gelijke radius |
| cylindrical_fluted | Gecanneleerd | 12-zijdige kolom |
| conical | Conisch | Taps toelopende kegel |
| hourglass | Zandloper | Dubbele kegel, smal in midden |

Beschikbaar voor: round, ellips, ovale. Niet voor corner/cut-corner.

Automatisch: round = 1, ellips/ovale < 2000mm = 1, ellips/ovale >= 2000mm = 2.

**Categorie B -- Vast aantal**

| Key | Naam NL | Aantal | Beschrijving |
|-----|---------|--------|-------------|
| quartet_legs | Quartet | 1 (centrale base) | Alleen voor round |
| v_legs | V-Poten | 2 | V-vormige staanders |
| d_legs | D-Poten | 2 | D-profiel staanders |
| rounded_legs | Afgerond | 4 | Cilinders met bol uiteinde |
| curved_legs | Gebogen | 4 | Licht gebogen poten |

v_legs, d_legs, rounded_legs, curved_legs: beschikbaar voor ellips, ovale, corner, cut-corner.
quartet_legs: alleen round.
rounded_legs, curved_legs: niet voor round.

### Harde regels

- LegCount is nooit een UI-keuze, alleen determineLegCount() bepaalt dit
- Corner/cut-corner mogen nooit pedestal-stijlen
- quartet_legs alleen voor round
- v_legs en d_legs altijd 2
- Bij maatwijziging auto-resolve naar geldige setup
- UI verbergt ongeldige opties

### Bestanden die wijzigen

**1. `src/lib/configurator/rules/productRules.ts`**
- RuleLegStyle type: 9 keys
- LEG_DEFINITIONS: 9 entries met compatibleShapes, priceUplift, category ('pedestal' of 'fixed'), fixedLegCount
- SHAPE_DEFINITIONS defaultLegStyle: round/ellips/ovale naar cylindrical, corner/cut-corner naar rounded_legs
- determineLegCount(): quartet=1, v/d=2, rounded/curved=4, pedestal-stijlen=auto 1/2
- getValidLegStyles() onveranderde logica

**2. `src/lib/configurator/engine/resolveConfiguration.ts`**
- Alle mappings naar nieuwe style keys
- computePlacements routing: legCount 4 naar four-legs, 2 naar two-legs (double pedestal), 1 naar single
- computeTwoLegsPlacement hernoemen/hergebruiken voor v_legs, d_legs, en double pedestal

**3. `src/components/configurator/TableMeshV3.tsx`**
- 9 leg geometry componenten:
  - CylindricalLeg: cilinder (gelijke radius boven/onder)
  - CylindricalFlutedLeg: 12-zijdige cilinder
  - ConicalLeg: kegel met taper ratio 0.65 (bestaand, hernoemd)
  - HourglassLeg: 2 kegels gespiegeld, middleRadius = baseRadius * 0.4
  - QuartetLeg: 1 centrale ronde base (schijf/drum)
  - VLeg: cilinder met 5-8 graden tilt naar buiten
  - DLeg: halve cilinder (180 graden segment), platte kant naar centrum
  - RoundedLeg: cilinder met bolvormig uiteinde
  - CurvedLeg: TubeGeometry via QuadraticBezierCurve3
- LegsGroup switch op 9 styles

**4. `src/components/atelier/ConfiguratorPhase.tsx`**
- LegSelectorV3: 2 groepen ("Pedestal" en "Vast")
- 9 knoppen met naam + prijsopslag
- Ongeldige opties verborgen
- Default legStyle: 'cylindrical' ipv 'pedestal'
- Reset knop: 'cylindrical' ipv 'pedestal'
- Fallback in handleShapeChange/handleDimensionSelect naar nieuwe keys

**5. `src/lib/configurator/leg-library.ts`**
- Updaten naar 9 nieuwe stijlen of markeren als deprecated (afhankelijk van gebruik elders)

