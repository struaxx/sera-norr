// ============================================
// Texture Resolver - Unified Stone Texture System
// ============================================
// CRITICAL: Swatch and 3D MUST use the SAME texture for visual consistency
// This ensures what the customer sees in the selector matches the table render
// Just like the reference image: swatch = product texture = identical

import { getStoneById } from './stone-library';

// ============================================
// UNIFIED TEXTURE MAPPING
// ============================================
// Single source of truth: ONE texture path per stone
// Used for BOTH the UI swatch AND the 3D model

const STONE_TEXTURES: Record<string, string> = {
  // ============================================
  // TRAVERTINE - Using actual stone photos
  // ============================================
  'gore-gray': '/stones/travertine/gore-gray.jpg',
  'ivory': '/stones/travertine/ivory.jpg',
  'super-white-travertine': '/stones/travertine/super-white.jpg',
  'cream-travertine': '/stones/travertine/cream.jpg',
  'river-silver': '/stones/travertine/river-silver.jpg',
  'brown-silver': '/stones/travertine/brown-silver.jpg',
  'titanium-silver': '/stones/travertine/titanium-silver.jpg',
  'sbyss-black': '/stones/travertine/sbyss-black.jpg',
  'golden-coast': '/stones/travertine/golden-coast.jpg',
  'classic-cloudy': '/stones/travertine/classic-cloudy.jpg',
  'classic-light': '/stones/travertine/classic-light.jpg',
  'soft-rome': '/stones/travertine/soft-rome.jpg',
  'sivas-yellow': '/stones/travertine/sivas-yellow.jpg',
  'tiramisu': '/stones/travertine/tiramisu.jpg',
  'swamp-brown': '/stones/travertine/swamp-brown.jpg',
  'antique-red': '/stones/travertine/antique-red.jpg',
  'leonardo-travertine': '/stones/travertine/leonardo.jpg',
  
  // ============================================
  // MARBLE - Using actual stone photos
  // ============================================
  'calacatta-vagli': '/stones/marble/calacatta-vagli.jpg',
  'bianco-carrara': '/stones/marble/bianco-carrara.jpg',
  'volakas-white': '/stones/marble/volakas-white.jpg',
  'super-white-marble': '/stones/marble/super-white-marble.jpg',
  'panda-white': '/stones/marble/panda-white.jpg',
  'star-white-marble': '/stones/marble/star-white.jpg',
  'wooden-white-marble': '/stones/marble/wooden-white.jpg',
  'arabescato-corchia': '/stones/marble/arabescato-corchia.jpg',
  'arabescato-vagli': '/stones/marble/arabescato-vagli.jpg',
  'dark-arabescato-orobico': '/stones/marble/dark-arabescato-orobico.jpg',
  'arabella': '/stones/marble/arabella.jpg',
  'calacatta-viola': '/stones/marble/calacatta-viola.jpg',
  'calacatta-rosa': '/stones/marble/calacatta-rosa.jpg',
  'calacatta-verde-monet': '/stones/marble/calacatta-verde-monet.jpg',
  'verde-alpi': '/stones/marble/verde-alpi.jpg',
  'amazon-green-quartzite': '/stones/marble/amazon-green.jpg',
  'emerald-jade-marble': '/stones/marble/emerald-jade.jpg',
  'green-onyx': '/stones/marble/green-onyx.jpg',
  'nero-marquina': '/stones/marble/black-marinaci.jpg',
  'light-emperador': '/stones/marble/light-emperador.jpg',
  'dark-emperador': '/stones/marble/dark-emperador.jpg',
  'daino-reale': '/stones/marble/daino-reale.jpg',
  'moca-cream-limestone': '/stones/marble/moca-cream.jpg',
  'taj-mahal': '/stones/marble/taj-mahal.jpg',
  'elegant-grey': '/stones/marble/elegant-grey.jpg',
  'london-smoke': '/stones/marble/london-smoke.jpg',
  'black-marinaci': '/stones/marble/black-marinaci.jpg',
  'grand-antique': '/stones/marble/grand-antique.jpg',
  'calcite-blue': '/stones/marble/calcite-blue.jpg',
  'ivory-onyx': '/stones/marble/ivory-onyx.jpg',
  'rose-rainbow': '/stones/marble/rose-rainbow.jpg',
};

