import type { ConfiguratorViewerV3Props } from './ConfiguratorViewerV3';
import type { RuleShape, RuleLegStyle } from '@/lib/configurator/rules/productRules';

export const DEFAULT_HEIGHT_MM = 750;
export const DEFAULT_THICKNESS_MM = 20;

export interface ConfiguratorState {
  stoneId: string;
  shape: RuleShape;
  lengthMm: number;
  widthMm: number;
  legStyle: RuleLegStyle;
}

export const stateToViewerProps = (
  state: ConfiguratorState
): Pick<ConfiguratorViewerV3Props,
  'stoneId' | 'shape' | 'lengthMm' | 'widthMm' | 'heightMm' | 'thicknessMm' | 'legStyle' | 'isNL'
> => ({
  stoneId:     state.stoneId,
  shape:       state.shape,
  lengthMm:    state.lengthMm,
  widthMm:     state.widthMm,
  heightMm:    DEFAULT_HEIGHT_MM,
  thicknessMm: DEFAULT_THICKNESS_MM,
  legStyle:    state.legStyle,
  isNL:        true,
});
