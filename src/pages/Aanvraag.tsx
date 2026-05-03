import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Upload, X } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/seo";
import { Hairline } from "@/components/ui/hairline";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type CurrentStep = 1 | 2 | 3 | 4 | 5 | 6;
type StepName = "RUIMTE" | "BUDGET" | "TIJDLIJN" | "LOCATIE" | "FOTO" | "CONTACT";
type Choice = { value: string; label: string };

type FormValues = {
  room: string;
  budget: string;
  timeline: string;
  postcode: string;
  photo: File | null;
  name: string;
  email: string;
  phone: string;
};

const TOTAL_STEPS = 6;

const STEP_NAMES: Record<CurrentStep, StepName> = {
  1: "RUIMTE",
  2: "BUDGET",
  3: "TIJDLIJN",
  4: "LOCATIE",
  5: "FOTO",
  6: "CONTACT",
};

const ROOM_OPTIONS: Choice[] = [
  { value: "eetkamer", label: "Eetkamer" },
  { value: "woonkamer", label: "Woonkamer" },
  { value: "beide-ruimtes", label: "Beide ruimtes" },
  { value: "b2b-project", label: "B2B / Project" },
];

const BUDGET_OPTIONS: Choice[] = [
  { value: "2000-3000", label: "€2.000–3.000" },
  { value: "3000-5000", label: "€3.000–5.000" },
  { value: "5000-8000", label: "€5.000–8.000" },
  { value: "8000-plus", label: "€8.000+" },
  { value: "begeleid", label: "Ik laat me begeleiden" },
];

const TIMELINE_OPTIONS: Choice[] = [
  { value: "binnen-3-maanden", label: "Binnen 3 maanden" },
  { value: "3-6-maanden", label: "3–6 maanden" },
  { value: "meer-dan-6-maanden", label: "Meer dan 6 maanden" },
  { value: "nog-niet-zeker", label: "Nog niet zeker" },
];

const postcodeSchema = z
  .string()
  .trim()
  .regex(/^\d{4}\s?[A-Za-z]{2}$/, { message: "Vul een geldige postcode in, bijvoorbeeld 1234 AB." });

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Vul uw naam in." }).max(100, { message: "Naam is te lang." }),
  email: z.string().trim().email({ message: "Vul een geldig e-mailadres in." }).max(255, { message: "E-mailadres is te lang." }),
  phone: z.string().trim().max(30, { message: "Telefoonnummer is te lang." }).optional().or(z.literal("")),
});

const initialFormValues: FormValues = {
  room: "",
  budget: "",
  timeline: "",
  postcode: "",
  photo: null,
  name: "",
  email: "",
  phone: "",
};

