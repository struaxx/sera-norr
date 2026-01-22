// ============================================
// 3D Asset Management System
// ============================================

import type { StoneType, FinishType, TableShape, BaseType, ProductType } from './types';

// ============================================
// Asset Path Structure
// ============================================

/**
 * Asset organization:
 * 
 * /public/3d/
 *   ├── models/
 *   │   ├── tables/
 *   │   │   ├── dining-table-rectangular.glb
 *   │   │   ├── dining-table-rectangular-lod1.glb
 *   │   │   ├── dining-table-rectangular-lod2.glb
 *   │   │   └── ...
 *   │   └── bases/
 *   │       ├── modern.glb
 *   │       ├── monolith.glb
 *   │       └── architectural.glb
 *   ├── textures/
 *   │   ├── stones/
 *   │   │   ├── travertine/
 *   │   │   │   ├── diffuse-2k.webp
 *   │   │   │   ├── diffuse-1k.webp
 *   │   │   │   ├── normal-2k.webp
 *   │   │   │   ├── normal-1k.webp
 *   │   │   │   └── roughness-2k.webp
 *   │   │   └── ...
 *   │   └── environments/
 *   │       ├── studio.hdr
 *   │       └── interior.hdr
 *   └── previews/
 *       ├── fallback/
 *       │   ├── dining-rectangular-travertine.webp
 *       │   └── ...
 *       └── thumbnails/
 *           └── ...
 */

// ============================================
// Types
// ============================================

export type TextureQuality = 'high' | 'medium' | 'low';
export type LODLevel = 0 | 1 | 2;

interface TextureSet {
  diffuse: string;
  normal: string;
  roughness: string;
  ao?: string;
}

interface ModelAsset {
  path: string;
  lod1?: string;
  lod2?: string;
}

// ============================================
// Asset Paths
// ============================================

const BASE_PATH = '/3d';

/**
 * Get texture paths for a stone type
 */
export function getStoneTextures(
  stone: StoneType, 
  quality: TextureQuality = 'high'
): TextureSet {
  const resolution = quality === 'high' ? '2k' : quality === 'medium' ? '1k' : '512';
  const basePath = `${BASE_PATH}/textures/stones/${stone}`;
  
  return {
    diffuse: `${basePath}/diffuse-${resolution}.webp`,
    normal: `${basePath}/normal-${resolution}.webp`,
    roughness: `${basePath}/roughness-${resolution}.webp`,
    ao: quality !== 'low' ? `${basePath}/ao-${resolution}.webp` : undefined,
  };
}

/**
 * Get model path for product/shape combination
 */
export function getTableModel(
  productType: ProductType, 
  shape: TableShape,
  lodLevel: LODLevel = 0
): string {
  const lodSuffix = lodLevel > 0 ? `-lod${lodLevel}` : '';
  return `${BASE_PATH}/models/tables/${productType}-${shape}${lodSuffix}.glb`;
}

/**
 * Get base model path
 */
export function getBaseModel(baseType: BaseType): string {
  return `${BASE_PATH}/models/bases/${baseType}.glb`;
}

/**
 * Get environment map path
 */
export function getEnvironmentMap(type: 'studio' | 'interior'): string {
  return `${BASE_PATH}/textures/environments/${type}.hdr`;
}

/**
 * Get static fallback preview image
 */
export function getFallbackPreview(
  productType: ProductType,
  shape: TableShape,
  stone: StoneType
): string {
  return `${BASE_PATH}/previews/fallback/${productType}-${shape}-${stone}.webp`;
}

// ============================================
// Asset Preloading
// ============================================

interface PreloadConfig {
  priority: 'high' | 'low';
  onProgress?: (progress: number) => void;
}

/**
 * Preload critical assets for initial view
 */
export async function preloadCriticalAssets(
  productType: ProductType,
  shape: TableShape,
  stone: StoneType,
  config?: PreloadConfig
): Promise<void> {
  const assets: string[] = [
    getTableModel(productType, shape),
    ...Object.values(getStoneTextures(stone, 'medium')).filter(Boolean) as string[],
  ];
  
  const total = assets.length;
  let loaded = 0;
  
  await Promise.all(
    assets.map(async (url) => {
      try {
        await fetch(url, { priority: config?.priority || 'auto' } as RequestInit);
        loaded++;
        config?.onProgress?.(loaded / total);
      } catch (e) {
        console.warn(`Failed to preload: ${url}`);
      }
    })
  );
}

/**
 * Preload LOD versions in background
 */
export function preloadLODInBackground(
  productType: ProductType,
  shape: TableShape
): void {
  // Use requestIdleCallback for non-blocking preload
  const callback = () => {
    const lod1 = getTableModel(productType, shape, 1);
    const lod2 = getTableModel(productType, shape, 2);
    
    // Low-priority fetch
    fetch(lod1, { priority: 'low' } as RequestInit).catch(() => {});
    fetch(lod2, { priority: 'low' } as RequestInit).catch(() => {});
  };
  
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1000);
  }
}

// ============================================
// Material Configuration
// ============================================

export interface MaterialConfig {
  color: string;
  roughness: number;
  metalness: number;
  normalScale: number;
  aoIntensity: number;
}

/**
 * Get material settings for stone + finish combination
 */
export function getMaterialConfig(
  stone: StoneType,
  finish: FinishType
): MaterialConfig {
  const stoneConfigs: Record<StoneType, Omit<MaterialConfig, 'roughness'> & { baseRoughness: number }> = {
    travertine: {
      color: '#E8DFD0',
      baseRoughness: 0.65,
      metalness: 0,
      normalScale: 1.2,
      aoIntensity: 0.8,
    },
    calacattaViola: {
      color: '#F5F0F5',
      baseRoughness: 0.35,
      metalness: 0.02,
      normalScale: 0.8,
      aoIntensity: 0.6,
    },
    verdeAlpi: {
      color: '#2D4A3E',
      baseRoughness: 0.4,
      metalness: 0.02,
      normalScale: 1.0,
      aoIntensity: 0.7,
    },
    neroMarquina: {
      color: '#1A1A1A',
      baseRoughness: 0.35,
      metalness: 0.03,
      normalScale: 0.9,
      aoIntensity: 0.5,
    },
    custom: {
      color: '#9CA3AF',
      baseRoughness: 0.5,
      metalness: 0,
      normalScale: 1.0,
      aoIntensity: 0.6,
    },
  };
  
  const finishMultipliers: Record<FinishType, number> = {
    polished: 0.4,
    honed: 0.7,
    matte: 1.1,
  };
  
  const stoneConfig = stoneConfigs[stone];
  const roughness = stoneConfig.baseRoughness * finishMultipliers[finish];
  
  return {
    color: stoneConfig.color,
    roughness: Math.max(0.1, Math.min(1, roughness)),
    metalness: stoneConfig.metalness,
    normalScale: stoneConfig.normalScale,
    aoIntensity: stoneConfig.aoIntensity,
  };
}
