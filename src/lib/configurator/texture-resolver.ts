// ============================================
// Texture Resolver - Premium Stone Print System
// ============================================
// This module ensures that:
// - UI swatches use swatchImage (clean square stone samples)
// - 3D models use seamlessTexture (proper tileable textures for 3D)
// - Both are SEPARATE assets with correct visual identity

import { getStoneById } from './stone-library';

// ============================================
// SEAMLESS 3D TEXTURE MAPPING
// ============================================
// Maps stone IDs to their proper seamless 3D textures
// These are AI-generated premium textures, NOT PDF screenshots

const SEAMLESS_TEXTURES: Record<string, string> = {
  // ============================================
  // PRIORITY STONES - Premium Generated Textures
  // ============================================
  
  // Calacatta Viola - Deep burgundy/purple with dark veins on creamy white
  'calacatta-viola': '/textures/stones/calacatta-viola-seamless.jpg',
  
  // Ivory - Warm beige travertine with soft pores
  'ivory': '/textures/stones/ivory-seamless.jpg',
  
  // Nero Marquina - Deep black with crisp white veining
  'nero-marquina': '/textures/stones/nero-marquina-seamless.jpg',
  
  // Verde Alpi - Deep forest green with white veining
  'verde-alpi': '/textures/stones/verde-alpi-seamless.jpg',
  
  // Bianco Carrara - Classic white-grey with soft veining
  'bianco-carrara': '/textures/stones/bianco-carrara-seamless.jpg',
  
  // Tiramisu - Warm caramel/coffee travertine
  'tiramisu': '/textures/stones/tiramisu-seamless.jpg',
  
  // Cream - Light cream travertine
  'cream-travertine': '/textures/stones/cream-seamless.jpg',
  
  // Super White - Very light travertine
  'super-white-travertine': '/textures/stones/super-white-seamless.jpg',
  
  // ============================================
  // ADDITIONAL PRIORITY STONES
  // ============================================
  
  // Dark Emperador - Dark brown with cream veins
  'dark-emperador': '/textures/stones/dark-emperador-seamless.jpg',
  
  // Gore Gray - Cool sophisticated grey travertine
  'gore-gray': '/textures/stones/gore-gray-seamless.jpg',
  
  // Arabescato Corchia - Dramatic arabesque veining
  'arabescato-corchia': '/textures/stones/arabescato-corchia-seamless.jpg',
  
  // Calacatta Vagli - Bold golden veins
  'calacatta-vagli': '/textures/stones/calacatta-vagli-seamless.jpg',

  // ============================================
  // TRAVERTINE - Premium Generated Textures
  // ============================================
  'river-silver': '/textures/stones/river-silver-seamless.jpg',
  'brown-silver': '/textures/stones/brown-silver-seamless.jpg',
  'titanium-silver': '/textures/stones/titanium-silver-seamless.jpg',
  'sbyss-black': '/textures/stones/sbyss-black-seamless.jpg',
  'golden-coast': '/textures/stones/golden-coast-seamless.jpg',
  'classic-cloudy': '/textures/stones/classic-cloudy-seamless.jpg',
  'classic-light': '/textures/stones/classic-light-seamless.jpg',
  'soft-rome': '/textures/stones/soft-rome-seamless.jpg',
  'sivas-yellow': '/textures/stones/sivas-yellow-seamless.jpg',
  'swamp-brown': '/textures/stones/swamp-brown-seamless.jpg',
  'antique-red': '/textures/stones/antique-red-seamless.jpg',
  'leonardo-travertine': '/textures/stones/leonardo-seamless.jpg',
  
  // ============================================
  // MARBLE - Premium Generated Textures
  // ============================================
  'volakas-white': '/textures/stones/volakas-white-seamless.jpg',
  'super-white-marble': '/stones/marble/super-white-marble.jpg',
  'panda-white': '/textures/stones/panda-white-seamless.jpg',
  'star-white-marble': '/stones/marble/star-white.jpg',
  'wooden-white-marble': '/stones/marble/wooden-white.jpg',
  'arabescato-vagli': '/stones/marble/arabescato-vagli.jpg',
  'dark-arabescato-orobico': '/stones/marble/dark-arabescato-orobico.jpg',
  'arabella': '/stones/marble/arabella.jpg',
  'calacatta-rosa': '/textures/stones/calacatta-rosa-seamless.jpg',
  'calacatta-verde-monet': '/stones/marble/calacatta-verde-monet.jpg',
  'amazon-green-quartzite': '/stones/marble/amazon-green.jpg',
  'emerald-jade-marble': '/stones/marble/emerald-jade.jpg',
  'green-onyx': '/stones/marble/green-onyx.jpg',
  'light-emperador': '/textures/stones/light-emperador-seamless.jpg',
  'daino-reale': '/textures/stones/daino-reale-seamless.jpg',
  'moca-cream-limestone': '/textures/stones/moca-cream-seamless.jpg',
  'taj-mahal': '/textures/stones/taj-mahal-seamless.jpg',
  'elegant-grey': '/textures/stones/elegant-grey-seamless.jpg',
  'london-smoke': '/textures/stones/london-smoke-seamless.jpg',
  'black-marinaci': '/stones/marble/black-marinaci.jpg',
  'grand-antique': '/textures/stones/grand-antique-seamless.jpg',
  'calcite-blue': '/stones/marble/calcite-blue.jpg',
  'ivory-onyx': '/stones/marble/ivory-onyx.jpg',
  'rose-rainbow': '/stones/marble/rose-rainbow.jpg',
};

