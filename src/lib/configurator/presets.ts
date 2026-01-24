// ============================================
// SERA NORR Configurator - Presets (Quick Picks)
// ============================================

import type { StoneType, TableShape, ProductType, BaseType } from './types';

export interface ConfiguratorPreset {
  id: string;
  name: { nl: string; en: string };
  stone: StoneType;
  shape: TableShape;
  productType: ProductType;
  baseType: BaseType;
  dimensions: {
    length: number;
    width: number;
    height: number;
    radius?: number;
  };
  priceFrom: number; // Starting price in EUR
  image?: string;
}

export const PRESETS: ConfiguratorPreset[] = [
  {
    id: 'viola-oval-cylinder-200',
    name: { 
      nl: 'Viola Oval Cylinder 200', 
      en: 'Viola Oval Cylinder 200' 
    },
    stone: 'calacattaViola',
    shape: 'oval',
    productType: 'dining-table',
    baseType: 'modern', // Cylindrical = modern steel
    dimensions: {
      length: 200,
      width: 100,
      height: 75,
    },
    priceFrom: 8500,
  },
  {
    id: 'tiramisu-round-cone-150',
    name: { 
      nl: 'Tiramisu Round Cone 150', 
      en: 'Tiramisu Round Cone 150' 
    },
    stone: 'travertine',
    shape: 'round',
    productType: 'dining-table',
    baseType: 'monolith', // Sculpted Cone = monolith
    dimensions: {
      length: 150,
      width: 150,
      height: 75,
      radius: 75,
    },
    priceFrom: 6200,
  },
  {
    id: 'nero-oval-block-220',
    name: { 
      nl: 'Nero Oval Block 220', 
      en: 'Nero Oval Block 220' 
    },
    stone: 'neroMarquina',
    shape: 'oval',
    productType: 'dining-table',
    baseType: 'architectural', // Pedestal Block = architectural
    dimensions: {
      length: 220,
      width: 100,
      height: 75,
    },
    priceFrom: 7800,
  },
  {
    id: 'verde-round-cylinder-130',
    name: { 
      nl: 'Verde Round Cylinder 130', 
      en: 'Verde Round Cylinder 130' 
    },
    stone: 'verdeAlpi',
    shape: 'round',
    productType: 'dining-table',
    baseType: 'modern',
    dimensions: {
      length: 130,
      width: 130,
      height: 75,
      radius: 65,
    },
    priceFrom: 5900,
  },
  {
    id: 'viola-round-cone-160',
    name: { 
      nl: 'Viola Round Cone 160', 
      en: 'Viola Round Cone 160' 
    },
    stone: 'calacattaViola',
    shape: 'round',
    productType: 'dining-table',
    baseType: 'monolith',
    dimensions: {
      length: 160,
      width: 160,
      height: 75,
      radius: 80,
    },
    priceFrom: 9200,
  },
  {
    id: 'tiramisu-oval-block-240',
    name: { 
      nl: 'Tiramisu Oval Block 240', 
      en: 'Tiramisu Oval Block 240' 
    },
    stone: 'travertine',
    shape: 'oval',
    productType: 'dining-table',
    baseType: 'architectural',
    dimensions: {
      length: 240,
      width: 110,
      height: 75,
    },
    priceFrom: 7400,
  },
  {
    id: 'nero-round-cylinder-150',
    name: { 
      nl: 'Nero Round Cylinder 150', 
      en: 'Nero Round Cylinder 150' 
    },
    stone: 'neroMarquina',
    shape: 'round',
    productType: 'dining-table',
    baseType: 'modern',
    dimensions: {
      length: 150,
      width: 150,
      height: 75,
      radius: 75,
    },
    priceFrom: 6800,
  },
  {
    id: 'verde-oval-cone-200',
    name: { 
      nl: 'Verde Oval Cone 200', 
      en: 'Verde Oval Cone 200' 
    },
    stone: 'verdeAlpi',
    shape: 'oval',
    productType: 'dining-table',
    baseType: 'monolith',
    dimensions: {
      length: 200,
      width: 100,
      height: 75,
    },
    priceFrom: 7200,
  },
];

// Get preset by ID
export function getPresetById(id: string): ConfiguratorPreset | undefined {
  return PRESETS.find(p => p.id === id);
}

// Get presets by stone type
export function getPresetsByStone(stone: StoneType): ConfiguratorPreset[] {
  return PRESETS.filter(p => p.stone === stone);
}

// Get presets by shape
export function getPresetsByShape(shape: TableShape): ConfiguratorPreset[] {
  return PRESETS.filter(p => p.shape === shape);
}
