// ============================================
// SERA NORR - Premium 3D Configurator Viewer (V2)
// ============================================
// Features:
// - Working camera modes (3D / TOP / DETAIL)
// - Reset view button
// - Loading state with material update feedback
// - Dimension labels
// - Premium showroom lighting

import { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  Html,
  Center,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { TableMesh } from './TableMesh';
import { Eye, RotateCcw, Move3D, ZoomIn, Maximize2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConfiguratorState, ViewerState } from '@/lib/configurator';

interface ConfiguratorViewerProps {
  config: ConfiguratorState;
  className?: string;
  isNL?: boolean;
}

// ============================================
// CAMERA PRESETS
// ============================================

const CAMERA_PRESETS = {
  default: { 
    position: [2.5, 2, 2.5] as [number, number, number], 
    fov: 35,
    target: [0, 0, 0] as [number, number, number],
  },
  top: { 
    position: [0, 4.5, 0.001] as [number, number, number], 
    fov: 45,
    target: [0, 0, 0] as [number, number, number],
  },
  detail: { 
    position: [0.8, 0.2, 0.8] as [number, number, number], 
    fov: 30,
    target: [0.3, -0.3, 0.3] as [number, number, number],
  },
  front: { 
    position: [0, 1, 3.5] as [number, number, number], 
    fov: 35,
    target: [0, 0, 0] as [number, number, number],
  },
};

// ============================================
// LOADING FALLBACK
// ============================================

function LoadingFallback({ message }: { message?: string }) {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground tracking-wider uppercase">
          {message || 'Laden...'}
        </span>
      </div>
    </Html>
  );
}

// ============================================
// DIMENSION LABELS
// ============================================

function DimensionLabels({ config, show }: { config: ConfiguratorState; show: boolean }) {
  if (!show) return null;
  
  const { dimensions, shape } = config;
  const scale = 0.01;
  const w = dimensions.length * scale;
  const d = dimensions.width * scale;
  const h = dimensions.height * scale;

  return (
    <group>
      {/* Width label */}
      {shape !== 'round' && (
        <Html position={[w / 2 + 0.15, 0, 0]} center>
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap shadow-sm border border-border/50">
            {dimensions.length} cm
          </div>
        </Html>
      )}
      {/* Depth label */}
      {shape !== 'round' && (
        <Html position={[0, 0, d / 2 + 0.15]} center>
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap shadow-sm border border-border/50">
            {dimensions.width} cm
          </div>
        </Html>
      )}
      {/* Diameter label for round */}
      {shape === 'round' && dimensions.radius && (
        <Html position={[dimensions.radius * scale + 0.15, 0, 0]} center>
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap shadow-sm border border-border/50">
            ⌀ {dimensions.radius * 2} cm
          </div>
        </Html>
      )}
      {/* Height label */}
      <Html position={[-w / 2 - 0.2, -0.5 + h / 2, 0]} center>
        <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap shadow-sm border border-border/50">
          H {dimensions.height} cm
        </div>
      </Html>
      {/* Thickness label (in detail mode this is helpful) */}
      <Html position={[w / 2, h - dimensions.thickness * scale / 2, d / 2 + 0.1]} center>
        <div className="bg-foreground/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-mono text-background whitespace-nowrap">
          {dimensions.thickness * 10}mm
        </div>
      </Html>
    </group>
  );
}

// ============================================
// CAMERA CONTROLLER (for smooth transitions)
// ============================================

function CameraController({ 
  cameraMode, 
  onReset 
}: { 
  cameraMode: keyof typeof CAMERA_PRESETS;
  onReset?: () => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    const preset = CAMERA_PRESETS[cameraMode];
    if (preset && camera) {
      // Animate camera position
      camera.position.set(...preset.position);
      camera.updateProjectionMatrix();
      
      // Update orbit controls target if available
      if (controlsRef.current) {
        controlsRef.current.target.set(...preset.target);
        controlsRef.current.update();
      }
    }
  }, [cameraMode, camera]);
  
  return null;
}

// ============================================
// MAIN VIEWER COMPONENT
// ============================================

