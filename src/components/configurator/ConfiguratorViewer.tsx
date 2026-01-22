import { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
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
import { Eye, RotateCcw, Move3D, ZoomIn, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConfiguratorState, ViewerState } from '@/lib/configurator';

interface ConfiguratorViewerProps {
  config: ConfiguratorState;
  className?: string;
  isNL?: boolean;
}

// Loading skeleton for 3D
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground tracking-wider uppercase">
          Laden...
        </span>
      </div>
    </Html>
  );
}

// Dimension labels in 3D
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
        <Html position={[w / 2 + 0.1, 0, 0]} center>
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap">
            {dimensions.length} cm
          </div>
        </Html>
      )}
      {/* Depth label */}
      {shape !== 'round' && (
        <Html position={[0, 0, d / 2 + 0.1]} center>
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap">
            {dimensions.width} cm
          </div>
        </Html>
      )}
      {/* Diameter label for round */}
      {shape === 'round' && dimensions.radius && (
        <Html position={[dimensions.radius * scale + 0.1, 0, 0]} center>
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap">
            ⌀ {dimensions.radius * 2} cm
          </div>
        </Html>
      )}
      {/* Height label */}
      <Html position={[-w / 2 - 0.15, -0.5 + h / 2, 0]} center>
        <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap">
          H {dimensions.height} cm
        </div>
      </Html>
    </group>
  );
}

// Camera presets
const CAMERA_PRESETS = {
  default: { position: [2.5, 2, 2.5] as [number, number, number], fov: 35 },
  top: { position: [0, 4, 0.01] as [number, number, number], fov: 40 },
  detail: { position: [1, 0.5, 1] as [number, number, number], fov: 25 },
  front: { position: [0, 1, 3] as [number, number, number], fov: 35 },
};

export function ConfiguratorViewer({ config, className, isNL = true }: ConfiguratorViewerProps) {
  const [viewerState, setViewerState] = useState<ViewerState>({
    cameraMode: 'default',
    background: 'studio',
    autoRotate: true,
    showDimensions: false,
    isLoading: false,
  });

  const toggleDimensions = useCallback(() => {
    setViewerState(prev => ({ ...prev, showDimensions: !prev.showDimensions }));
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setViewerState(prev => ({ ...prev, autoRotate: !prev.autoRotate }));
  }, []);

  const setCameraMode = useCallback((mode: ViewerState['cameraMode']) => {
    setViewerState(prev => ({ ...prev, cameraMode: mode }));
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
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-near={0.1}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        <spotLight position={[0, 10, 0]} intensity={0.3} angle={0.5} penumbra={1} />

        <Suspense fallback={<LoadingFallback />}>
          <Center>
            <TableMesh
              shape={config.shape}
              stone={config.stone}
              finish={config.finish}
              edgeProfile={config.edgeProfile}
              baseType={config.baseType}
              dimensions={config.dimensions}
            />
            <DimensionLabels config={config} show={viewerState.showDimensions} />
          </Center>

          <ContactShadows
            position={[0, -0.49, 0]}
            opacity={0.5}
            scale={6}
            blur={2.5}
            far={4}
          />
          
          <Environment 
            preset={viewerState.background === 'studio' ? 'apartment' : 'city'} 
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.2}
          maxDistance={6}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={viewerState.autoRotate}
          autoRotateSpeed={0.4}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

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
            { mode: 'detail' as const, icon: ZoomIn, label: 'Detail' },
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
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
