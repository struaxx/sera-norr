
# Sera Norr — 3D Animated Experience OS

A living design + engineering system, then applied end-to-end. Every animation earns its place by serving one of four intents: **reveal material truth, guide attention, reward exploration, or confirm action.** No motion for motion's sake.

## 1. Strategy document (committed as `docs/EXPERIENCE_OS.md`)

Single markdown deliverable, ~8 sections:

1. **Brand posture** — "quiet luxury, stone as protagonist". Refusals: Dubai gold, tech-startup gradients, purple, generic parallax.
2. **Information architecture** — refined nav order: *Atelier (configurator) · Collecties · Steensoorten · Verhaal · Contact*. Homepage becomes a 4-act scroll narrative: **Arrival → Material → Craft → Invitation**.
3. **Visual identity extensions** — locks the existing tokens (`#F5F1EA / #2A2620 / #A89878`, Cormorant + Jost) and adds: hairline rule tokens, editorial caption scale, warm-noise film-grain overlay (2% opacity), micro-label spec (11px / 0.15em tracking).
4. **3D interaction system** — one shared R3F canvas per route section, not per component. Documented "stages": Hero Stage (single hero object, slow orbit, cursor-parallax camera ±3°), Material Stage (slab wall, scroll-scrubbed camera dolly), Atelier Stage (existing configurator, upgraded).
5. **Animation language** — five named primitives, each with purpose:
   - `Rise` (12px + opacity, 600ms, ease-out) → **reveal** on section enter. Purpose: mimic a printed page being laid down.
   - `Settle` (scale 1.02 → 1, 400ms) → **confirm** on click/select. Purpose: physical "click into place" feedback.
   - `Drift` (slow y translate on scroll, parallax factor 0.15) → **guide** eye down the page.
   - `Hairline-draw` (SVG stroke 800ms) → **structure**, used under section labels. Purpose: hand-drawn measure line, atelier metaphor.
   - `Stone-turn` (R3F rotation on hover, damped) → **reward** curiosity on material thumbnails.
   Every primitive respects `prefers-reduced-motion` (collapse to opacity only).
6. **Responsive & performance** — R3F `dpr={[1,2]}`, `frameloop="demand"` outside configurator, single canvas per view, texture LODs already in `3d-assets.ts` reused. Mobile (<768px) drops the Material Stage scrub to a stepped fade. LCP protected: hero 3D lazy-mounts after first paint; poster still image serves as LCP.
7. **Accessibility** — motion primitives gated on `prefers-reduced-motion`, all 3D scenes have an equivalent still + alt-text summary, focus rings preserved on all pill controls, canvas is `aria-hidden` with a sibling text description.
8. **Roadmap** — the 4 phases below, each shippable independently.

## 2. Code implementation — 4 phases

### Phase 1 — Motion + 3D foundation
- Install `motion` (Motion for React) if not present; keep existing `@react-three/fiber@^8.18`, `@react-three/drei@^9.122`.
- New `src/lib/motion/primitives.ts` exporting `Rise`, `Settle`, `Drift`, `HairlineDraw`, `StoneTurn` as typed wrappers around Motion variants + a `useReducedMotion` guard.
- New `src/components/three/Stage.tsx` — reusable R3F canvas with shared lighting/env preset, `frameloop="demand"`, GPU-tier detection via existing `gpu-detection.ts` to downgrade to poster on low-end.
- Tailwind config: add `film-grain` bg utility, hairline border tokens.

### Phase 2 — Homepage as 4-act narrative (`src/pages/Index.tsx`)
- **Act 1 Arrival**: full-viewport Hero Stage — one slab of Calacatta Viola slowly rotating, cursor parallax on camera (±3°), Cormorant headline rising in with `Rise`. Purpose: establish material-first tone within 2 seconds.
- **Act 2 Material**: horizontal-scroll wall of 6 stones; scroll-scrubbed camera dolly along the wall (GSAP ScrollTrigger or Motion's `useScroll`). Each stone card uses `StoneTurn` on hover. Purpose: convey catalog breadth without a grid dump.
- **Act 3 Craft**: editorial split — left column atelier photograph with `Drift` parallax, right column typographic manifesto with staggered `Rise`. Hairline dividers `HairlineDraw` on view. Purpose: humanize the maker.
- **Act 4 Invitation**: dark surface band (`#2A2620`), single CTA into `/atelier`, `Settle` on hover. Purpose: single, confident conversion moment.

### Phase 3 — Materials & Collections upgrade
- `Materials.tsx`: grid becomes a masonry with `Rise` stagger on in-view. Each card opens a modal Stage showing the slab rotating in 3D with finish toggle (gepolijst/gezoet swaps roughness live). Purpose: let users *see* finish differences instead of reading them.
- `Collections.tsx` / `Lookbook`: keep current blur-up grid, add `Drift` on scroll and a subtle 1.5% film-grain overlay for editorial feel.

### Phase 4 — Configurator polish (`StoneConfigurator.tsx` + `ConfiguratorViewerV3`)
- Wrap pill selections in `Settle` (scale 1.02→1) so every choice feels physical.
- Add a soft camera ease when shape/dimensions change (lerp target over 600ms).
- Sticky right rail price block gains a `HairlineDraw` under "Indicatie".
- Reduced-motion path: swap camera lerps for instant cuts, disable auto-rotate.
- Keep existing Zustand store, rules, pricing engine untouched — presentation-only changes.

## Technical notes

- No new backend. No changes to Supabase, RLS, or edge functions.
- Reuse existing `configurator/3d-assets.ts` texture LODs for the homepage Material Stage — avoids doubling asset weight.
- Single shared R3F canvas per route; the homepage narrative uses `<View>` from drei to render multiple 3D "windows" from one canvas — this is the key perf move that keeps agency-grade motion feasible on mobile.
- GSAP is optional; Motion's `useScroll` + `useTransform` covers the scrub needs and avoids a second animation runtime.
- All color/shadow/radius values stay in `index.css` tokens per the strict `DESIGN_SYSTEM.md` — no hardcoded hex in components.

## Out of scope

- No new pages beyond a possible `/verhaal` if you want the manifesto standalone (ask before adding).
- No i18n copy changes beyond new section labels (NL + EN pairs added to existing locale files).
- No changes to pricing, rules engine, or the atelier flow logic.

## Deliverable order

1. `docs/EXPERIENCE_OS.md` (strategy doc, purpose-annotated).
2. Phase 1 foundation (motion primitives + shared Stage).
3. Phase 2 homepage narrative.
4. Phase 3 materials/collections.
5. Phase 4 configurator polish.

Each phase is a separate build turn so you can review and steer between them.
