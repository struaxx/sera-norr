# Sera Norr — Experience OS

A design + engineering operating system for a premium, 3D-animated web experience. Every rule below serves one refusal and one intent: no motion for motion's sake — animation only when it **reveals material truth, guides attention, rewards exploration, or confirms action.**

---

## 1. Brand posture

Sera Norr is a digital atelier for natural stone. The site should feel like a gallery catalogue laid on linen — quiet, material-forward, confident. Stone is the protagonist; typography is the curator; motion is the light that reveals both.

**Refusals.** No Dubai gold on black, no purple/indigo gradients, no generic parallax hero videos, no tech-startup startup-y micro-bounces, no glassmorphism, no neon. If a competitor could ship it, we don't.

---

## 2. Information architecture

Primary nav (in order of intent, not alphabet):

1. **Atelier** — the 3D configurator. This is the product.
2. **Collecties** — realized projects (Herenhuis Amsterdam, Grachtenpand Utrecht).
3. **Steensoorten** — material library, with a 3D slab viewer per stone.
4. **Verhaal** — the atelier story and process.
5. **Contact** — human at the end of the tunnel.

**Homepage** is a four-act scroll narrative, not a marketing grid:

- **Act I — Arrival.** A single slab of Calacatta Viola, slowly rotating, on a warm-neutral stage. One headline. Purpose: establish material-first tone within two seconds.
- **Act II — Material.** Horizontal-scrubbed camera dolly along a wall of six stones. Purpose: convey catalog breadth without dumping a grid.
- **Act III — Craft.** Editorial split — atelier photograph with soft parallax + typographic manifesto with staggered reveal. Purpose: humanize the maker.
- **Act IV — Invitation.** Dark warm-black band, single CTA into `/atelier`. Purpose: one confident conversion moment.

---

## 3. Visual identity (locked)

Palette, per `DESIGN_SYSTEM.md`, is non-negotiable:

- Backgrounds: `#F5F1EA` linen, `#EBE5DB` deeper linen.
- Dark surface: `#2A2620` warm near-black (never `#000`).
- Text: `#1F1B16` / `#6B6358` soft taupe.
- Accent: `#A89878` muted warm stone (never bright gold).

Typography: **Cormorant Garamond** (display) + **Jost** (body/UI). Section labels are 11px / uppercase / `0.15em` tracking / soft taupe.

**Additions in this OS:**

- **Hairline system.** All structural rules `1px` at `foreground / 8%` opacity. Section labels are anchored between two hairlines that draw in via `HairlineDraw`.
- **Film grain.** Global 2% warm-noise overlay behind hero sections, mixed via `mix-blend-mode: overlay`. Purpose: paper texture, editorial feel, breaks the digital flatness.
- **Editorial captions.** Every image gets a two-line caption: 11px eyebrow + 14px muted description. Same rhythm as the print catalogue.

---

## 4. 3D interaction system

**One canvas per route section, not per component.** Multiple 3D "windows" render from a single Canvas using drei's `<View>` — this is the key perf move that keeps agency-grade motion feasible on mobile.

Documented stages:

- **Hero Stage** (Homepage Act I). Single slab, slow autorotation (0.5°/s), cursor-parallax camera at ±3°, warm apartment env preset, contact shadow. Poster JPEG serves as LCP; canvas mounts after first paint.
- **Material Stage** (Homepage Act II, `/steensoorten`). Wall of six slabs; camera dollies via `useScroll` scrub on desktop, stepped fade on mobile.
- **Atelier Stage** (`/atelier`). Existing `ConfiguratorViewerV3`, augmented with damped camera easing on shape/dimension change (600ms lerp).
- **Detail Stage** (Materials modal). Single slab rotating with finish toggle (gepolijst ↔ gezoet swaps roughness live). Purpose: let users *see* finish, not read it.

GPU fallback: existing `gpu-detection.ts` downgrades low-tier devices to a poster-only path. No blank canvas ever ships.

---

## 5. Animation language

Five named primitives. Each has a purpose. Everything else is out of scope.

| Primitive | Motion | Purpose | Where |
|---|---|---|---|
| `Rise` | y: 12→0, opacity: 0→1, 600ms `ease-out-quart` | **Reveal** — mimic a printed page being laid down | Section entries, headlines, cards on in-view |
| `Settle` | scale 1.02→1.00, 400ms `ease-out-cubic` | **Confirm** — physical click-into-place feedback | Pill selections, CTAs on tap, config choices |
| `Drift` | y translate on scroll, factor 0.15 | **Guide** — lead the eye down the page | Hero photographs, section imagery |
| `HairlineDraw` | SVG stroke-dashoffset, 800ms | **Structure** — hand-drawn measure line | Under section labels, above CTAs |
| `StoneTurn` | R3F Y-rotation, damped follow of cursor | **Reward** — repay curiosity with material | Stone cards on hover, material detail views |

**Reduced motion.** All five primitives check `prefers-reduced-motion`. When set, they collapse to opacity-only (`Rise`, `Drift`), or become instant (`Settle`, `HairlineDraw`, `StoneTurn` → static).

---

## 6. Responsive & performance

- R3F `dpr={[1, 2]}`, `frameloop="demand"` on all non-configurator scenes.
- One canvas per route section, `<View>` for multiple 3D viewports.
- Texture LODs reused from existing `configurator/3d-assets.ts` — no duplicate asset weight.
- Mobile (<768px): Material Stage scrub → stepped fade; Detail Stage modal disables autorotate.
- LCP protected: hero 3D lazy-mounts after `requestIdleCallback`; still image is the LCP element.
- Bundle: R3F/drei already loaded; no new heavy dependency. Motion for React reused (framer-motion `^11.18`).

---

## 7. Accessibility

- Every 3D scene has a sibling `<p>` describing what it shows; canvas gets `aria-hidden="true"`.
- Motion primitives respect `prefers-reduced-motion` at the source, not per component.
- All pill controls keep visible focus rings (`focus-visible:ring-1 ring-sera-surface ring-offset-2`).
- Tap targets ≥ 44×44 on mobile per shadcn Button defaults.
- Single `<main>` per route, in `Layout`.
- Color contrast: existing `#1F1B16` on `#F5F1EA` = AAA. All new decorative tokens stay above muted controls.

---

## 8. Implementation roadmap

Four phases, each independently shippable:

1. **Foundation.** Motion primitives (`src/lib/motion/primitives.ts`), shared `<Stage>` component (`src/components/three/Stage.tsx`), film-grain utility. *This phase.*
2. **Homepage narrative.** Rework `src/pages/Index.tsx` into the four-act scroll story with the Hero and Material stages.
3. **Materials & Collections upgrade.** Masonry + Detail Stage modals; Drift + grain on Collections.
4. **Configurator polish.** Wrap pill states in `Settle`, add camera easing to `ConfiguratorViewerV3`, HairlineDraw under the price indicator.

Each phase preserves the existing Zustand store, pricing engine, i18n, and Supabase integration. Presentation-only changes downstream of Phase 1.

---

*Every animation earns its place. Every 3D scene serves the stone. Everything else is noise.*