export function ConfiguratorViewer({ config, className, isNL = true }: ConfiguratorViewerProps) {
  const [viewerState, setViewerState] = useState<ViewerState>({
    cameraMode: 'default',
    background: 'studio',
    autoRotate: true,
    showDimensions: false,
    isLoading: false,
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const prevConfigRef = useRef(config);

  // Detect config changes for loading state
  useEffect(() => {
    const prevConfig = prevConfigRef.current;
    const hasChanged = 
      prevConfig.stone !== config.stone ||
      prevConfig.finish !== config.finish ||
      prevConfig.legStyle !== config.legStyle ||
      prevConfig.shape !== config.shape;
    
    if (hasChanged) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 600);
      prevConfigRef.current = config;
      return () => clearTimeout(timer);
    }
  }, [config]);

  const toggleDimensions = useCallback(() => {
    setViewerState(prev => ({ ...prev, showDimensions: !prev.showDimensions }));
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setViewerState(prev => ({ ...prev, autoRotate: !prev.autoRotate }));
  }, []);

  const setCameraMode = useCallback((mode: ViewerState['cameraMode']) => {
    setViewerState(prev => ({ ...prev, cameraMode: mode, autoRotate: mode === 'default' }));
  }, []);

  const resetView = useCallback(() => {
    setViewerState(prev => ({ 
      ...prev, 
      cameraMode: 'default', 
      autoRotate: true,
      showDimensions: false,
    }));
  }, []);

  const currentCamera = CAMERA_PRESETS[viewerState.cameraMode];

  return (
    <div className={cn("relative w-full aspect-square lg:aspect-[4/3] bg-secondary/30 rounded-sm overflow-hidden", className)}>
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} className="touch-none">
        <PerspectiveCamera 
          makeDefault 
          position={currentCamera.position} 
          fov={currentCamera.fov} 
        />
        
        {/* Premium Showroom Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-near={0.1}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <spotLight 
          position={[0, 8, 0]} 
          intensity={0.4} 
          angle={0.6} 
          penumbra={1} 
          castShadow={false}
        />
        {/* Rim light for edge definition */}
        <pointLight position={[-3, 2, -3]} intensity={0.3} color="#fff5e6" />

        <Suspense fallback={<LoadingFallback message={isNL ? 'Model laden...' : 'Loading model...'} />}>
          <Center>
            <TableMesh
              shape={config.shape}
              stone={config.stone}
              finish={config.finish}
              edgeProfile={config.edgeProfile}
              baseType={config.baseType}
              legStyle={config.legStyle}
              dimensions={config.dimensions}
            />
            <DimensionLabels config={config} show={viewerState.showDimensions} />
          </Center>

          <ContactShadows
            position={[0, -0.49, 0]}
            opacity={0.6}
            scale={8}
            blur={2}
            far={4}
          />
          
          {/* Premium environment for realistic reflections */}
          <Environment 
            preset={viewerState.background === 'studio' ? 'apartment' : 'city'} 
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.0}
          maxDistance={8}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={viewerState.autoRotate}
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
          target={currentCamera.target}
        />
      </Canvas>

      {/* Update Indicator */}
      <AnimatePresence>
        {isUpdating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-foreground/90 text-background px-3 py-1.5 rounded-full text-xs flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            {isNL ? 'Materiaal bijwerken...' : 'Updating material...'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewer Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        {/* Left controls */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={toggleAutoRotate}
            className={cn(
              "p-2.5 rounded-sm transition-all duration-200 backdrop-blur-sm",
              viewerState.autoRotate 
                ? "bg-foreground text-background" 
                : "bg-background/80 text-foreground hover:bg-background"
            )}
            title={isNL ? 'Auto-rotatie' : 'Auto-rotate'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleDimensions}
            className={cn(
              "p-2.5 rounded-sm transition-all duration-200 backdrop-blur-sm",
              viewerState.showDimensions 
                ? "bg-foreground text-background" 
                : "bg-background/80 text-foreground hover:bg-background"
            )}
            title={isNL ? 'Afmetingen tonen' : 'Show dimensions'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2.5 rounded-sm transition-all duration-200 backdrop-blur-sm bg-background/80 text-foreground hover:bg-background"
            title={isNL ? 'Reset weergave' : 'Reset view'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Center hint */}
        <p className="text-[10px] text-muted-foreground tracking-wider uppercase hidden sm:block">
          {isNL ? 'Sleep om te roteren • Scroll om te zoomen' : 'Drag to rotate • Scroll to zoom'}
        </p>

        {/* Right controls - camera presets */}
        <div className="flex gap-1 pointer-events-auto">
          {[
            { mode: 'default' as const, icon: Move3D, label: '3D' },
            { mode: 'top' as const, icon: Eye, label: 'Top' },
            { mode: 'detail' as const, icon: ZoomIn, label: isNL ? 'Detail' : 'Detail' },
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setCameraMode(mode)}
              className={cn(
                "px-3 py-2 rounded-sm text-[10px] uppercase tracking-wider transition-all duration-200 backdrop-blur-sm flex items-center gap-1.5",
                viewerState.cameraMode === mode 
                  ? "bg-foreground text-background" 
                  : "bg-background/80 text-foreground hover:bg-background"
              )}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {viewerState.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">
                {isNL ? 'Laden...' : 'Loading...'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
