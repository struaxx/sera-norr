// ============================================
// SERA NORR Configurator - Zustand Store
// ============================================

import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  ConfiguratorState, 
  ViewerState, 
  ProductType, 
  TableShape, 
  StoneType, 
  FinishType, 
  EdgeProfile, 
  BaseType,
  PriceEstimate,
  DossierSummary,
} from '@/lib/configurator/types';
import { 
  PRODUCT_TYPES, 
  DIMENSION_CONSTRAINTS,
  validateConfiguration,
  calculatePriceEstimate,
} from '@/lib/configurator';

// ============================================
// Phase Types
// ============================================

export type AtelierPhase = 'lookbook' | 'configurator' | 'dossier';

export interface CollectionInspiration {
  id: string;
  name: string;
  image: string;
  collection: 'vanta' | 'terra' | 'other';
}

// ============================================
// Store Interface
// ============================================

interface ConfiguratorStore {
  // Phase state
  phase: AtelierPhase;
  setPhase: (phase: AtelierPhase) => void;
  
  // Lookbook selections
  selectedCollection: 'vanta' | 'terra' | 'other' | null;
  inspirationItems: CollectionInspiration[];
  setSelectedCollection: (collection: 'vanta' | 'terra' | 'other' | null) => void;
  addInspiration: (item: CollectionInspiration) => void;
  removeInspiration: (id: string) => void;
  
  // Configurator state
  config: ConfiguratorState;
  viewer: ViewerState;
  
  // Configurator actions
  setProductType: (type: ProductType) => void;
  setShape: (shape: TableShape) => void;
  setDimension: (key: 'length' | 'width' | 'height' | 'thickness' | 'radius', value: number) => void;
  setStone: (stone: StoneType) => void;
  setFinish: (finish: FinishType) => void;
  setEdgeProfile: (edge: EdgeProfile) => void;
  setBaseType: (base: BaseType) => void;
  setExtra: (key: keyof ConfiguratorState['extras'], value: boolean) => void;
  setContact: (contact: Partial<ConfiguratorState['contact']>) => void;
  
  // Viewer actions
  setCameraMode: (mode: ViewerState['cameraMode']) => void;
  setBackground: (bg: ViewerState['background']) => void;
  setAutoRotate: (rotate: boolean) => void;
  setShowDimensions: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Computed values
  getPriceEstimate: () => PriceEstimate;
  getCompletionPercentage: () => number;
  getValidation: () => ReturnType<typeof validateConfiguration>;
  
  // Dossier
  generateDossier: () => DossierSummary;
  buildCode: string | null;
  generateBuildCode: () => string;
  
  // Reset
  reset: () => void;
  resetConfig: () => void;
}

// ============================================
// Default States
// ============================================

