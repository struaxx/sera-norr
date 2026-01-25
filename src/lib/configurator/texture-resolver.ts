// ============================================
// Texture Resolver - Separates Swatch vs 3D Textures
// ============================================
// This module ensures that:
// - UI swatches use swatchImage (can be cropped PDF samples)
// - 3D models use seamlessTexture (must be tileable, no collages)

import { getStoneById } from './stone-library';

// ============================================
// SEAMLESS TEXTURE MAPPING
// ============================================
// Maps stone IDs to their seamless 3D textures
// These are separate from swatch images for quality control

const SEAMLESS_TEXTURES: Record<string, string> = {
  // Top 10 Priority Stones - Verified seamless textures
  'ivory': '/stones/travertine/ivory.jpg',
  'super-white-travertine': '/stones/travertine/super-white.jpg',
  'cream-travertine': '/stones/travertine/cream.jpg',
  'tiramisu': '/stones/travertine/tiramisu.jpg',
  'gore-gray': '/stones/travertine/gore-gray.jpg',
  'calacatta-viola': '/stones/marble/calacatta-viola.jpg',
  'nero-marquina': '/stones/marble/black-marinaci.jpg', // Using black marinaci as nero
  'verde-alpi': '/stones/marble/verde-alpi.jpg',
  'bianco-carrara': '/stones/marble/bianco-carrara.jpg',
  'dark-emperador': '/stones/marble/dark-emperador.jpg',
  
  // Additional Travertine
  'river-silver': '/stones/travertine/river-silver.jpg',
  'brown-silver': '/stones/travertine/brown-silver.jpg',
  'titanium-silver': '/stones/travertine/titanium-silver.jpg',
  'sbyss-black': '/stones/travertine/sbyss-black.jpg',
  'golden-coast': '/stones/travertine/golden-coast.jpg',
  'classic-cloudy': '/stones/travertine/classic-cloudy.jpg',
  'classic-light': '/stones/travertine/classic-light.jpg',
  'soft-rome': '/stones/travertine/soft-rome.jpg',
  'sivas-yellow': '/stones/travertine/sivas-yellow.jpg',
  'swamp-brown': '/stones/travertine/swamp-brown.jpg',
  'antique-red': '/stones/travertine/antique-red.jpg',
  'leonardo-travertine': '/stones/travertine/leonardo.jpg',
  
  // Marble - White/Light
  'calacatta-vagli': '/stones/marble/calacatta-vagli.jpg',
  'volakas-white': '/stones/marble/volakas-white.jpg',
  'super-white-marble': '/stones/marble/super-white-marble.jpg',
  'panda-white': '/stones/marble/panda-white.jpg',
  'star-white-marble': '/stones/marble/star-white.jpg',
  'wooden-white-marble': '/stones/marble/wooden-white.jpg',
  
  // Marble - Arabescato
  'arabescato-corchia': '/stones/marble/arabescato-corchia.jpg',
  'arabescato-vagli': '/stones/marble/arabescato-vagli.jpg',
  'dark-arabescato-orobico': '/stones/marble/dark-arabescato-orobico.jpg',
  'arabella': '/stones/marble/arabella.jpg',
  
  // Marble - Calacatta
  'calacatta-rosa': '/stones/marble/calacatta-rosa.jpg',
  'calacatta-verde-monet': '/stones/marble/calacatta-verde-monet.jpg',
  
  // Marble - Green
  'amazon-green-quartzite': '/stones/marble/amazon-green.jpg',
  'emerald-jade-marble': '/stones/marble/emerald-jade.jpg',
  'green-onyx': '/stones/marble/green-onyx.jpg',
  
  // Marble - Brown/Beige
  'light-emperador': '/stones/marble/light-emperador.jpg',
  'daino-reale': '/stones/marble/daino-reale.jpg',
  'moca-cream-limestone': '/stones/marble/moca-cream.jpg',
  'taj-mahal': '/stones/marble/taj-mahal.jpg',
  
  // Marble - Grey
  'elegant-grey': '/stones/marble/elegant-grey.jpg',
  'london-smoke': '/stones/marble/london-smoke.jpg',
  
  // Marble - Dark/Black
  'black-marinaci': '/stones/marble/black-marinaci.jpg',
  'grand-antique': '/stones/marble/grand-antique.jpg',
  
  // Marble - Blue
  'calcite-blue': '/stones/marble/calcite-blue.jpg',
  
  // Marble - Onyx
  'ivory-onyx': '/stones/marble/ivory-onyx.jpg',
  
  // Marble - Rose
  'rose-rainbow': '/stones/marble/rose-rainbow.jpg',
};

