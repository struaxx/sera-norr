

## Fix Calacatta Viola Texture and Table Proportions

### Problem 1: Calacatta Viola texture has bright purple veins
The current seamless texture at `/textures/stones/calacatta-viola-seamless.jpg` has unrealistic bright purple/magenta veins. Real Calacatta Viola has a warm white/cream base with deep aubergine, dark burgundy, and near-black veining -- NOT bright purple. This needs a new texture that matches the reference photo you provided.

**Fix**: Generate a new realistic Calacatta Viola seamless texture with:
- Warm white/cream base (not pure white)
- Deep aubergine/dark burgundy veining (almost black in some areas)
- Subtle grey undertones
- No bright/neon purple

### Problem 2: Tabletop proportions are wrong relative to legs
Looking at your reference photo vs the current render, the issues are:

**a) Leg radius is too large** -- The double pedestal legs (radiusMm: 140-220mm) are sized correctly for the real world, but the `chooseLegSizeVariant` function picks the largest variant that fits. For a 2200x1100mm oval, it picks 'L' (220mm radius), making legs 440mm diameter -- nearly half the table width. In the reference photo, the legs are proportionally much thinner relative to the tabletop.

**Fix**: Reduce the double_pedestal size variants:
- S: 120mm radius (was 140)
- M: 150mm radius (was 180)
- L: 180mm radius (was 220)

**b) Tabletop thickness appears too thick visually** -- At 20mm real-world thickness, the tabletop should look like a thin elegant slab. The 3D rendering may be making it look proportionally thicker than it should.

**c) Cone taper ratio may need tuning** -- Currently `CONE_TAPER_RATIO = 0.55` (top is 55% of bottom). The reference photo shows a more subtle taper, closer to 0.65-0.70.

### Files to change

1. **`/textures/stones/calacatta-viola-seamless.jpg`** -- Replace with realistic texture (deep aubergine veining, not purple)
2. **`/public/stones/marble/calacatta-viola.jpg`** -- Also replace swatch to match
3. **`src/lib/configurator/rules/productRules.ts`** -- Reduce double_pedestal radius sizes
4. **`src/components/configurator/TableMeshV3.tsx`** -- Adjust `CONE_TAPER_RATIO` from 0.55 to ~0.65 for more realistic taper

### Technical details

```text
productRules.ts changes:
  double_pedestal sizeVariants:
    S: radiusMm 140 -> 120
    M: radiusMm 180 -> 150  
    L: radiusMm 220 -> 180

TableMeshV3.tsx changes:
  CONE_TAPER_RATIO: 0.55 -> 0.65
```

The combination of smaller leg radii and gentler taper will produce a table that looks much closer to the reference photo -- an elegant thin slab sitting on two proportional tapered cone pedestals.