// Default placeholder texture for stones without seamless texture
const PLACEHOLDER_TEXTURE = '/textures/stones/cream-seamless.jpg';

// ============================================
// TEXTURE QUALITY VALIDATION
// ============================================
// Flags images that should NOT be used as 3D textures

const INVALID_3D_TEXTURE_PATTERNS = [
  'marble-grid-',     // PDF grid screenshots
  'marble-detail-',   // Detail shots that aren't tileable
  '-collage',         // Any collage images
  '-atlas',           // Atlas/sprite sheets
  '-lifestyle',       // Lifestyle/scene photos
];

function isValidSeamlessTexture(path: string): boolean {
  return !INVALID_3D_TEXTURE_PATTERNS.some(pattern => path.includes(pattern));
}

// ============================================
// TEXTURE SCALE CONFIGURATION
// ============================================
// Different stones may need different tiling scales

const TEXTURE_SCALES: Record<string, number> = {
  // Marbles with bold veining - larger scale to show pattern
  'calacatta-viola': 0.8,
  'calacatta-vagli': 0.8,
  'nero-marquina': 0.9,
  'verde-alpi': 0.9,
  'arabescato-corchia': 0.8,
  'panda-white': 0.8,
  'grand-antique': 0.8,
  'calacatta-rosa': 0.8,
  'london-smoke': 0.9,
  
  // Travertines - moderate scale for pore visibility
  'ivory': 0.6,
  'cream-travertine': 0.6,
  'tiramisu': 0.7,
  'gore-gray': 0.6,
  'super-white-travertine': 0.6,
  'river-silver': 0.6,
  'brown-silver': 0.6,
  'titanium-silver': 0.7,
  'sbyss-black': 0.7,
  'golden-coast': 0.6,
  'classic-cloudy': 0.6,
  'classic-light': 0.6,
  'soft-rome': 0.6,
  'sivas-yellow': 0.6,
  'swamp-brown': 0.6,
  'antique-red': 0.7,
  'leonardo-travertine': 0.6,
  
  // Other marbles - moderate scale
  'volakas-white': 0.7,
  'light-emperador': 0.7,
  'daino-reale': 0.7,
  'moca-cream-limestone': 0.6,
  'taj-mahal': 0.7,
  'elegant-grey': 0.7,
  
  // Default scale
  'default': 0.6,
};

// ============================================
// PUBLIC API
// ============================================

export interface TextureSet {
  swatchImage: string | null;      // For UI selector (clean square sample)
  seamlessTexture: string | null;  // For 3D model (tileable)
  isSeamlessValid: boolean;        // Whether texture is proper for 3D
  textureScale: number;            // UV repeat scale for this stone
}

