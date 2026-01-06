import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Check, Upload, X, ChevronRight, ChevronLeft } from "lucide-react";

// Types
export interface AtelierFlowData {
  // Step 1: Direction/Inspiration
  direction: 'vanta' | 'terra' | 'other' | null;
  inspirationItems: string[];
  
  // Step 2: Type
  productType: string | null;
  productTypeOther: string;
  
  // Step 3: Dimensions
  shape: 'rectangular' | 'round' | 'oval' | 'organic' | null;
  dimensions: {
    length: number;
    width: number;
    height: number;
    diameter: number;
  };
  
  // Step 4: Stone & Finish
  stone: 'calacatta-viola' | 'travertin' | 'other' | null;
  finish: 'honed' | 'polished' | 'mat' | null;
  edgeProfile: string | null;
  
  // Step 5: Customer Story
  uploads: File[];
  context: string;
  wishes: string;
  budgetRange: string;
  deadline: string;
}

interface AtelierFlowProps {
  isNL: boolean;
  onDataChange: (data: AtelierFlowData) => void;
  data: AtelierFlowData;
}

const TOTAL_STEPS = 5;

export function AtelierFlow({ isNL, onDataChange, data }: AtelierFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);

  const updateData = <K extends keyof AtelierFlowData>(key: K, value: AtelierFlowData[K]) => {
    onDataChange({ ...data, [key]: value });
  };

  const updateDimensions = (key: keyof AtelierFlowData['dimensions'], value: number) => {
    onDataChange({
      ...data,
      dimensions: { ...data.dimensions, [key]: value }
    });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      updateData('uploads', [...data.uploads, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    updateData('uploads', data.uploads.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.direction !== null;
      case 2: return data.productType !== null;
      case 3: return data.shape !== null;
      case 4: return data.stone !== null;
      case 5: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step content
  const steps = [
    {
      number: 1,
      title: isNL ? "Selecteer richting" : "Select direction",
      subtitle: isNL ? "Welke signatuur spreekt u aan?" : "Which signature appeals to you?",
    },
    {
      number: 2,
      title: isNL ? "Type stuk" : "Piece type",
      subtitle: isNL ? "Wat voor meubel heeft u in gedachten?" : "What type of furniture do you have in mind?",
    },
    {
      number: 3,
      title: isNL ? "Afmetingen" : "Dimensions",
      subtitle: isNL ? "Indicatief. We finetunen samen." : "Indicative. We fine-tune together.",
    },
    {
      number: 4,
      title: isNL ? "Steen & afwerking" : "Stone & finish",
      subtitle: isNL ? "Materiaal en details." : "Material and details.",
    },
    {
      number: 5,
      title: isNL ? "Uw ruimte" : "Your space",
      subtitle: isNL ? "Context en wensen." : "Context and wishes.",
    },
  ];

  return (
    <div className="bg-background border border-foreground/8">
      {/* Progress header */}
      <div className="border-b border-foreground/8 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 block mb-1">
              {isNL ? 'Stap' : 'Step'} {currentStep} {isNL ? 'van' : 'of'} {TOTAL_STEPS}
            </span>
            <h3 className="font-serif text-xl lg:text-2xl text-foreground">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {steps[currentStep - 1].subtitle}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 transition-colors duration-300",
                index < currentStep ? "bg-foreground" : "bg-foreground/10"
              )}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="p-6 lg:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Step 1: Direction */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'vanta' as const, label: 'VANTA', sub: 'Calacatta Viola', desc: isNL ? 'Sculpturaal marmer' : 'Sculptural marble' },
                    { id: 'terra' as const, label: 'TERRA', sub: 'Travertin', desc: isNL ? 'Warme textuur' : 'Warm texture' },
                    { id: 'other' as const, label: isNL ? 'Anders' : 'Other', sub: isNL ? 'Eigen richting' : 'Own direction', desc: isNL ? 'Eigen visie' : 'Own vision' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateData('direction', option.id)}
                      className={cn(
                        "text-left p-6 border transition-all duration-200",
                        data.direction === option.id
                          ? "border-foreground bg-foreground/[0.02]"
                          : "border-foreground/10 hover:border-foreground/30"
                      )}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="font-serif text-lg">{option.label}</span>
                        {data.direction === option.id && (
                          <Check className="w-4 h-4 text-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{option.sub}</p>
                      <p className="text-xs text-muted-foreground/70">{option.desc}</p>
                    </button>
                  ))}
                </div>
                
                {/* Inspiration items (placeholder) */}
                <div className="pt-4 border-t border-foreground/8">
                  <p className="text-xs text-muted-foreground mb-3">
                    {isNL 
                      ? "Optioneel: selecteer items uit het lookbook voor extra inspiratie" 
                      : "Optional: select items from the lookbook for extra inspiration"}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/collections" target="_blank">
                      {isNL ? "Open lookbook" : "Open lookbook"}
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Type */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'dining-table', label: isNL ? 'Eettafel' : 'Dining table' },
                    { id: 'coffee-table', label: isNL ? 'Salontafel' : 'Coffee table' },
                    { id: 'console', label: 'Console' },
                    { id: 'tv-meubel', label: 'TV-meubel' },
                    { id: 'side-table', label: isNL ? 'Bijzettafel' : 'Side table' },
                    { id: 'other', label: isNL ? 'Anders' : 'Other' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateData('productType', option.id)}
                      className={cn(
                        "p-4 border text-left transition-all duration-200",
                        data.productType === option.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/10 hover:border-foreground/30"
                      )}
                    >
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
                
                {data.productType === 'other' && (
                  <Input
                    placeholder={isNL ? "Beschrijf kort..." : "Describe briefly..."}
                    value={data.productTypeOther}
                    onChange={(e) => updateData('productTypeOther', e.target.value)}
                    className="mt-4"
                  />
                )}
              </div>
            )}

            {/* Step 3: Dimensions */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Shape selection */}
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-4">
                    {isNL ? 'Vorm' : 'Shape'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'rectangular' as const, label: isNL ? 'Rechthoek' : 'Rectangle' },
                      { id: 'round' as const, label: isNL ? 'Rond' : 'Round' },
                      { id: 'oval' as const, label: isNL ? 'Ovaal' : 'Oval' },
                      { id: 'organic' as const, label: isNL ? 'Organisch' : 'Organic' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => updateData('shape', option.id)}
                        className={cn(
                          "px-4 py-2 text-sm border transition-all duration-200",
                          data.shape === option.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-foreground/10 hover:border-foreground/30"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimension sliders */}
                {data.shape === 'round' ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{isNL ? 'Diameter' : 'Diameter'}</span>
                        <span className="text-sm font-medium">{data.dimensions.diameter} cm</span>
                      </div>
                      <Slider
                        value={[data.dimensions.diameter]}
                        onValueChange={(v) => updateDimensions('diameter', v[0])}
                        min={40}
                        max={200}
                        step={5}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{isNL ? 'Hoogte' : 'Height'}</span>
                        <span className="text-sm font-medium">{data.dimensions.height} cm</span>
                      </div>
                      <Slider
                        value={[data.dimensions.height]}
                        onValueChange={(v) => updateDimensions('height', v[0])}
                        min={30}
                        max={80}
                        step={5}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{isNL ? 'Lengte' : 'Length'}</span>
                        <span className="text-sm font-medium">{data.dimensions.length} cm</span>
                      </div>
                      <Slider
                        value={[data.dimensions.length]}
                        onValueChange={(v) => updateDimensions('length', v[0])}
                        min={60}
                        max={300}
                        step={10}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{isNL ? 'Breedte' : 'Width'}</span>
                        <span className="text-sm font-medium">{data.dimensions.width} cm</span>
                      </div>
                      <Slider
                        value={[data.dimensions.width]}
                        onValueChange={(v) => updateDimensions('width', v[0])}
                        min={40}
                        max={150}
                        step={5}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{isNL ? 'Hoogte' : 'Height'}</span>
                        <span className="text-sm font-medium">{data.dimensions.height} cm</span>
                      </div>
                      <Slider
                        value={[data.dimensions.height]}
                        onValueChange={(v) => updateDimensions('height', v[0])}
                        min={30}
                        max={80}
                        step={5}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Stone & Finish */}
            {currentStep === 4 && (
              <div className="space-y-8">
                {/* Stone selection */}
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-4">
                    {isNL ? 'Steensoort' : 'Stone type'}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'calacatta-viola' as const, label: 'Calacatta Viola', color: '#F5F0F5' },
                      { id: 'travertin' as const, label: 'Travertin', color: '#E8DFD0' },
                      { id: 'other' as const, label: isNL ? 'Overig' : 'Other', color: '#D4D4D4' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => updateData('stone', option.id)}
                        className={cn(
                          "p-4 border transition-all duration-200 flex items-center gap-4",
                          data.stone === option.id
                            ? "border-foreground"
                            : "border-foreground/10 hover:border-foreground/30"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-full border border-foreground/10"
                          style={{ backgroundColor: option.color }}
                        />
                        <span className="text-sm">{option.label}</span>
                        {data.stone === option.id && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finish selection */}
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-4">
                    {isNL ? 'Afwerking' : 'Finish'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'honed' as const, label: 'Honed' },
                      { id: 'polished' as const, label: isNL ? 'Gepolijst' : 'Polished' },
                      { id: 'mat' as const, label: 'Mat' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => updateData('finish', option.id)}
                        className={cn(
                          "px-4 py-2 text-sm border transition-all duration-200",
                          data.finish === option.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-foreground/10 hover:border-foreground/30"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edge profile (optional) */}
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-4">
                    {isNL ? 'Randprofiel (optioneel)' : 'Edge profile (optional)'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'straight', label: isNL ? 'Recht' : 'Straight' },
                      { id: 'beveled', label: isNL ? 'Afgeschuind' : 'Beveled' },
                      { id: 'rounded', label: isNL ? 'Afgerond' : 'Rounded' },
                      { id: 'bullnose', label: 'Bullnose' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => updateData('edgeProfile', option.id)}
                        className={cn(
                          "px-3 py-1.5 text-xs border transition-all duration-200",
                          data.edgeProfile === option.id
                            ? "border-foreground bg-foreground/5"
                            : "border-foreground/10 hover:border-foreground/30"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Customer Story */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* File upload */}
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-4">
                    {isNL ? "Foto's van uw ruimte / inspiratie" : "Photos of your space / inspiration"}
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed p-8 text-center transition-colors",
                      dragActive ? "border-foreground bg-foreground/5" : "border-foreground/20"
                    )}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {isNL ? "Sleep bestanden hierheen of" : "Drag files here or"}
                    </p>
                    <label className="cursor-pointer">
                      <span className="text-sm text-foreground underline underline-offset-2">
                        {isNL ? "kies bestanden" : "choose files"}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </label>
                  </div>
                  
                  {/* Uploaded files */}
                  {data.uploads.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {data.uploads.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-sm"
                        >
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button onClick={() => removeFile(index)}>
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Context */}
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    {isNL ? "Context" : "Context"}
                  </label>
                  <Textarea
                    placeholder={isNL ? "Waar komt het te staan? (1-2 zinnen)" : "Where will it be placed? (1-2 sentences)"}
                    value={data.context}
                    onChange={(e) => updateData('context', e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Wishes */}
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    {isNL ? "Wensen" : "Wishes"}
                  </label>
                  <Textarea
                    placeholder={isNL ? "Must-haves, voorkeuren..." : "Must-haves, preferences..."}
                    value={data.wishes}
                    onChange={(e) => updateData('wishes', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Budget & Deadline (optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                      {isNL ? "Budget indicatie (optioneel)" : "Budget indication (optional)"}
                    </label>
                    <Input
                      placeholder="€ ..."
                      value={data.budgetRange}
                      onChange={(e) => updateData('budgetRange', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                      {isNL ? "Deadline (optioneel)" : "Deadline (optional)"}
                    </label>
                    <Input
                      placeholder={isNL ? "bijv. Q2 2025" : "e.g. Q2 2025"}
                      value={data.deadline}
                      onChange={(e) => updateData('deadline', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="border-t border-foreground/8 p-6 lg:p-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {isNL ? "Vorige" : "Previous"}
        </Button>
        
        {currentStep < TOTAL_STEPS ? (
          <Button
            variant="sera-primary"
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-2"
          >
            {isNL ? "Volgende" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">
            {isNL ? "Bekijk uw dossier hieronder" : "View your dossier below"}
          </div>
        )}
      </div>
    </div>
  );
}

export const initialAtelierFlowData: AtelierFlowData = {
  direction: null,
  inspirationItems: [],
  productType: null,
  productTypeOther: '',
  shape: null,
  dimensions: {
    length: 140,
    width: 80,
    height: 40,
    diameter: 80,
  },
  stone: null,
  finish: null,
  edgeProfile: null,
  uploads: [],
  context: '',
  wishes: '',
  budgetRange: '',
  deadline: '',
};