const defaultConfig: ConfiguratorState = {
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

const defaultViewer: ViewerState = {
  cameraMode: 'default',
  background: 'studio',
  autoRotate: true,
  showDimensions: true,
  isLoading: false,
};

// ============================================
// Store Implementation
// ============================================

export const useConfiguratorStore = create<ConfiguratorStore>()(
  persist(
    immer((set, get) => ({
      // Phase
      phase: 'lookbook',
      setPhase: (phase) => set({ phase }),
      
      // Lookbook
      selectedCollection: null,
      inspirationItems: [],
      setSelectedCollection: (collection) => set({ selectedCollection: collection }),
      addInspiration: (item) => set((state) => {
        if (!state.inspirationItems.find(i => i.id === item.id)) {
          state.inspirationItems.push(item);
        }
      }),
      removeInspiration: (id) => set((state) => {
        state.inspirationItems = state.inspirationItems.filter(i => i.id !== id);
      }),
      
      // Config
      config: defaultConfig,
      viewer: defaultViewer,
      
      // Product type with dimension defaults
      setProductType: (type) => set((state) => {
        const productConfig = PRODUCT_TYPES.find(p => p.id === type);
        state.config.productType = type;
        if (productConfig) {
          state.config.dimensions = { ...productConfig.defaultDimensions };
          // Reset shape if not compatible
          if (!productConfig.compatibleShapes.includes(state.config.shape)) {
            state.config.shape = productConfig.compatibleShapes[0];
          }
        }
      }),
      
      setShape: (shape) => set((state) => {
        state.config.shape = shape;
        // Set radius for round shapes
        if (shape === 'round' && !state.config.dimensions.radius) {
          const constraints = DIMENSION_CONSTRAINTS[state.config.productType];
          state.config.dimensions.radius = constraints.radius?.min ?? 100;
        }
      }),
      
      setDimension: (key, value) => set((state) => {
        const constraints = DIMENSION_CONSTRAINTS[state.config.productType];
        const constraint = constraints[key as keyof typeof constraints];
        if (constraint && 'min' in constraint && 'max' in constraint) {
          state.config.dimensions[key] = Math.max(constraint.min, Math.min(constraint.max, value));
        }
      }),
      
      setStone: (stone) => set((state) => {
        state.config.stone = stone;
      }),
      
      setFinish: (finish) => set((state) => {
        state.config.finish = finish;
      }),
      
      setEdgeProfile: (edge) => set((state) => {
        state.config.edgeProfile = edge;
      }),
      
      setBaseType: (base) => set((state) => {
        state.config.baseType = base;
      }),
      
      setExtra: (key, value) => set((state) => {
        state.config.extras[key] = value;
      }),
      
      setContact: (contact) => set((state) => {
        state.config.contact = { ...state.config.contact, ...contact } as ConfiguratorState['contact'];
      }),
      
      // Viewer
      setCameraMode: (mode) => set((state) => {
        state.viewer.cameraMode = mode;
      }),
      
      setBackground: (bg) => set((state) => {
        state.viewer.background = bg;
      }),
      
      setAutoRotate: (rotate) => set((state) => {
        state.viewer.autoRotate = rotate;
      }),
      
      setShowDimensions: (show) => set((state) => {
        state.viewer.showDimensions = show;
      }),
      
      setIsLoading: (loading) => set((state) => {
        state.viewer.isLoading = loading;
      }),
      
      // Computed
      getPriceEstimate: () => {
        return calculatePriceEstimate(get().config);
      },
      
      getCompletionPercentage: () => {
        const { config } = get();
        let completed = 0;
        const total = 6;
        
        if (config.productType) completed++;
        if (config.shape) completed++;
        if (config.stone) completed++;
        if (config.finish) completed++;
        if (config.edgeProfile) completed++;
        if (config.baseType) completed++;
        
        return Math.round((completed / total) * 100);
      },
      
      getValidation: () => {
        return validateConfiguration(get().config, true);
      },
      
      // Dossier
      buildCode: null,
      
      generateBuildCode: () => {
        const { config } = get();
        const parts = [
          'SN',
          config.productType.substring(0, 2).toUpperCase(),
          config.shape.substring(0, 2).toUpperCase(),
          config.stone.substring(0, 3).toUpperCase(),
          config.dimensions.length,
          config.dimensions.width,
          Date.now().toString(36).substring(-4).toUpperCase(),
        ];
        const code = parts.join('-');
        set({ buildCode: code });
        return code;
      },
      
      generateDossier: () => {
        const state = get();
        const code = state.buildCode || state.generateBuildCode();
        
        return {
          id: code,
          createdAt: new Date(),
          configuration: state.config,
          priceEstimate: state.getPriceEstimate(),
          validation: state.getValidation(),
        };
      },
      
      // Reset
      reset: () => set({
        phase: 'lookbook',
        selectedCollection: null,
        inspirationItems: [],
        config: defaultConfig,
        viewer: defaultViewer,
        buildCode: null,
      }),
      
      resetConfig: () => set((state) => {
        state.config = defaultConfig;
        state.buildCode = null;
      }),
    })),
    {
      name: 'sera-norr-configurator',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phase: state.phase,
        selectedCollection: state.selectedCollection,
        inspirationItems: state.inspirationItems,
        config: state.config,
        buildCode: state.buildCode,
      }),
    }
  )
);

// ============================================
// Selectors (for performance)
// ============================================

export const selectPhase = (state: ConfiguratorStore) => state.phase;
export const selectConfig = (state: ConfiguratorStore) => state.config;
export const selectViewer = (state: ConfiguratorStore) => state.viewer;
export const selectInspiration = (state: ConfiguratorStore) => state.inspirationItems;