/**
 * Get the correct textures for a stone
 * - swatchImage: for the selector UI (can be cropped sample)
 * - seamlessTexture: for the 3D model (must be tileable)
 */
export function getStoneTextures(stoneId: string): TextureSet {
  const stone = getStoneById(stoneId);
  
  if (!stone) {
    return {
      swatchImage: null,
      seamlessTexture: PLACEHOLDER_TEXTURE,
      isSeamlessValid: true,
      textureScale: TEXTURE_SCALES['default'],
    };
  }
  
  // Swatch uses the stone library's swatchImage
  const swatchImage = stone.swatchImage || null;
  
  // 3D texture uses our seamless texture map, or falls back to swatch
  const seamlessTexture = SEAMLESS_TEXTURES[stoneId] || stone.swatchImage || PLACEHOLDER_TEXTURE;
  
  // Validate the texture is proper for 3D
  const isSeamlessValid = seamlessTexture ? isValidSeamlessTexture(seamlessTexture) : false;
  
  // Get texture scale
  const textureScale = TEXTURE_SCALES[stoneId] || TEXTURE_SCALES['default'];
  
  return {
    swatchImage,
    seamlessTexture,
    isSeamlessValid,
    textureScale,
  };
}

/**
 * Get only the 3D seamless texture for a stone
 * Use this in the 3D viewer to get the correct texture path
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
 * Get the texture scale for a stone
 * Use this to configure UV repeat in 3D viewer
 */
export function getTextureScale(stoneId: string): number {
  return TEXTURE_SCALES[stoneId] || TEXTURE_SCALES['default'];
}

/**
 * Check if a stone has a premium generated texture
 */
export function hasPremiumTexture(stoneId: string): boolean {
  const texture = SEAMLESS_TEXTURES[stoneId];
  return texture?.startsWith('/textures/stones/') || false;
}

/**
 * Log texture mapping for QA debugging
 */
export function logTextureQA(stoneIds?: string[]): void {
  const ids = stoneIds || Object.keys(SEAMLESS_TEXTURES);
  
  console.log('=== PREMIUM STONE PRINT SYSTEM - QA LOG ===');
  console.log('Stone Name → Swatch URL → 3D Texture URL → Premium');
  console.log('');
  
  ids.forEach(id => {
    const stone = getStoneById(id);
    const textures = getStoneTextures(id);
    const isPremium = hasPremiumTexture(id);
    
    console.log(`${stone?.name || id}:`);
    console.log(`  Swatch: ${textures.swatchImage || 'NONE'}`);
    console.log(`  3D Texture: ${textures.seamlessTexture || 'NONE'}`);
    console.log(`  Premium: ${isPremium ? '✓' : '○'}`);
    console.log(`  Valid: ${textures.isSeamlessValid ? '✓' : '✗'}`);
    console.log(`  Scale: ${textures.textureScale}`);
    console.log('');
  });
}

// ============================================
// QA STONE LISTS
// ============================================

// Priority stones with premium generated textures
export const QA_PREMIUM_STONES = [
  'calacatta-viola',
  'ivory',
  'nero-marquina',
  'verde-alpi',
  'bianco-carrara',
  'tiramisu',
  'cream-travertine',
  'super-white-travertine',
  'dark-emperador',
  'gore-gray',
  'arabescato-corchia',
  'calacatta-vagli',
  // New travertines
  'river-silver',
  'brown-silver',
  'titanium-silver',
  'sbyss-black',
  'golden-coast',
  'classic-cloudy',
  'classic-light',
  'soft-rome',
  'sivas-yellow',
  'swamp-brown',
  'antique-red',
  'leonardo-travertine',
  // New marbles
  'volakas-white',
  'panda-white',
  'light-emperador',
  'taj-mahal',
  'elegant-grey',
  'london-smoke',
  'grand-antique',
  'calacatta-rosa',
  'moca-cream-limestone',
  'daino-reale',
];

// Original top 10 for backwards compatibility
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
