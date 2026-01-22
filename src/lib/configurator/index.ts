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

// Pricing Engine
export {
  calculatePriceEstimate,
  formatPrice,
  formatPriceRange,
  getLeadTimeEstimate,
} from './pricing';

// Validation Engine
export {
  validateConfiguration,
  isShapeCompatible,
  isEdgeCompatible,
  getCompletionPercentage,
} from './validation';

// Default/Initial State
export const INITIAL_CONFIGURATOR_STATE: import('./types').ConfiguratorState = {
  currentStep: 0,
  productType: 'dining-table',
  shape: 'rectangular',
  dimensions: {
    length: 200,
    width: 100,
    height: 75,
    thickness: 4,
    radius: 100,
  },
  stone: 'travertine',
  finish: 'honed',
  edgeProfile: 'straight',
  baseType: 'modern',
  extras: {
    sealer: false,
    delivery: true,
    installation: false,
    sampleKit: false,
  },
  spacePhotos: [],
  inspirationImages: [],
};
