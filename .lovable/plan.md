

# Fix Hourglass: Render GLB as Single Centered Unit

## Problem
The uploaded GLB (`hourglass-leg-single.glb`) contains the **complete table** (3 legs + top as one model). The current code tries to extract one mesh and place it at each leg position from the rules engine, resulting in duplicated legs (2 placements x 2 visible legs in the mesh = 4 legs).

## Solution
Render the entire GLB scene **once**, centered at the origin, scaled to match the configured table dimensions. When hourglass is selected, skip the standard leg placement system and procedural tabletop entirely.

## Technical Details

### File: `src/components/configurator/TableMeshV3.tsx`

1. **Replace `HourglassLeg` with `HourglassFullTable`**
   - Load the GLB with `useGLTF`
   - Clone the entire scene
   - Compute bounding box of the full model
   - Scale uniformly based on height (`heightM / modelHeight`) to keep proportions round
   - Position at origin (0, 0, 0) so it sits on the ground plane
   - Apply `MonolithMaterial` to all meshes via `traverse`

2. **Update `TableMeshV3` main component**
   - Detect `isHourglass = resolved.legStyle === 'hourglass'`
   - When hourglass: render only `<GroundPlane />` + `<HourglassFullTable />` (no `LegsGroup`, no procedural tabletop)
   - When not hourglass: render standard legs + tabletop as before

3. **Key difference from previous attempt**
   - Use **uniform scaling** only (no stretch on X/Z) to prevent oval distortion
   - The GLB already has the correct proportions; just scale it to the right height
   - No separate tabletop needed since the GLB includes it

