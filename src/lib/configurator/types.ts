// ============================================
// SERA NORR Premium Configurator - Type System
// ============================================

// Shape Types
// New shape types: ellips, ovale, round, corner, cut-corner
export type TableShape = 'ellips' | 'ovale' | 'round' | 'corner' | 'cut-corner';

// Stone Types - Legacy types plus extended library support
export type StoneType = 'travertine' | 'calacattaViola' | 'neroMarquina' | 'verdeAlpi' | 'biancoCarrara' | 'emperadorDark' | 'custom' | (string & {});

// Finish Types
export type FinishType = 'honed' | 'polished' | 'matte';

// Edge Profile Types
export type EdgeProfile = 'straight' | 'beveled' | 'rounded' | 'bullnose';

// Base Types
export type BaseType = 'modern' | 'monolith' | 'architectural';

// Product Types
export type ProductType = 'dining-table' | 'coffee-table' | 'console' | 'side-table' | 'desk';

// Dimension constraints per shape
export interface DimensionConstraints {
  length: { min: number; max: number; step: number };
  width: { min: number; max: number; step: number };
  height: { min: number; max: number; step: number };
  thickness: { min: number; max: number; step: number };
  radius?: { min: number; max: number; step: number }; // For round shapes
}

// Full configuration state
export interface ConfiguratorState {
  // Step tracking
  currentStep: number;
  
  // Shape & Type
  productType: ProductType;
  shape: TableShape;
  
  // Dimensions (in cm)
  dimensions: {
    length: number;
    width: number;
    height: number;
    thickness: number;
    radius?: number;
  };
  
  // Material
  stone: StoneType;
  finish: FinishType;
  edgeProfile: EdgeProfile;
  
  // Base (legacy)
  baseType: BaseType;
  
  // Leg style (new library)
  legStyle?: string;
  
  // Extras
  extras: {
    sealer: boolean;
    delivery: boolean;
    installation: boolean;
  };
  
  // Contact info (for dossier)
  contact?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    notes?: string;
  };
  
  // Uploads
  spacePhotos: File[];
  inspirationImages: File[];
}

// Stone material configuration for 3D
export interface StoneMaterialConfig {
  id: StoneType;
  name: { nl: string; en: string };
  color: string;
  roughness: number;
  metalness: number;
  collection?: 'vanta' | 'terra' | 'other';
  priceMultiplier: number;
  available: boolean;
}

// Finish configuration
export interface FinishConfig {
  id: FinishType;
  name: { nl: string; en: string };
  roughnessMultiplier: number;
  priceMultiplier: number;
}

// Edge profile configuration
export interface EdgeProfileConfig {
  id: EdgeProfile;
  name: { nl: string; en: string };
  icon: string;
  priceMultiplier: number;
  compatibleShapes: TableShape[];
}

// Base configuration
export interface BaseConfig {
  id: BaseType;
  name: { nl: string; en: string };
  description: { nl: string; en: string };
  priceMultiplier: number;
  compatibleProducts: ProductType[];
}

// Product type configuration
export interface ProductTypeConfig {
  id: ProductType;
  name: { nl: string; en: string };
  icon: string;
  defaultDimensions: ConfiguratorState['dimensions'];
  compatibleShapes: TableShape[];
}

// Price calculation result
export interface PriceEstimate {
  basePrice: number;
  stoneMultiplier: number;
  finishMultiplier: number;
  edgeMultiplier: number;
  baseMultiplier: number;
  extrasTotal: number;
  totalEstimate: number;
  priceRange: {
    min: number;
    max: number;
  };
  disclaimer: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
  warnings: {
    field: string;
    message: string;
  }[];
}

// Dossier summary for export/display
export interface DossierSummary {
  id: string;
  createdAt: Date;
  configuration: ConfiguratorState;
  priceEstimate: PriceEstimate;
  validation: ValidationResult;
}

// 3D Viewer state
export interface ViewerState {
  cameraMode: 'default' | 'top' | 'detail' | 'front';
  background: 'studio' | 'interior';
  autoRotate: boolean;
  showDimensions: boolean;
  isLoading: boolean;
}

// Configurator step definition
export interface ConfiguratorStep {
  id: number;
  key: string;
  title: { nl: string; en: string };
  subtitle: { nl: string; en: string };
  icon: string;
  isOptional: boolean;
  isComplete: (state: ConfiguratorState) => boolean;
}