// Placeholder texture for stones without seamless texture
const PLACEHOLDER_TEXTURE = '/stones/travertine/cream.jpg';

// ============================================
// TEXTURE QUALITY CHECK
// ============================================
// Flags images that should NOT be used as 3D textures

const INVALID_3D_TEXTURES = [
  'marble-grid-', // PDF grid screenshots
  'marble-detail-', // Detail shots that aren't tileable
  // Add more patterns as needed
];

function isValidSeamlessTexture(path: string): boolean {
  return !INVALID_3D_TEXTURES.some(pattern => path.includes(pattern));
}

// ============================================
// PUBLIC API
// ============================================

export interface TextureSet {
  swatchImage: string | null; // For UI selector
  seamlessTexture: string | null; // For 3D model
  isSeamlessValid: boolean;
}

/**
 * Get the correct textures for a stone
 * - swatchImage: for the selector UI (can be cropped PDF)
 * - seamlessTexture: for the 3D model (must be tileable)
 */
export function getStoneTextures(stoneId: string): TextureSet {
  const stone = getStoneById(stoneId);
  
  if (!stone) {
    return {
      swatchImage: null,
      seamlessTexture: null,
      isSeamlessValid: false,
    };
  }
  
  const swatchImage = stone.swatchImage || null;
  const seamlessTexture = SEAMLESS_TEXTURES[stoneId] || stone.swatchImage || PLACEHOLDER_TEXTURE;
  
  return {
    swatchImage,
    seamlessTexture,
    isSeamlessValid: seamlessTexture ? isValidSeamlessTexture(seamlessTexture) : false,
  };
}

/**
 * Get only the 3D seamless texture for a stone
 * Use this in the 3D viewer to avoid loading collages/grids
 */
export function get3DTexture(stoneId: string): string {
  const textures = getStoneTextures(stoneId);
  
  // If the seamless texture is invalid, use placeholder
  if (!textures.isSeamlessValid && textures.seamlessTexture) {
    console.warn(`[Material QA] Invalid 3D texture for ${stoneId}, using placeholder`);
    return PLACEHOLDER_TEXTURE;
  }
  
  return textures.seamlessTexture || PLACEHOLDER_TEXTURE;
}

/**
 * Log texture mapping for QA debugging
 * Call this in development to verify correct mappings
 */
export function logTextureQA(stoneIds?: string[]): void {
  const ids = stoneIds || Object.keys(SEAMLESS_TEXTURES);
  
  console.log('=== MATERIAL QA LOG ===');
  console.log('Stone Name → Swatch URL → 3D Texture URL');
  console.log('');
  
  ids.forEach(id => {
    const stone = getStoneById(id);
    const textures = getStoneTextures(id);
    
    console.log(`${stone?.name || id}:`);
    console.log(`  Swatch: ${textures.swatchImage || 'NONE'}`);
    console.log(`  3D Texture: ${textures.seamlessTexture || 'NONE'}`);
    console.log(`  Valid: ${textures.isSeamlessValid ? '✓' : '✗'}`);
    console.log('');
  });
}

// Export for QA mode
export const QA_TOP_10_STONES = [
  'ivory',
  'super-white-travertine', 
  'cream-travertine',
  'tiramisu',
  'calacatta-viola',
  'nero-marquina',
  'verde-alpi',
  'bianco-carrara',
  'dark-emperador',
  'gore-gray',
];
