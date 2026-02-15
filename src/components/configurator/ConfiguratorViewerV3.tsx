// ============================================
// SERA NORR - Geometry-First 3D Configurator Viewer (V3)
// ============================================
// - Rules-driven configuration
// - Debug overlay toggle
// - Test preset buttons
// - Clay material, simple lighting
// - FOV 35-45

import { Suspense, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  ContactShadows,
  Environment,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { TableMeshV3, type TableMeshV3Props } from './TableMeshV3';
import { resolveConfiguration, type ResolvedConfiguration } from '@/lib/configurator/engine/resolveConfiguration';
import { TEST_PRESETS, type TestPreset, getValidLegStyles } from '@/lib/configurator/rules/productRules';
import type { RuleShape, RuleLegStyle } from '@/lib/configurator/rules/productRules';
import { Eye, RotateCcw, Move3D, ZoomIn, RefreshCw, Bug, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mmToM } from '@/lib/configurator/units';

// ============================================
// TYPES
// ============================================

export interface ConfiguratorViewerV3Props {
  shape: RuleShape;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  thicknessMm: number;
  legStyle?: RuleLegStyle;
  stoneId?: string;
  onConfigResolved?: (resolved: ResolvedConfiguration) => void;
  onPresetLoad?: (preset: TestPreset) => void;
  className?: string;
  isNL?: boolean;
}

// ============================================
// CAMERA PRESETS (FOV 35-45)
// ============================================

const CAMERA_PRESETS = {
  default: {
    position: [2.5, 2, 2.5] as [number, number, number],
    fov: 38,
    target: [0, 0.35, 0] as [number, number, number],
  },
  top: {
    position: [0, 4.5, 0.001] as [number, number, number],
    fov: 45,
    target: [0, 0, 0] as [number, number, number],
  },
  detail: {
    position: [0.8, 0.4, 0.8] as [number, number, number],
    fov: 35,
    target: [0.3, 0.3, 0.3] as [number, number, number],
  },
};

type CameraMode = keyof typeof CAMERA_PRESETS;

// ============================================
// DEBUG OVERLAY
// ============================================

function DebugOverlay({ resolved, fov }: { resolved: ResolvedConfiguration; fov: number }) {
  return (
    <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm border border-border rounded-sm p-3 text-[10px] font-mono space-y-1 max-w-[260px] z-20 pointer-events-none">
      <div className="text-foreground font-bold mb-1">DEBUG</div>
      <div>shape: <span className="text-primary">{resolved.shape}</span></div>
      <div>L: {resolved.lengthMm}mm W: {resolved.widthMm}mm H: {resolved.heightMm}mm</div>
      <div>thickness: {resolved.thicknessMm}mm</div>
      <div>legStyle: <span className="text-primary">{resolved.legStyle}</span></div>
      <div>legCount: {resolved.legCount}</div>
      <div>legSize: {resolved.legSizeVariant.id} (r={resolved.legSizeVariant.radiusMm}mm)</div>
      <div>clearance: {resolved.clearanceMm.toFixed(0)}mm</div>
      <div>legHeight: {resolved.legHeightMm}mm</div>
      <div>offsets: {resolved.legPlacements.map(p => `(${p.x},${p.z})`).join(' ')}</div>
      <div>FOV: {fov}°</div>
      <div>scale: mmToM (÷1000)</div>
      <div className={resolved.isValid ? 'text-green-600' : 'text-red-500'}>
        valid: {resolved.isValid ? '✓' : '✗'}
      </div>
      {resolved.wasAutoSwitched && (
        <div className="text-amber-600 mt-1">⚠ {resolved.autoSwitchReason}</div>
      )}
      {resolved.warnings.length > 0 && (
        <div className="text-amber-600 mt-1">
          {resolved.warnings.map((w, i) => <div key={i}>⚠ {w}</div>)}
        </div>
      )}
    </div>
  );
}

// ============================================
// LOADING FALLBACK
// ============================================

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground tracking-wider uppercase">Laden...</span>
      </div>
    </Html>
  );
}

// ============================================
// DIMENSION LABELS
// ============================================

function DimensionLabels({ resolved }: { resolved: ResolvedConfiguration }) {
  const lM = mmToM(resolved.lengthMm);
  const wM = mmToM(resolved.widthMm);
  const hM = mmToM(resolved.heightMm);
  const legH = mmToM(resolved.legHeightMm);

  return (
    <group>
      {/* Length label (Z axis) */}
      <Html position={[0, legH + 0.02, lM / 2 + 0.08]} center>
        <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap shadow-sm border border-border/50">
          {resolved.lengthMm}mm
        </div>
      </Html>
      {/* Width label (X axis) */}
      {resolved.shape !== 'round' && (
        <Html position={[wM / 2 + 0.08, legH + 0.02, 0]} center>
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap shadow-sm border border-border/50">
            {resolved.widthMm}mm
          </div>
        </Html>
      )}
      {/* Height label */}
      <Html position={[-wM / 2 - 0.12, hM / 2, 0]} center>
        <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap shadow-sm border border-border/50">
          H {resolved.heightMm}mm
        </div>
      </Html>
    </group>
  );
}

