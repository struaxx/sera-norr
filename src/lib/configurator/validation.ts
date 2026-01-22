// ============================================
// SERA NORR Configurator - Validation Engine
// ============================================

import type { ConfiguratorState, ValidationResult, TableShape, EdgeProfile } from './types';
import {
  PRODUCT_TYPES,
  DIMENSION_CONSTRAINTS,
  EDGE_PROFILES,
  BASES,
} from './config';

/**
 * Validate the current configurator state
 */
export function validateConfiguration(config: ConfiguratorState, isNL: boolean): ValidationResult {
  const errors: { field: string; message: string }[] = [];
  const warnings: { field: string; message: string }[] = [];

  // Validate product type exists
  const productConfig = PRODUCT_TYPES.find(p => p.id === config.productType);
  if (!productConfig) {
    errors.push({
      field: 'productType',
      message: isNL ? 'Selecteer een producttype' : 'Select a product type',
    });
  }

  // Validate shape is compatible with product type
  if (productConfig && !productConfig.compatibleShapes.includes(config.shape)) {
    errors.push({
      field: 'shape',
      message: isNL 
        ? `${config.shape} is niet beschikbaar voor dit producttype`
        : `${config.shape} is not available for this product type`,
    });
  }

  // Validate dimensions
  const constraints = DIMENSION_CONSTRAINTS[config.productType];
  if (constraints) {
    // Length validation (for non-round shapes)
    if (config.shape !== 'round') {
      if (config.dimensions.length < constraints.length.min) {
        errors.push({
          field: 'length',
          message: isNL 
            ? `Minimum lengte is ${constraints.length.min}cm`
            : `Minimum length is ${constraints.length.min}cm`,
        });
      }
      if (config.dimensions.length > constraints.length.max) {
        errors.push({
          field: 'length',
          message: isNL 
            ? `Maximum lengte is ${constraints.length.max}cm`
            : `Maximum length is ${constraints.length.max}cm`,
        });
      }

      // Width validation
      if (config.dimensions.width < constraints.width.min) {
        errors.push({
          field: 'width',
          message: isNL 
            ? `Minimum breedte is ${constraints.width.min}cm`
            : `Minimum width is ${constraints.width.min}cm`,
        });
      }
      if (config.dimensions.width > constraints.width.max) {
        errors.push({
          field: 'width',
          message: isNL 
            ? `Maximum breedte is ${constraints.width.max}cm`
            : `Maximum width is ${constraints.width.max}cm`,
        });
      }
    }

    // Radius validation (for round shapes)
    if (config.shape === 'round' && constraints.radius) {
      const radius = config.dimensions.radius ?? 0;
      if (radius < constraints.radius.min) {
        errors.push({
          field: 'radius',
          message: isNL 
            ? `Minimum diameter is ${constraints.radius.min * 2}cm`
            : `Minimum diameter is ${constraints.radius.min * 2}cm`,
        });
      }
      if (radius > constraints.radius.max) {
        errors.push({
          field: 'radius',
          message: isNL 
            ? `Maximum diameter is ${constraints.radius.max * 2}cm`
            : `Maximum diameter is ${constraints.radius.max * 2}cm`,
        });
      }
    }

    // Height validation
    if (config.dimensions.height < constraints.height.min || 
        config.dimensions.height > constraints.height.max) {
      warnings.push({
        field: 'height',
        message: isNL 
          ? `Standaard hoogte is ${constraints.height.min}-${constraints.height.max}cm`
          : `Standard height is ${constraints.height.min}-${constraints.height.max}cm`,
      });
    }

    // Thickness validation
    if (config.dimensions.thickness < constraints.thickness.min) {
      errors.push({
        field: 'thickness',
        message: isNL 
          ? `Minimum bladdikte is ${constraints.thickness.min}cm`
          : `Minimum thickness is ${constraints.thickness.min}cm`,
      });
    }
  }

  // Validate edge profile compatibility
  const edgeConfig = EDGE_PROFILES.find(e => e.id === config.edgeProfile);
  if (edgeConfig && !edgeConfig.compatibleShapes.includes(config.shape)) {
    warnings.push({
      field: 'edgeProfile',
      message: isNL 
        ? `${edgeConfig.name.nl} kan mogelijk niet worden toegepast op deze vorm`
        : `${edgeConfig.name.en} may not be applicable to this shape`,
    });
  }

  // Validate base compatibility
  const baseConfig = BASES.find(b => b.id === config.baseType);
  if (baseConfig && !baseConfig.compatibleProducts.includes(config.productType)) {
    errors.push({
      field: 'baseType',
      message: isNL 
        ? `${baseConfig.name.nl} onderstel is niet beschikbaar voor dit product`
        : `${baseConfig.name.en} base is not available for this product`,
    });
  }

  // Add warnings for special configurations
  if (config.stone === 'custom') {
    warnings.push({
      field: 'stone',
      message: isNL 
        ? 'Custom steensoorten vereisen extra overleg met ons atelier'
        : 'Custom stone types require additional consultation with our atelier',
    });
  }

  if (config.shape === 'organic') {
    warnings.push({
      field: 'shape',
      message: isNL 
        ? 'Organische vormen worden op maat ontworpen na intake'
        : 'Organic shapes are custom designed after consultation',
    });
  }

  // Large table warning
  const surfaceArea = (config.dimensions.length / 100) * (config.dimensions.width / 100);
  if (surfaceArea > 3) {
    warnings.push({
      field: 'dimensions',
      message: isNL 
        ? 'Grote tafels (>3m²) vereisen speciale logistiek'
        : 'Large tables (>3m²) require special logistics',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if a shape is compatible with the current product type
 */
export function isShapeCompatible(shape: TableShape, productType: ConfiguratorState['productType']): boolean {
  const product = PRODUCT_TYPES.find(p => p.id === productType);
  return product?.compatibleShapes.includes(shape) ?? false;
}

/**
 * Check if an edge profile is compatible with the current shape
 */
export function isEdgeCompatible(edgeProfile: EdgeProfile, shape: TableShape): boolean {
  const edge = EDGE_PROFILES.find(e => e.id === edgeProfile);
  return edge?.compatibleShapes.includes(shape) ?? false;
}

/**
 * Get minimum completion percentage for dossier submission
 */
export function getCompletionPercentage(config: ConfiguratorState): number {
  let completed = 0;
  const total = 6;

  if (config.productType) completed++;
  if (config.shape) completed++;
  if (config.dimensions.length > 0 && config.dimensions.width > 0) completed++;
  if (config.stone) completed++;
  if (config.finish) completed++;
  if (config.baseType) completed++;

  return Math.round((completed / total) * 100);
}
