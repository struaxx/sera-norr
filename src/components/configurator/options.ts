import type { RuleShape, RuleLegStyle } from '@/lib/configurator/rules/productRules';

export interface StoneOption {
  id: string;
  label: string;
  family: 'travertijn' | 'marmer';
}

export const STONE_OPTIONS: StoneOption[] = [
  { id: 'classic-cloudy',  label: 'Classic Cloudy',  family: 'travertijn' },
  { id: 'tiramisu',        label: 'Tiramisu',        family: 'travertijn' },
  { id: 'light-emprador',  label: 'Light Emperador', family: 'marmer' },
  { id: 'dark-emperador',  label: 'Dark Emperador',  family: 'marmer' },
  { id: 'calacatta-viola', label: 'Calacatta Viola', family: 'marmer' },
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