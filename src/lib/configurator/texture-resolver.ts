// ============================================
// Texture Resolver - Unified Stone Texture System
// ============================================
// CRITICAL: Swatch and 3D MUST use the SAME texture for visual consistency
// This ensures what the customer sees in the selector matches the table render
// Just like the reference image: swatch = product texture = identical

import { getStoneById } from './stone-library';
import { DEFAULT_TEXTURE_PATH, STONE_TEXTURE_PATHS } from './texture-maps/stone-texture-paths';
import { DEFAULT_TEXTURE_SCALE, STONE_TEXTURE_SCALES } from './texture-maps/stone-texture-scales';

// ============================================
// UNIFIED TEXTURE MAPPING
// ============================================
// Single source of truth: ONE texture path per stone
// Used for BOTH the UI swatch AND the 3D model

// Single source of truth moved to ./texture-maps/*
const STONE_TEXTURES = STONE_TEXTURE_PATHS;

// Default fallback texture (seamless sample)
const DEFAULT_TEXTURE = DEFAULT_TEXTURE_PATH;

// ============================================
// TEXTURE SCALE CONFIGURATION
// ============================================
// Different stones may need different tiling scales for 3D

const TEXTURE_SCALES: Record<string, number> = {
  ...STONE_TEXTURE_SCALES,
  default: DEFAULT_TEXTURE_SCALE,
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
  
  // Get unified texture path - DO NOT fallback to stone-library.swatchImage
  // (it may contain lifestyle/catalog imagery).
  const texture = STONE_TEXTURES[stoneId] || DEFAULT_TEXTURE;
  const textureScale = TEXTURE_SCALES[stoneId] || TEXTURE_SCALES['default'];
  
  return {
    texture,
    swatchImage: texture,       // Same texture for swatch
    seamlessTexture: texture,   // Same texture for 3D
    isValid: stoneId in STONE_TEXTURES,
    textureScale,
  };
}

/**
 * Get the 3D texture for a stone
 * Returns the SAME texture as used in the swatch
 */
export function get3DTexture(stoneId: string): string {
  // Only curated mapping or a neutral fallback.
  return STONE_TEXTURES[stoneId] || DEFAULT_TEXTURE;
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
