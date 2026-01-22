// ============================================
// SERA NORR Configurator - Configuration Data
// ============================================

import type {
  StoneMaterialConfig,
  FinishConfig,
  EdgeProfileConfig,
  BaseConfig,
  ProductTypeConfig,
  DimensionConstraints,
  TableShape,
  ProductType,
} from './types';

// Stone Materials Configuration
export const STONE_MATERIALS: StoneMaterialConfig[] = [
  {
    id: 'travertine',
    name: { nl: 'Italiaans Travertin', en: 'Italian Travertine' },
    color: '#E8DFD0',
    roughness: 0.6,
    metalness: 0,
    collection: 'terra',
    priceMultiplier: 1.0,
    available: true,
  },
  {
    id: 'calacattaViola',
    name: { nl: 'Calacatta Viola', en: 'Calacatta Viola' },
    color: '#F5F0F5',
    roughness: 0.3,
    metalness: 0.05,
    collection: 'vanta',
    priceMultiplier: 2.5,
    available: true,
  },
  {
    id: 'verdeAlpi',
    name: { nl: 'Verde Alpi', en: 'Verde Alpi' },
    color: '#2D4A3E',
    roughness: 0.4,
    metalness: 0.02,
    collection: 'other',
    priceMultiplier: 1.8,
    available: true,
  },
  {
    id: 'neroMarquina',
    name: { nl: 'Nero Marquina', en: 'Nero Marquina' },
    color: '#1A1A1A',
    roughness: 0.35,
    metalness: 0.05,
    collection: 'other',
    priceMultiplier: 1.6,
    available: true,
  },
  {
    id: 'custom',
    name: { nl: 'Andere steen (op aanvraag)', en: 'Custom stone (on request)' },
    color: '#9CA3AF',
    roughness: 0.5,
    metalness: 0,
    collection: 'other',
    priceMultiplier: 2.0,
    available: true,
  },
];

// Finish Configuration
export const FINISHES: FinishConfig[] = [
  {
    id: 'honed',
    name: { nl: 'Geslepen (honed)', en: 'Honed' },
    roughnessMultiplier: 0.6,
    priceMultiplier: 1.0,
  },
  {
    id: 'polished',
    name: { nl: 'Gepolijst', en: 'Polished' },
    roughnessMultiplier: 0.3,
    priceMultiplier: 1.15,
  },
  {
    id: 'matte',
    name: { nl: 'Mat', en: 'Matte' },
    roughnessMultiplier: 1.0,
    priceMultiplier: 1.0,
  },
];

// Edge Profile Configuration
export const EDGE_PROFILES: EdgeProfileConfig[] = [
  {
    id: 'straight',
    name: { nl: 'Recht', en: 'Straight' },
    icon: '▬',
    priceMultiplier: 1.0,
    compatibleShapes: ['rectangular', 'oval', 'round', 'organic'],
  },
  {
    id: 'beveled',
    name: { nl: 'Afgeschuind', en: 'Beveled' },
    icon: '◢',
    priceMultiplier: 1.1,
    compatibleShapes: ['rectangular', 'oval', 'round'],
  },
  {
    id: 'rounded',
    name: { nl: 'Afgerond', en: 'Rounded' },
    icon: '◠',
    priceMultiplier: 1.15,
    compatibleShapes: ['rectangular', 'oval', 'round', 'organic'],
  },
  {
    id: 'bullnose',
    name: { nl: 'Bullnose', en: 'Bullnose' },
    icon: '⌓',
    priceMultiplier: 1.25,
    compatibleShapes: ['rectangular', 'oval', 'round'],
  },
];

// Base Configuration
export const BASES: BaseConfig[] = [
  {
    id: 'modern',
    name: { nl: 'Modern', en: 'Modern' },
    description: {
      nl: 'Slanke stalen poten met minimalistisch profiel',
      en: 'Slim steel legs with minimalist profile',
    },
    priceMultiplier: 1.0,
    compatibleProducts: ['dining-table', 'coffee-table', 'console', 'side-table', 'desk'],
  },
  {
    id: 'monolith',
    name: { nl: 'Monoliet', en: 'Monolith' },
    description: {
      nl: 'Massieve stenen sokkel, volledig in materiaal',
      en: 'Solid stone pedestal, fully in material',
    },
    priceMultiplier: 1.8,
    compatibleProducts: ['dining-table', 'coffee-table', 'console', 'side-table'],
  },
  {
    id: 'architectural',
    name: { nl: 'Architecturaal', en: 'Architectural' },
    description: {
      nl: 'Staal met sculptural vormgeving',
      en: 'Steel with sculptural design',
    },
    priceMultiplier: 1.4,
    compatibleProducts: ['dining-table', 'coffee-table', 'desk'],
  },
];

