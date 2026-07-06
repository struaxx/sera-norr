

## Probleem

De 3D-viewer heeft `sticky top-24`, maar het sticky blok bevat ook de selectie-samenvatting, CTA-knop en garantie-badges. Dat maakt het geheel te hoog voor het scherm — waardoor het sticky-effect niet werkt en de viewer uit beeld verdwijnt bij scrollen.

## Oplossing

De 3D-viewer loskoppelen van de samenvatting zodat alleen de viewer sticky is, en de samenvatting + CTA eronder valt (buiten het sticky blok).

### Stappen

1. **Split het sticky blok** in `ConfiguratorPhase.tsx`:
   - Wrap alleen de `ConfiguratorViewerV3` in een `sticky top-24` container
   - Verplaats de selectie-samenvatting, CTA-knop en trust-badges naar een apart, niet-sticky blok eronder

2. **Viewer compacter op desktop**: De viewer krijgt `aspect-[4/3]` op desktop zodat hij altijd in het zichtbare deel van het scherm past (met ruimte voor de header).

3. **Mobiel**: Op mobiel (`< lg`) is sticky niet actief — daar scrollt alles normaal, wat logisch is op kleine schermen.

### Technisch detail

```text
Huidige structuur:
┌─────────────────────┐  ┌──────────────┐
│  sticky top-24       │  │ Config panels│
│  ┌─────────────────┐ │  │              │
│  │ 3D Viewer       │ │  │ Vorm         │
│  └─────────────────┘ │  │ Afmeting     │
│  ┌─────────────────┐ │  │ Bladdikte    │
│  │ Uw selectie     │ │  │ Onderstel    │
│  │ CTA knop        │ │  │ Steen        │
│  │ Trust badges    │ │  │ Rand         │
│  └─────────────────┘ │  └──────────────┘
└─────────────────────┘

Nieuwe structuur:
┌─────────────────────┐  ┌──────────────┐
│  sticky top-24       │  │ Config panels│
│  ┌─────────────────┐ │  │              │
│  │ 3D Viewer       │ │  │ Vorm         │
│  └─────────────────┘ │  │ Afmeting     │
└─────────────────────┘  │ Bladdikte    │
┌─────────────────────┐  │ Onderstel    │
│  Uw selectie        │  │ Steen        │
│  CTA knop           │  │ Rand         │
│  Trust badges       │  └──────────────┘
└─────────────────────┘
```

**Alleen 1 bestand wijzigt:** `src/components/atelier/ConfiguratorPhase.tsx`

