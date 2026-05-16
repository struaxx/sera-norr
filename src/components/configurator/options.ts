import type { RuleShape, RuleLegStyle } from '@/lib/configurator/rules/productRules';

export interface StoneOption {
  id: string;
  label: string;
  family: 'travertijn' | 'marmer';
  texture: string;
}

export const STONE_OPTIONS: StoneOption[] = [
  { id: 'classic-cloudy',  label: 'Classic Cloudy',  family: 'travertijn', texture: '/textures/stones/classic-cloudy-seamless.jpg' },
  { id: 'tiramisu',        label: 'Tiramisu',        family: 'travertijn', texture: '/textures/stones/tiramisu-seamless.jpg' },
  { id: 'light-emprador',  label: 'Light Emperador', family: 'marmer',     texture: '/textures/stones/light-emperador-seamless.jpg' },
  { id: 'dark-emperador',  label: 'Dark Emperador',  family: 'marmer',     texture: '/textures/stones/dark-emperador-seamless.jpg' },
  { id: 'calacatta-viola', label: 'Calacatta Viola', family: 'marmer',     texture: '/textures/stones/calacatta-viola-seamless.jpg' },
];

export interface ShapeOption {
  id: RuleShape;
  label: string;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'round',  label: 'Rond' },
  { id: 'ovale',  label: 'Ovaal' },
  { id: 'ellips', label: 'Ellips' },
  { id: 'corner', label: 'Rechthoek' },
];

export type LegCount = 1 | 2 | 4;

export interface LegStyleOption {
  id: RuleLegStyle;
  label: string;
  category: 'pedestal' | 'fixed';
}

export const LEG_STYLE_OPTIONS: LegStyleOption[] = [
  { id: 'cylindrical',         label: 'Cilindrisch',   category: 'pedestal' },
  { id: 'cylindrical_fluted',  label: 'Gecanneleerd',  category: 'pedestal' },
  { id: 'conical',             label: 'Conisch',       category: 'pedestal' },
  { id: 'hourglass',           label: 'Zandloper',     category: 'pedestal' },
  { id: 'v_legs',              label: 'V-poten',       category: 'fixed' },
  { id: 'd_legs',              label: 'D-poten',       category: 'fixed' },
];

/**
 * Product rules:
 * - Round table: 1 central pedestal leg only (thicker for stability).
 * - Ovale / Ellips / Corner: customer picks legCount.
 *   - 1 = single thick central pedestal (any pedestal style)
 *   - 2 = two pedestals spaced apart (any pedestal style)
 *   - 4 = four fixed legs (v_legs or d_legs)
 */

export const getValidLegCounts = (shape: RuleShape): LegCount[] => {
  if (shape === 'round') return [1];
  return [1, 2, 4];
};

export const getValidLegStyles = (
  shape: RuleShape,
  legCount: LegCount
): LegStyleOption[] => {
  if (shape === 'round' || legCount === 1 || legCount === 2) {
    return LEG_STYLE_OPTIONS.filter(o => o.category === 'pedestal');
  }
  // legCount === 4
  return LEG_STYLE_OPTIONS.filter(o => o.category === 'fixed');
};