// ============================================
// MAIN VIEWER COMPONENT
// ============================================

export function ConfiguratorViewerV3({
  shape,
  lengthMm,
  widthMm,
  heightMm,
  thicknessMm,
  legStyle,
  stoneId,
  onConfigResolved,
  onPresetLoad,
  className,
  isNL = true,
}: ConfiguratorViewerV3Props) {
  const [cameraMode, setCameraMode] = useState<CameraMode>('default');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);

  // Resolve configuration
  const resolved = useMemo(
    () => resolveConfiguration({
      shape,
      lengthMm,
      widthMm,
      heightMm,
      thicknessMm,
      requestedLegStyle: legStyle,
    }),
    [shape, lengthMm, widthMm, heightMm, thicknessMm, legStyle]
  );

  // Notify parent of resolved config
  useEffect(() => {
    onConfigResolved?.(resolved);
  }, [resolved, onConfigResolved]);

  const currentCamera = CAMERA_PRESETS[cameraMode];

  const resetView = useCallback(() => {
    setCameraMode('default');
    setAutoRotate(true);
  }, []);

  return (
    <div className={cn("relative w-full aspect-square lg:aspect-[4/3] bg-secondary/30 rounded-sm overflow-hidden", className)}>
      {/* Debug Overlay */}
      {showDebug && <DebugOverlay resolved={resolved} fov={currentCamera.fov} />}

      {/* Auto-switch notice */}
      <AnimatePresence>
        {resolved.wasAutoSwitched && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 right-3 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-sm text-xs z-10 max-w-[220px]"
          >
            ⚠ {resolved.autoSwitchReason}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} className="touch-none">
        <PerspectiveCamera
          makeDefault
          position={currentCamera.position}
          fov={currentCamera.fov}
        />

        {/* Simple lighting for clay */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, 5, -3]} intensity={0.4} />

        <Suspense fallback={<LoadingFallback />}>
          <TableMeshV3
            shape={shape}
            lengthMm={lengthMm}
            widthMm={widthMm}
            heightMm={heightMm}
            thicknessMm={thicknessMm}
            legStyle={resolved.legStyle}
            stoneId={stoneId}
          />
          {showDimensions && <DimensionLabels resolved={resolved} />}
          <ContactShadows
            position={[0, 0.001, 0]}
            opacity={0.5}
            scale={6}
            blur={2}
            far={4}
          />
          <Environment preset="apartment" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.0}
          maxDistance={6}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
          target={currentCamera.target}
        />
      </Canvas>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        {/* Left controls */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={cn(
              "p-2.5 rounded-sm transition-all backdrop-blur-sm",
              autoRotate ? "bg-foreground text-background" : "bg-background/80 text-foreground hover:bg-background"
            )}
            title="Auto-rotate"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={cn(
              "p-2.5 rounded-sm transition-all backdrop-blur-sm",
              showDimensions ? "bg-foreground text-background" : "bg-background/80 text-foreground hover:bg-background"
            )}
            title="Dimensions"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={cn(
              "p-2.5 rounded-sm transition-all backdrop-blur-sm",
              showDebug ? "bg-foreground text-background" : "bg-background/80 text-foreground hover:bg-background"
            )}
            title="Debug overlay"
          >
            <Bug className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2.5 rounded-sm transition-all backdrop-blur-sm bg-background/80 text-foreground hover:bg-background"
            title="Reset view"
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
          {([
            { mode: 'default' as CameraMode, icon: Move3D, label: '3D' },
            { mode: 'top' as CameraMode, icon: Eye, label: 'Top' },
            { mode: 'detail' as CameraMode, icon: ZoomIn, label: 'Detail' },
          ]).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => {
                setCameraMode(mode);
                setAutoRotate(mode === 'default');
              }}
              className={cn(
                "px-3 py-2 rounded-sm text-[10px] uppercase tracking-wider transition-all backdrop-blur-sm flex items-center gap-1.5",
                cameraMode === mode
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

      {/* Test Presets Bar */}
      {onPresetLoad && (
        <div className="absolute top-3 right-3 flex flex-wrap gap-1 z-10 pointer-events-auto max-w-[300px]">
          {TEST_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onPresetLoad(preset)}
              className="px-2 py-1 bg-background/90 backdrop-blur-sm border border-border text-[9px] font-mono rounded-sm hover:bg-secondary transition-colors"
              title={preset.note}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