export default function Aanvraag() {
  const [params] = useSearchParams();
  const isFounder = params.get("founder") === "true";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<CurrentStep>(1);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const progress = submitted ? 100 : (currentStep / TOTAL_STEPS) * 100;

  function updateFormValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setFormValues((values) => ({ ...values, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function goToNextStep() {
    setCurrentStep((step) => Math.min(TOTAL_STEPS, step + 1) as CurrentStep);
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(1, step - 1) as CurrentStep);
  }

  function selectChoice(key: "room" | "budget" | "timeline", value: string) {
    updateFormValue(key, value);
    goToNextStep();
  }

  function nextFromPostcode() {
    const result = postcodeSchema.safeParse(formValues.postcode);
    if (!result.success) {
      setErrors({ postcode: result.error.issues[0]?.message ?? "Vul een geldige postcode in." });
      return;
    }
    setErrors({});
    goToNextStep();
  }

  function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors({ photo: "Upload een afbeelding." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ photo: "Bestand mag maximaal 5MB zijn." });
      return;
    }
    setErrors({});
    updateFormValue("photo", file);
  }

  function submitForm() {
    const result = contactSchema.safeParse({
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
    toast({ title: "Aanvraag verstuurd", description: "Bedankt. Wij nemen binnen 24 uur contact met u op." });
  }

  function getChoiceLabel(options: Choice[], value: string) {
    return options.find((option) => option.value === value)?.label ?? "—";
  }

  function renderChoiceButton(option: Choice, selected: boolean, onClick: () => void) {
    return (
      <button
        key={option.value}
        type="button"
        onClick={onClick}
        className={cn(
          "w-full text-left flex items-center justify-between gap-4 px-6 py-5 border transition-all duration-300",
          "border-background/20 hover:border-background/60 hover:bg-background/[0.04]",
          selected && "border-background bg-background/[0.06]"
        )}
      >
        <span className="font-serif text-lg md:text-xl text-background">{option.label}</span>
        <span
          className={cn(
            "h-5 w-5 border rounded-full flex items-center justify-center shrink-0 transition-all",
            selected ? "border-background bg-background" : "border-background/30"
          )}
        >
          {selected && <Check className="h-3 w-3 text-foreground" strokeWidth={2.5} />}
        </span>
      </button>
    );
  }

  function renderStep() {
    if (currentStep === 1) {
      return (
        <div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background leading-[1.1] mb-12">
            Voor welke ruimte is dit?
          </h1>
          <div className="space-y-3">
            {ROOM_OPTIONS.map((option) =>
              renderChoiceButton(option, formValues.room === option.value, () => selectChoice("room", option.value))
            )}
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background leading-[1.1] mb-12">
            Wat is uw budget?
          </h1>
          <div className="space-y-3">
            {BUDGET_OPTIONS.map((option) =>
              renderChoiceButton(option, formValues.budget === option.value, () => selectChoice("budget", option.value))
            )}
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background leading-[1.1] mb-12">
            Wanneer wilt u de tafel hebben?
          </h1>
          <div className="space-y-3">
            {TIMELINE_OPTIONS.map((option) =>
              renderChoiceButton(option, formValues.timeline === option.value, () => selectChoice("timeline", option.value))
            )}
          </div>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background leading-[1.1] mb-10">
            Uw postcode (voor bezorgplanning)
          </h1>
          <Input
            value={formValues.postcode}
            onChange={(event) => updateFormValue("postcode", event.target.value.toUpperCase())}
            maxLength={7}
            placeholder="1234 AB"
            className="h-14 bg-transparent border-x-0 border-t-0 border-b border-background/20 rounded-none px-0 text-background text-lg font-serif placeholder:text-background/30 focus-visible:ring-0 focus-visible:border-background"
          />
          {errors.postcode && <p className="mt-3 text-xs text-background/70">{errors.postcode}</p>}
          <div className="mt-12 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={nextFromPostcode}
              className="border-background/40 text-background hover:bg-background hover:text-foreground"
            >
              Volgende
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (currentStep === 5) {
      return (
        <div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background leading-[1.1] mb-4">
            Upload een foto van uw ruimte (optioneel)
          </h1>
          <p className="font-sans text-sm text-background/60 mb-10">Zo kunnen wij beter inschatten welke steen past.</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          />

          {!formValues.photo ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-background/30 hover:border-background/60 transition-colors px-6 py-12 flex flex-col items-center justify-center gap-3"
            >
              <Upload className="h-6 w-6 text-background/50" />
              <span className="font-sans text-sm text-background/70">Kies een afbeelding</span>
            </button>
          ) : (
            <div className="border border-background/20 px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-sans text-sm text-background truncate">{formValues.photo.name}</p>
                <p className="font-sans text-[11px] text-background/50">
                  {(formValues.photo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateFormValue("photo", null)}
                className="text-background/60 hover:text-background"
                aria-label="Foto verwijderen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {errors.photo && <p className="mt-3 text-xs text-background/70">{errors.photo}</p>}

          <div className="mt-12 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={goToNextStep}
              className="font-sans text-[11px] uppercase tracking-[0.2em] text-background/70 hover:text-background"
            >
              Overslaan
            </button>
            <Button
              type="button"
              variant="outline"
              onClick={goToNextStep}
              className="border-background/40 text-background hover:bg-background hover:text-foreground"
            >
              Volgende
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background leading-[1.1] mb-10">
          Hoe mogen wij u bereiken?
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.3em] text-background/60 mb-3">Naam</label>
            <Input
              value={formValues.name}
              onChange={(event) => updateFormValue("name", event.target.value)}
              maxLength={100}
              placeholder="Uw naam"
              className="h-14 bg-transparent border-x-0 border-t-0 border-b border-background/20 rounded-none px-0 text-background text-lg font-serif placeholder:text-background/30 focus-visible:ring-0 focus-visible:border-background"
            />
            {errors.name && <p className="mt-3 text-xs text-background/70">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.3em] text-background/60 mb-3">
              E-mailadres
            </label>
            <Input
              type="email"
              value={formValues.email}
              onChange={(event) => updateFormValue("email", event.target.value)}
              maxLength={255}
              placeholder="naam@voorbeeld.nl"
              className="h-14 bg-transparent border-x-0 border-t-0 border-b border-background/20 rounded-none px-0 text-background text-lg font-serif placeholder:text-background/30 focus-visible:ring-0 focus-visible:border-background"
            />
            {errors.email && <p className="mt-3 text-xs text-background/70">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.3em] text-background/60 mb-3">
              Telefoonnummer (optioneel)
            </label>
            <Input
              type="tel"
              value={formValues.phone}
              onChange={(event) => updateFormValue("phone", event.target.value)}
              maxLength={30}
              placeholder="+31 6 12 34 56 78"
              className="h-14 bg-transparent border-x-0 border-t-0 border-b border-background/20 rounded-none px-0 text-background text-lg font-serif placeholder:text-background/30 focus-visible:ring-0 focus-visible:border-background"
            />
            {errors.phone && <p className="mt-3 text-xs text-background/70">{errors.phone}</p>}
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={submitForm}
            className="border-background/40 text-background hover:bg-background hover:text-foreground"
          >
            Aanvraag versturen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  function renderSubmittedState() {
    const highBudget = ["5000-8000", "8000-plus", "begeleid"].includes(formValues.budget);
    const midBudget = formValues.budget === "3000-5000";

    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/50 mb-6">
          Bedankt{formValues.name ? `, ${formValues.name.split(" ")[0]}` : ""}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background leading-[1.1] mb-8">
          Bedankt. Wij nemen binnen 24 uur contact met u op.
        </h1>

        {highBudget && (
          <div className="space-y-6">
            <p className="font-sans text-base md:text-lg text-background/70 leading-relaxed max-w-xl">
              Uw aanvraag past bij een persoonlijk ateliergesprek. Plan direct een gratis gesprek van 20 minuten.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background/40 text-background hover:bg-background hover:text-foreground"
            >
              <a href="https://calendly.com/sera-norr/consult" target="_blank" rel="noopener noreferrer">
                Plan een gratis gesprek van 20 minuten
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        )}

        {midBudget && (
          <p className="font-sans text-base md:text-lg text-background/70 leading-relaxed max-w-xl">
            Wij nemen binnen 24 uur contact op voor een persoonlijk voorstel.
          </p>
        )}

        {!highBudget && !midBudget && (
          <div className="space-y-6">
            <p className="font-sans text-base md:text-lg text-background/70 leading-relaxed max-w-xl">
              Wij sturen u het Marmer Atlas 2026 lookbook toe — ons complete materiaaloverzicht.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background/40 text-background hover:bg-background hover:text-foreground"
            >
              <a href="/collections">Bekijk het lookbook</a>
            </Button>
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-background/10">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/50 mb-6">Uw aanvraag</p>
          <dl className="space-y-3 font-sans text-sm">
            <div className="flex justify-between gap-6 border-b border-background/10 py-2">
              <dt className="text-background/50">Ruimte</dt>
              <dd className="text-background/90 text-right">{getChoiceLabel(ROOM_OPTIONS, formValues.room)}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-background/10 py-2">
              <dt className="text-background/50">Budget</dt>
              <dd className="text-background/90 text-right">{getChoiceLabel(BUDGET_OPTIONS, formValues.budget)}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-background/10 py-2">
              <dt className="text-background/50">Tijdlijn</dt>
              <dd className="text-background/90 text-right">{getChoiceLabel(TIMELINE_OPTIONS, formValues.timeline)}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-background/10 py-2">
              <dt className="text-background/50">Postcode</dt>
              <dd className="text-background/90 text-right">{formValues.postcode || "—"}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-background/10 py-2">
              <dt className="text-background/50">Foto</dt>
              <dd className="text-background/90 text-right">{formValues.photo ? formValues.photo.name : "—"}</dd>
            </div>
            {isFounder && (
              <div className="flex justify-between gap-6 border-b border-background/10 py-2">
                <dt className="text-background/50">Programma</dt>
                <dd className="text-background/90 text-right">Founder — 25% korting</dd>
              </div>
            )}
          </dl>
        </div>
      </motion.div>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Aanvraag — Sera Norr"
        description="Persoonlijk voorstel binnen 48 uur. Start uw aanvraag."
        noindex
      />

      <section className="bg-foreground text-background min-h-screen pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
          {isFounder && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 border border-background/20 px-5 py-4 flex items-center gap-3"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/50">Founder</span>
              <Hairline className="flex-1 bg-background/20" />
              <span className="font-sans text-xs text-background/80">
                U vraagt aan als Founder — 25% korting wordt automatisch toegepast.
              </span>
            </motion.div>
          )}

          <div className="mb-12">
            <div className="flex items-center justify-between gap-6 font-sans text-[10px] uppercase tracking-[0.3em] text-background/50 mb-3">
              <span>{submitted ? "VOLTOOID" : `STAP ${currentStep} VAN ${TOTAL_STEPS}`}</span>
              <span>{submitted ? "AANVRAAG" : STEP_NAMES[currentStep]}</span>
            </div>
            <div className="h-px bg-background/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-background"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {submitted ? (
            renderSubmittedState()
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {renderStep()}

              {currentStep > 1 && (
                <div className="mt-12">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-background/70 hover:text-background"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Terug
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