// Default fallback texture
const DEFAULT_TEXTURE = '/stones/travertine/cream.jpg';

// ============================================
// TEXTURE SCALE CONFIGURATION
// ============================================
// Different stones may need different tiling scales for 3D

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
  'dark-arabescato-orobico': 0.8,
  
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
  'dark-emperador': 0.7,
  'daino-reale': 0.7,
  'moca-cream-limestone': 0.6,
  'taj-mahal': 0.7,
  'elegant-grey': 0.7,
  'bianco-carrara': 0.7,
  
  // Default scale
  'default': 0.6,
};

// ============================================
// PUBLIC API
// ============================================

export interface TextureSet {
  /** Single texture path used for BOTH swatch and 3D */
  texture: string;
  /** Legacy: same as texture for backwards compatibility */
  swatchImage: string;
  /** Legacy: same as texture for backwards compatibility */
  seamlessTexture: string;
  /** Whether texture file exists */
  isValid: boolean;
  /** UV repeat scale for this stone */
  textureScale: number;
}

/**
 * Get the unified texture for a stone
 * The SAME texture is used for swatch AND 3D rendering
 */
export function getStoneTextures(stoneId: string): TextureSet {
  const stone = getStoneById(stoneId);
  
  // Get unified texture path
  const texture = STONE_TEXTURES[stoneId] || stone?.swatchImage || DEFAULT_TEXTURE;
  const textureScale = TEXTURE_SCALES[stoneId] || TEXTURE_SCALES['default'];
  
  return {
    texture,
    swatchImage: texture,       // Same texture for swatch
    seamlessTexture: texture,   // Same texture for 3D
    isValid: true,
    textureScale,
  };
}

/**
 * Get the 3D texture for a stone
 * Returns the SAME texture as used in the swatch
 */
export function get3DTexture(stoneId: string): string {
  return STONE_TEXTURES[stoneId] || getStoneById(stoneId)?.swatchImage || DEFAULT_TEXTURE;
}

/**
 * Get the swatch texture for a stone
 * Returns the SAME texture as used in 3D
 */
export function getSwatchTexture(stoneId: string): string {
  return get3DTexture(stoneId);
}

/**
 * Get the texture scale for a stone
 * Use this to configure UV repeat in 3D viewer
 */
export function getTextureScale(stoneId: string): number {
  return TEXTURE_SCALES[stoneId] || TEXTURE_SCALES['default'];
}

/**
 * Check if a stone has a mapped texture
 */
export function hasTexture(stoneId: string): boolean {
  return stoneId in STONE_TEXTURES;
}

// Legacy export for backwards compatibility
export function hasPremiumTexture(stoneId: string): boolean {
  return hasTexture(stoneId);
}

/**
 * Log texture mapping for QA debugging
 */
export function logTextureQA(stoneIds?: string[]): void {
  const ids = stoneIds || Object.keys(STONE_TEXTURES);
  
  console.log('=== UNIFIED TEXTURE SYSTEM - QA LOG ===');
  console.log('Stone Name → Texture URL (swatch = 3D)');
  console.log('');
  
  ids.forEach(id => {
    const stone = getStoneById(id);
    const texture = get3DTexture(id);
    const scale = getTextureScale(id);
    
    console.log(`${stone?.name || id}:`);
    console.log(`  Texture: ${texture}`);
    console.log(`  Scale: ${scale}`);
    console.log('');
  });
}

// ============================================
// QA STONE LISTS
// ============================================

export const QA_PREMIUM_STONES = Object.keys(STONE_TEXTURES);

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
