# Sera Norr Design System — STRICT

## Palette (only these colors allowed)

### Backgrounds
- Primary background:    #F5F1EA  (warm off-white / linen)
- Secondary background:  #EBE5DB  (slightly deeper warm neutral)
- Dark surface:          #2A2620  (warm near-black, NEVER pure #000)

### Text
- Primary text:          #1F1B16  (warm near-black)
- Secondary text:        #6B6358  (warm taupe)
- Inverted text:         #F5F1EA  (on dark surfaces)

### Accent (use sparingly, NOT for large fills)
- Stone accent:          #A89878  (muted warm stone, NEVER bright gold)
- Hover/active state:    #8D7E62

### FORBIDDEN
- ❌ Pure black (#000000)
- ❌ Pure white (#FFFFFF)
- ❌ Bright gold/yellow (#D4AF37, #C9A961, #E5B544, anything saturated yellow)
- ❌ Cool grays (#808080, #A0A0A0)
- ❌ Black backgrounds with gold accents (this is "Dubai luxury", not quiet luxury)
- ❌ Any color not listed above

## Typography
- Display/headings:  Existing serif (Cormorant or current serif) — keep
- Body:              Existing sans-serif — keep
- Hierarchy:         h1 > h2 > h3, never skip levels
- Section labels (TRANSPARANTIE, SERIE, STEEN, FORMAAT): uppercase, letter-spacing 0.15em, secondary text color, small size

## Components

### CTA buttons (primary)
- Background: #2A2620 (dark surface)
- Text:       #F5F1EA
- Hover:      #1F1B16
- NEVER use stone accent as a full-fill button background

### CTA buttons (secondary)
- Background: transparent
- Border:     1px solid #2A2620
- Text:       #2A2620

### Selection states (configurator chips/cards)
- Default:   border #6B6358 at 20% opacity, transparent bg
- Selected:  border #2A2620, bg #EBE5DB, NO bright fill
- The "Meest gekozen" badge: subtle, secondary text on transparent, NOT a gold fill block

### Cards / surfaces
- Border radius: 2px (not pill, not heavy round)
- Borders:       hairline, #6B6358 at 15% opacity
- Shadows:       none, OR very subtle (0 1px 2px rgba(31,27,22,0.04))

## Layout principles
- Generous whitespace between sections (min 80px on desktop, 48px on mobile)
- Configurator: keep the page background light (#F5F1EA), NOT dark
- The 3D viewer area: light neutral background, the table is the hero, no dramatic dark stage