// Product Type Configuration
export const PRODUCT_TYPES: ProductTypeConfig[] = [
  {
    id: 'dining-table',
    name: { nl: 'Eettafel', en: 'Dining Table' },
    icon: '🍽️',
    defaultDimensions: { length: 200, width: 100, height: 75, thickness: 4 },
    compatibleShapes: ['rectangular', 'oval', 'round', 'organic'],
  },
  {
    id: 'coffee-table',
    name: { nl: 'Salontafel', en: 'Coffee Table' },
    icon: '☕',
    defaultDimensions: { length: 120, width: 70, height: 40, thickness: 3 },
    compatibleShapes: ['rectangular', 'oval', 'round', 'organic'],
  },
  {
    id: 'console',
    name: { nl: 'Console', en: 'Console' },
    icon: '🪞',
    defaultDimensions: { length: 140, width: 40, height: 85, thickness: 3 },
    compatibleShapes: ['rectangular', 'oval'],
  },
  {
    id: 'side-table',
    name: { nl: 'Bijzettafel', en: 'Side Table' },
    icon: '🛋️',
    defaultDimensions: { length: 50, width: 50, height: 55, thickness: 2 },
    compatibleShapes: ['rectangular', 'round', 'organic'],
  },
  {
    id: 'desk',
    name: { nl: 'Bureau', en: 'Desk' },
    icon: '💼',
    defaultDimensions: { length: 160, width: 80, height: 75, thickness: 3 },
    compatibleShapes: ['rectangular'],
  },
];

// Shape Configuration
export const SHAPES: { id: TableShape; name: { nl: string; en: string }; icon: string }[] = [
  { id: 'rectangular', name: { nl: 'Rechthoek', en: 'Rectangular' }, icon: '▬' },
  { id: 'oval', name: { nl: 'Ovaal', en: 'Oval' }, icon: '⬭' },
  { id: 'round', name: { nl: 'Rond', en: 'Round' }, icon: '●' },
  { id: 'organic', name: { nl: 'Organisch', en: 'Organic' }, icon: '◯' },
];

// Dimension constraints per product type
export const DIMENSION_CONSTRAINTS: Record<ProductType, DimensionConstraints> = {
  'dining-table': {
    length: { min: 140, max: 400, step: 10 },
    width: { min: 80, max: 140, step: 10 },
    height: { min: 72, max: 78, step: 1 },
    thickness: { min: 3, max: 6, step: 0.5 },
    radius: { min: 100, max: 180, step: 10 },
  },
  'coffee-table': {
    length: { min: 80, max: 180, step: 10 },
    width: { min: 50, max: 120, step: 10 },
    height: { min: 35, max: 50, step: 5 },
    thickness: { min: 2, max: 5, step: 0.5 },
    radius: { min: 50, max: 90, step: 10 },
  },
  console: {
    length: { min: 100, max: 200, step: 10 },
    width: { min: 30, max: 50, step: 5 },
    height: { min: 80, max: 95, step: 5 },
    thickness: { min: 2, max: 4, step: 0.5 },
  },
  'side-table': {
    length: { min: 40, max: 70, step: 5 },
    width: { min: 40, max: 70, step: 5 },
    height: { min: 45, max: 65, step: 5 },
    thickness: { min: 2, max: 3, step: 0.5 },
    radius: { min: 25, max: 40, step: 5 },
  },
  desk: {
    length: { min: 120, max: 220, step: 10 },
    width: { min: 60, max: 100, step: 10 },
    height: { min: 72, max: 78, step: 1 },
    thickness: { min: 3, max: 5, step: 0.5 },
  },
};

// Extras pricing (in EUR)
export const EXTRAS_PRICING = {
  sealer: { price: 150, name: { nl: 'Steenimpregnatie', en: 'Stone sealer' } },
  delivery: { price: 295, name: { nl: 'White-glove bezorging', en: 'White-glove delivery' } },
  installation: { price: 195, name: { nl: 'Professionele plaatsing', en: 'Professional installation' } },
  sampleKit: { price: 45, name: { nl: 'Materiaal sample kit', en: 'Material sample kit' } },
};

// Base price per square meter (travertine reference)
export const BASE_PRICE_PER_SQM = 2800;

// Lead time estimates (in weeks)
export const LEAD_TIME = {
  standard: { min: 10, max: 14 },
  complex: { min: 14, max: 18 },
  custom: { min: 16, max: 24 },
};
