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
  // TRAVERTINE - High-resolution seamless textures
  // ============================================
  'gore-gray': '/stones/travertine/gore-gray.jpg',
  'ivory': '/stones/travertine/ivory.jpg',
  'super-white-travertine': '/stones/travertine/super-white.jpg',
  'cream-travertine': '/stones/travertine/cream.jpg',
  'light-cream-travertine': '/stones/travertine/cream.jpg',
  'cream-beige-travertine': '/stones/travertine/classic-light.jpg',
  'river-silver': '/stones/travertine/river-silver.jpg',
  'silver-grey-travertine': '/stones/travertine/river-silver.jpg',
  'brown-silver': '/stones/travertine/brown-silver.jpg',
  'titanium-silver': '/stones/travertine/titanium-silver.jpg',
  'sbyss-black': '/stones/travertine/sbyss-black.jpg',
  'golden-coast': '/stones/travertine/golden-coast.jpg',
  'classic-cloudy': '/stones/travertine/classic-cloudy.jpg',
  'classic-light': '/stones/travertine/classic-light.jpg',
  'soft-rome': '/stones/travertine/soft-rome.jpg',
  'novona-travertine': '/stones/travertine/soft-rome.jpg',
  'sivas-yellow': '/stones/travertine/sivas-yellow.jpg',
  'tiramisu': '/stones/travertine/tiramisu.jpg',
  'swamp-brown': '/stones/travertine/swamp-brown.jpg',
  'jurassico-scurro-travertine': '/stones/travertine/swamp-brown.jpg',
  'antique-red': '/stones/travertine/antique-red.jpg',
  'leonardo-travertine': '/stones/travertine/leonardo.jpg',
  
  // ============================================
  // MARBLE - White/Light varieties
  // ============================================
  'calacatta-vagli': '/stones/marble/calacatta-vagli.jpg',
  'bianco-carrara': '/stones/marble/bianco-carrara.jpg',
  'volakas-white': '/stones/marble/volakas-white.jpg',
  'super-white-marble': '/stones/marble/super-white-marble.jpg',
  'panda-white': '/stones/marble/panda-white.jpg',
  'star-white-marble': '/stones/marble/star-white.jpg',
  'wooden-white-marble': '/stones/marble/wooden-white.jpg',
  
  // Arabescato family
  'arabescato-corchia': '/stones/marble/arabescato-corchia.jpg',
  'arabescato-vagli': '/stones/marble/arabescato-vagli.jpg',
  'dark-arabescato-orobico': '/stones/marble/dark-arabescato-orobico.jpg',
  'arabella': '/stones/marble/arabella.jpg',
  
  // Calacatta family
  'calacatta-viola': '/stones/marble/calacatta-viola.jpg',
  'calacatta-rosa': '/stones/marble/calacatta-rosa.jpg',
  'calacatta-verde-monet': '/stones/marble/calacatta-verde-monet.jpg',
  
  // Green marbles & quartzites
  'verde-alpi': '/stones/marble/verde-alpi.jpg',
  'verde-affai': '/stones/marble/verde-alpi.jpg',
  'amazon-green-quartzite': '/stones/marble/amazon-green.jpg',
  'roval-green-quartzite': '/stones/marble/amazon-green.jpg',
  'maestro-green-quartzite': '/stones/marble/verde-alpi.jpg',
  'avocado-quartzite': '/stones/marble/amazon-green.jpg',
  'emerald-jade-marble': '/stones/marble/emerald-jade.jpg',
  'jade-river': '/stones/marble/emerald-jade.jpg',
  'green-onyx': '/stones/marble/green-onyx.jpg',
  'ceppo-verde': '/stones/marble/verde-alpi.jpg',
  'taj-royal-jade-quartzite': '/stones/marble/emerald-jade.jpg',
  
  // White quartzites
  'mont-blanc-quartzite': '/stones/marble/super-white-marble.jpg',
  'infinity-white-quartzite': '/stones/marble/star-white.jpg',
  'alabastro-white-quartzite': '/stones/marble/star-white.jpg',
  'taj-mahal-quartzite': '/stones/marble/taj-mahal.jpg',
  'taj-mahal': '/stones/marble/taj-mahal.jpg',
  'alpine-quartzite': '/stones/marble/volakas-white.jpg',
  'patagonia-quartzite': '/stones/marble/volakas-white.jpg',
  'votoria-regina-quartzite': '/stones/marble/elegant-grey.jpg',
  
  // Pink/Rose marbles
  'rose-rainbow': '/stones/marble/rose-rainbow.jpg',
  'pink-crystal-quartzite': '/stones/marble/rose-rainbow.jpg',
  'rosette': '/stones/marble/calacatta-rosa.jpg',
  'ceppo-breccia-rosa': '/stones/marble/rose-rainbow.jpg',
  'ceppo-rosso': '/stones/marble/rose-rainbow.jpg',
  'rosso-trentino': '/stones/marble/rose-rainbow.jpg',
  'levanto-rosso': '/stones/marble/dark-emperador.jpg',
  
  // Blue marbles
  'calcite-blue': '/stones/marble/calcite-blue.jpg',
  
  // Brown/Emperador marbles
  'light-emprador': '/stones/marble/light-emperador.jpg',
  'light-emperador': '/stones/marble/light-emperador.jpg',
  'dark-emperador': '/stones/marble/dark-emperador.jpg',
  'daino-reale': '/stones/marble/daino-reale.jpg',
  'eurasian-wood-marble': '/stones/marble/wooden-white.jpg',
  'ancient-wood': '/stones/marble/wooden-white.jpg',
  
  // Grey marbles
  'elegant-grey': '/stones/marble/elegant-grey.jpg',
  'london-smoke': '/stones/marble/london-smoke.jpg',
  'carpathian': '/stones/marble/london-smoke.jpg',
  
  // Black marbles
  'nero-marquina': '/stones/marble/nero-marquina.jpg',
  'grand-antique': '/stones/marble/grand-antique.jpg',
  'black-marinaci': '/stones/marble/black-marinaci.jpg',
  
  // Breccia/Conglomerate
  'breccia-cascade': '/stones/marble/daino-reale.jpg',
  'breccia-deggito': '/stones/marble/daino-reale.jpg',
  'ceppo-bianco': '/stones/marble/star-white.jpg',
  'montage-quartzite': '/stones/marble/elegant-grey.jpg',
  'opera-darte': '/stones/marble/daino-reale.jpg',
  
  // Onyx
  'ivory-onyx': '/stones/marble/ivory-onyx.jpg',
  'alba-pura-white-onyx': '/stones/marble/ivory-onyx.jpg',
  
  // Limestone
  'moca-cream-limestone': '/stones/marble/moca-cream.jpg',
  'lloret': '/stones/marble/moca-cream.jpg',
  'leonardo': '/stones/marble/arabella.jpg',
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
  'black-marinaci': 0.8,
  'calacatta-verde-monet': 0.8,
  'emerald-jade-marble': 0.9,
  'green-onyx': 0.9,
  'amazon-green-quartzite': 0.9,
  
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
  'rose-rainbow': 0.7,
  'calcite-blue': 0.8,
  'ivory-onyx': 0.7,
  
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
  
  // Get unified texture path - prefer our mapping, fallback to stone library
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
