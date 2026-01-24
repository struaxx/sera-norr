// ============================================
// SERA NORR Configurator - Public API
// ============================================

// Types
export type {
  TableShape,
  StoneType,
  FinishType,
  EdgeProfile,
  BaseType,
  ProductType,
  DimensionConstraints,
  ConfiguratorState,
  StoneMaterialConfig,
  FinishConfig,
  EdgeProfileConfig,
  BaseConfig,
  ProductTypeConfig,
  PriceEstimate,
  ValidationResult,
  DossierSummary,
  ViewerState,
  ConfiguratorStep,
} from './types';

// Configuration Data
export {
  STONE_MATERIALS,
  FINISHES,
  EDGE_PROFILES,
  BASES,
  PRODUCT_TYPES,
  SHAPES,
  DIMENSION_CONSTRAINTS,
  EXTRAS_PRICING,
  BASE_PRICE_PER_SQM,
  LEAD_TIME,
} from './config';

// Stone Library (NEW - Full catalog from PDFs)
export {
  STONE_LIBRARY,
  getStonesByFamily,
  getStonesByCollection,
  getStonesByTier,
  getStonesByTags,
  searchStones,
  getStoneById,
  mapToLegacyStoneConfig,
  STONE_LIBRARY_STATS,
  type StoneFamily,
  type StoneTier,
  type StoneCollection,
  type CharacterTag,
  type StoneLibraryEntry,
} from './stone-library';

// Pricing Engine (Legacy)
export {
  calculatePriceEstimate,
  formatPrice,
  formatPriceRange,
  getLeadTimeEstimate,
} from './pricing';

// Pricing Engine V2 (Modular "Vanaf" system)
export {
  calculateModularPrice,
  formatVanafPrice,
  getModularLeadTime,
  STONE_BASE_PRICES,
  SIZE_UPLIFTS,
  THICKNESS_UPLIFTS,
  BASE_UPLIFTS,
  FINISH_UPLIFTS,
  EDGE_UPLIFTS,
  type ModularPriceEstimate,
} from './pricing-v2';

// Validation Engine
export {
  validateConfiguration,
  isShapeCompatible,
  isEdgeCompatible,
  getCompletionPercentage,
} from './validation';

// GPU Detection
export {
  detectGPU,
  getRenderSettings,
  shouldUseFallback,
  getCachedGPUInfo,
  type PerformanceTier,
} from './gpu-detection';

// 3D Assets
export {
  getStoneTextures,
  getTableModel,
  getBaseModel,
  getEnvironmentMap,
  getFallbackPreview,
  preloadCriticalAssets,
  preloadLODInBackground,
  getMaterialConfig,
  type TextureQuality,
  type LODLevel,
} from './3d-assets';

// Default/Initial State - Updated with 20mm default thickness
export const INITIAL_CONFIGURATOR_STATE: import('./types').ConfiguratorState = {
  currentStep: 0,
  productType: 'dining-table',
  shape: 'oval',
  dimensions: {
    length: 200,
    width: 100,
    height: 75,
    thickness: 2, // 20mm default
    radius: 75,
  },
  stone: 'tiramisu', // Default to signature travertine
  finish: 'honed',
  edgeProfile: 'straight',
  baseType: 'modern',
  extras: {
    sealer: false,
    delivery: true,
    installation: true,
    sampleKit: false,
  },
  spacePhotos: [],
  inspirationImages: [],
};
