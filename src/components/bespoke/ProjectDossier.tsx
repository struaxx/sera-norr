import { cn } from "@/lib/utils";
import { FileText, Ruler, Mountain, Image, User } from "lucide-react";
import type { AtelierFlowData } from "./AtelierFlow";

interface ProjectDossierProps {
  isNL: boolean;
  data: AtelierFlowData;
  contactData: {
    name: string;
    email: string;
    phone: string;
  };
  className?: string;
}

export function ProjectDossier({ isNL, data, contactData, className }: ProjectDossierProps) {
  const directionLabels: Record<string, string> = {
    'vanta': 'VANTA: Calacatta Viola',
    'terra': 'TERRA: Travertin',
    'other': isNL ? 'Eigen richting' : 'Own direction',
  };

  const productTypeLabels: Record<string, string> = {
    'dining-table': isNL ? 'Eettafel' : 'Dining table',
    'coffee-table': isNL ? 'Salontafel' : 'Coffee table',
    'console': 'Console',
    'tv-meubel': 'TV-meubel',
    'side-table': isNL ? 'Bijzettafel' : 'Side table',
    'other': data.productTypeOther || (isNL ? 'Anders' : 'Other'),
  };

  const shapeLabels: Record<string, string> = {
    'rectangular': isNL ? 'Rechthoek' : 'Rectangle',
    'round': isNL ? 'Rond' : 'Round',
    'oval': isNL ? 'Ovaal' : 'Oval',
    'organic': isNL ? 'Organisch' : 'Organic',
  };

  const stoneLabels: Record<string, string> = {
    'calacatta-viola': 'Calacatta Viola',
    'travertin': 'Travertin',
    'other': isNL ? 'Overig (op aanvraag)' : 'Other (on request)',
  };

  const finishLabels: Record<string, string> = {
    'honed': 'Honed',
    'polished': isNL ? 'Gepolijst' : 'Polished',
    'mat': 'Mat',
  };

  const edgeLabels: Record<string, string> = {
    'straight': isNL ? 'Recht' : 'Straight',
    'beveled': isNL ? 'Afgeschuind' : 'Beveled',
    'rounded': isNL ? 'Afgerond' : 'Rounded',
    'bullnose': 'Bullnose',
  };

  const getDimensionString = () => {
    if (data.shape === 'round') {
      return `Ø${data.dimensions.diameter} × H${data.dimensions.height} cm`;
    }
    return `L${data.dimensions.length} × B${data.dimensions.width} × H${data.dimensions.height} cm`;
  };

  const isComplete = data.direction && data.productType && data.shape && data.stone;

  return (
    <div className={cn("border border-foreground/8 bg-background", className)}>
      {/* Header */}
      <div className="border-b border-foreground/8 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-5 h-5 text-foreground/40" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {isNL ? 'Uw selectie' : 'Your selection'}
          </span>
        </div>
        <h3 className="font-serif text-xl lg:text-2xl text-foreground">
          SERA NORR Project Dossier
        </h3>
      </div>

      {/* Dossier cards */}
      <div className="divide-y divide-foreground/8">
        {/* Card 1: Direction */}
        <div className="p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-secondary/50 flex items-center justify-center shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">01</span>
            </div>
            <div className="flex-1">
              <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                {isNL ? 'Richting' : 'Direction'}
              </h4>
              <p className="font-serif text-lg text-foreground">
                {data.direction ? directionLabels[data.direction] : (
                  <span className="text-muted-foreground/50">{isNL ? 'Niet geselecteerd' : 'Not selected'}</span>
                )}
              </p>
              {data.inspirationItems.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  + {data.inspirationItems.length} {isNL ? 'inspiratie items' : 'inspiration items'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Specifications */}
        <div className="p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-secondary/50 flex items-center justify-center shrink-0">
              <Ruler className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
                {isNL ? 'Specificaties' : 'Specifications'}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-0.5">{isNL ? 'Type' : 'Type'}</span>
                  <span className="text-foreground">
                    {data.productType ? productTypeLabels[data.productType] : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">{isNL ? 'Vorm' : 'Shape'}</span>
                  <span className="text-foreground">
                    {data.shape ? shapeLabels[data.shape] : '—'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block mb-0.5">{isNL ? 'Afmetingen' : 'Dimensions'}</span>
                  <span className="text-foreground">
                    {data.shape ? getDimensionString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Stone & Finish */}
        <div className="p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-secondary/50 flex items-center justify-center shrink-0">
              <Mountain className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
                {isNL ? 'Steen & afwerking' : 'Stone & finish'}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-0.5">{isNL ? 'Steensoort' : 'Stone'}</span>
                  <span className="text-foreground">
                    {data.stone ? stoneLabels[data.stone] : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">{isNL ? 'Afwerking' : 'Finish'}</span>
                  <span className="text-foreground">
                    {data.finish ? finishLabels[data.finish] : '—'}
                  </span>
                </div>
                {data.edgeProfile && (
                  <div>
                    <span className="text-muted-foreground block mb-0.5">{isNL ? 'Randprofiel' : 'Edge'}</span>
                    <span className="text-foreground">{edgeLabels[data.edgeProfile]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Your Space */}
        <div className="p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-secondary/50 flex items-center justify-center shrink-0">
              <Image className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
                {isNL ? 'Uw ruimte' : 'Your space'}
              </h4>
              <div className="space-y-3 text-sm">
                {data.uploads.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-1">{isNL ? 'Uploads' : 'Uploads'}</span>
                    <span className="text-foreground">{data.uploads.length} {isNL ? 'bestand(en)' : 'file(s)'}</span>
                  </div>
                )}
                {data.context && (
                  <div>
                    <span className="text-muted-foreground block mb-1">Context</span>
                    <p className="text-foreground">{data.context}</p>
                  </div>
                )}
                {data.wishes && (
                  <div>
                    <span className="text-muted-foreground block mb-1">{isNL ? 'Wensen' : 'Wishes'}</span>
                    <p className="text-foreground">{data.wishes}</p>
                  </div>
                )}
                {(data.budgetRange || data.deadline) && (
                  <div className="flex gap-6">
                    {data.budgetRange && (
                      <div>
                        <span className="text-muted-foreground block mb-1">Budget</span>
                        <span className="text-foreground">{data.budgetRange}</span>
                      </div>
                    )}
                    {data.deadline && (
                      <div>
                        <span className="text-muted-foreground block mb-1">Deadline</span>
                        <span className="text-foreground">{data.deadline}</span>
                      </div>
                    )}
                  </div>
                )}
                {!data.uploads.length && !data.context && !data.wishes && (
                  <span className="text-muted-foreground/50">{isNL ? 'Geen informatie toegevoegd' : 'No information added'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Contact */}
        <div className="p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-secondary/50 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
                Contact
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-foreground">
                  {contactData.name || <span className="text-muted-foreground/50">{isNL ? 'Naam invullen' : 'Enter name'}</span>}
                </p>
                <p className="text-muted-foreground">
                  {contactData.email || <span className="text-muted-foreground/50">{isNL ? 'E-mail invullen' : 'Enter email'}</span>}
                </p>
                {contactData.phone && (
                  <p className="text-muted-foreground">{contactData.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion status */}
      {!isComplete && (
        <div className="border-t border-foreground/8 p-6 lg:p-8 bg-secondary/20">
          <p className="text-sm text-muted-foreground text-center">
            {isNL 
              ? "Vul alle stappen in om uw dossier compleet te maken" 
              : "Complete all steps to finalize your dossier"}
          </p>
        </div>
      )}
    </div>
  );
}
