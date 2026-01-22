// ============================================
// GPU Detection & Performance Tier System
// ============================================

export type PerformanceTier = 'high' | 'medium' | 'low' | 'fallback';

interface GPUInfo {
  vendor: string;
  renderer: string;
  tier: PerformanceTier;
  supportsWebGL2: boolean;
  maxTextureSize: number;
  isMobile: boolean;
}

// Low-tier GPU patterns (integrated, older, mobile)
const LOW_TIER_PATTERNS = [
  /intel.*hd/i,
  /intel.*uhd/i,
  /intel.*iris/i,
  /adreno.*[123]/i,
  /mali-[gt]/i,
  /powervr/i,
  /apple.*a[89]x?/i,
  /swiftshader/i,
];

// Medium-tier GPU patterns
const MEDIUM_TIER_PATTERNS = [
  /adreno.*[456]/i,
  /mali-g[5-7]/i,
  /apple.*a1[0-4]/i,
  /geforce.*[67][05]0/i,
  /radeon.*r[579]/i,
];

// High-tier GPU patterns
const HIGH_TIER_PATTERNS = [
  /geforce.*rtx/i,
  /geforce.*[23][07]0/i,
  /radeon.*rx.*[567][0-9]00/i,
  /apple.*m[12]/i,
  /apple.*a1[5-9]/i,
  /adreno.*[78]/i,
  /mali-g[89]/i,
];

/**
 * Detect GPU capabilities and return performance tier
 */
export function detectGPU(): GPUInfo {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) {
    return {
      vendor: 'unknown',
      renderer: 'unknown',
      tier: 'fallback',
      supportsWebGL2: false,
      maxTextureSize: 0,
      isMobile,
    };
  }
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const vendor = debugInfo 
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) 
    : 'unknown';
  const renderer = debugInfo 
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) 
    : 'unknown';
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const supportsWebGL2 = !!canvas.getContext('webgl2');
  
  let tier: PerformanceTier = 'medium';
  
  // Determine tier based on GPU
  if (HIGH_TIER_PATTERNS.some(p => p.test(renderer))) {
    tier = 'high';
  } else if (MEDIUM_TIER_PATTERNS.some(p => p.test(renderer))) {
    tier = 'medium';
  } else if (LOW_TIER_PATTERNS.some(p => p.test(renderer))) {
    tier = 'low';
  }
  
  // Downgrade for mobile
  if (isMobile && tier === 'high') {
    tier = 'medium';
  }
  
  // Downgrade for small texture size
  if (maxTextureSize < 4096) {
    tier = tier === 'high' ? 'medium' : tier === 'medium' ? 'low' : tier;
  }
  
  // Fallback if no WebGL2 and mobile
  if (!supportsWebGL2 && isMobile) {
    tier = 'low';
  }
  
  return {
    vendor,
    renderer,
    tier,
    supportsWebGL2,
    maxTextureSize,
    isMobile,
  };
}

/**
 * Get render settings based on performance tier
 */
export function getRenderSettings(tier: PerformanceTier) {
  switch (tier) {
    case 'high':
      return {
        dpr: [1.5, 2] as [number, number],
        shadows: true,
        shadowMapSize: 2048,
        antialias: true,
        envMapIntensity: 1.0,
        aoIntensity: 1.0,
        useLOD: false,
        textureQuality: 'high' as const,
      };
    case 'medium':
      return {
        dpr: [1, 1.5] as [number, number],
        shadows: true,
        shadowMapSize: 1024,
        antialias: true,
        envMapIntensity: 0.8,
        aoIntensity: 0.6,
        useLOD: true,
        textureQuality: 'medium' as const,
      };
    case 'low':
      return {
        dpr: [1, 1] as [number, number],
        shadows: false,
        shadowMapSize: 512,
        antialias: false,
        envMapIntensity: 0.5,
        aoIntensity: 0,
        useLOD: true,
        textureQuality: 'low' as const,
      };
    case 'fallback':
    default:
      return {
        dpr: [1, 1] as [number, number],
        shadows: false,
        shadowMapSize: 256,
        antialias: false,
        envMapIntensity: 0.3,
        aoIntensity: 0,
        useLOD: true,
        textureQuality: 'low' as const,
      };
  }
}

/**
 * Check if device should use static fallback instead of 3D
 */
export function shouldUseFallback(): boolean {
  const gpuInfo = detectGPU();
  
  // Use fallback for very weak GPUs
  if (gpuInfo.tier === 'fallback') return true;
  
  // Use fallback if WebGL not available
  if (!gpuInfo.supportsWebGL2 && gpuInfo.maxTextureSize < 2048) return true;
  
  // Check for memory pressure on mobile
  if (gpuInfo.isMobile && 'deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 2) return true;
  }
  
  return false;
}

// Cache the detection result
let cachedGPUInfo: GPUInfo | null = null;

export function getCachedGPUInfo(): GPUInfo {
  if (!cachedGPUInfo) {
    cachedGPUInfo = detectGPU();
  }
  return cachedGPUInfo;
}
