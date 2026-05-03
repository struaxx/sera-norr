import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Upload, X } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/seo";
import { Hairline } from "@/components/ui/hairline";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Choice = { value: string; label: string };
type StepKey = "room" | "budget" | "timeline" | "postcode" | "photo" | "contact";

const STEPS: { key: StepKey; label: string; question: string; options?: Choice[] }[] = [
  {
    key: "room",
    label: "Ruimte",
    question: "Voor welke ruimte is dit?",
    options: [
      { value: "eetkamer", label: "Eetkamer" },
      { value: "woonkamer", label: "Woonkamer" },
      { value: "beide", label: "Beide ruimtes" },
      { value: "b2b", label: "B2B / Project" },
    ],
  },
  {
    key: "budget",
    label: "Budget",
    question: "Wat is uw indicatief budget?",
    options: [
      { value: "2000-3000", label: "€2.000 — €3.000" },
      { value: "3000-5000", label: "€3.000 — €5.000" },
      { value: "5000-8000+", label: "€5.000 — €8.000 of meer" },
      { value: "begeleiding", label: "Ik laat me begeleiden" },
    ],
  },
  {
    key: "timeline",
    label: "Tijdlijn",
    question: "Wanneer wilt u de tafel ontvangen?",
    options: [
      { value: "2mnd", label: "Binnen 2 maanden" },
      { value: "3-6mnd", label: "3 tot 6 maanden" },
      { value: "orientatie", label: "Ik oriënteer mij nog" },
    ],
  },
  { key: "postcode", label: "Postcode", question: "Wat is uw postcode?" },
  { key: "photo", label: "Foto", question: "Upload een foto van de ruimte" },
  { key: "contact", label: "Contact", question: "Hoe kunnen we u bereiken?" },
];

const postcodeSchema = z
  .string()
  .trim()
  .regex(/^\d{4}\s?[A-Za-z]{2}$/, { message: "Vul een geldige postcode in (bijv. 1234 AB)" });

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Vul uw naam in" }).max(100, { message: "Naam is te lang" }),
  email: z.string().trim().email({ message: "Vul een geldig e-mailadres in" }).max(255, { message: "E-mailadres is te lang" }),
  phone: z
    .string()
    .trim()
    .max(30, { message: "Telefoonnummer is te lang" })
    .optional()
    .or(z.literal("")),
});

type Answers = {
  room?: string;
  budget?: string;
  timeline?: string;
  postcode?: string;
  photo?: File | null;
  name?: string;
  email?: string;
  phone?: string;
};

export default function Aanvraag() {
  const [params] = useSearchParams();
  const isFounder = params.get("founder") === "true";

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ photo: null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const step = STEPS[stepIdx];
  const total = STEPS.length;
  const progress = ((submitted ? total : stepIdx) / total) * 100;

  function selectOption(value: string) {
    setAnswers((a) => ({ ...a, [step.key]: value }));
    if (stepIdx < total - 1) {
      setTimeout(() => setStepIdx((i) => i + 1), 180);
    }
  }

  function nextFromPostcode() {
    const r = postcodeSchema.safeParse(answers.postcode ?? "");
    if (!r.success) {
      setErrors({ postcode: r.error.issues[0]?.message ?? "Ongeldige postcode" });
      return;
    }
    setErrors({});
    setStepIdx((i) => i + 1);
  }

  function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors({ photo: "Alleen afbeeldingen toegestaan" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ photo: "Bestand mag maximaal 5MB zijn" });
      return;
    }
    setErrors({});
    setAnswers((a) => ({ ...a, photo: file }));
  }

  function submitContact() {
    const result = contactSchema.safeParse({
      name: answers.name ?? "",
      email: answers.email ?? "",
      phone: answers.phone ?? "",
    });
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        const k = String(i.path[0]);
        if (!fe[k]) fe[k] = i.message;
      });
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmitted(true);
    toast({ title: "Aanvraag verstuurd", description: "Wij nemen spoedig contact op." });
  }

  const outcome = useMemo(() => {
    const b = answers.budget;
    if (b === "5000-8000+" || b === "begeleiding") {
      return {
        title: "Plan een gratis gesprek van 20 minuten",
        body: "Tijdens dit korte gesprek bespreken wij uw ruimte, smaak en wensen, en stellen wij een passend voorstel samen.",
        cta: { label: "Plan een gratis gesprek van 20 minuten", href: "https://calendly.com/sera-norr/consult" },
      };
    }
    if (b === "3000-5000") {
      return {
        title: "Wij nemen binnen 24 uur contact op",
        body: "Wij nemen binnen 24 uur contact op voor een persoonlijk voorstel.",
      };
    }
    return {
      title: "Marmer Atlas 2026 onderweg",
      body: "Wij sturen u het Marmer Atlas 2026 lookbook toe — ons complete materiaaloverzicht.",
    };
  }, [answers.budget]);

  return (
    <Layout>
      <SEOHead
        title="Aanvraag — SERA NORR"
        description="Start uw aanvraag voor een maatwerk natuursteenmeubel. Een korte vragenlijst van zes stappen — wij reageren binnen 24 uur."
        noindex
      />

      <section className="bg-foreground text-background min-h-screen pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
          {isFounder && (
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

          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.3em] text-background/50 mb-3">
              <span>{submitted ? "Voltooid" : `Stap ${stepIdx + 1} van ${total}`}</span>
              <span>{step.label}</span>
            </div>
            <div className="h-px bg-background/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-background"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-[-0.01em] text-background leading-[1.1] mb-4">
                  {step.question}
                </h1>

                {step.key === "postcode" && (
                  <p className="font-sans text-sm text-background/60 mb-10">
                    Wij leveren door heel Nederland en België.
                  </p>
                )}
                {step.key === "photo" && (
                  <p className="font-sans text-sm text-background/60 mb-10">
                    Dit helpt ons een beter voorstel te maken (optioneel).
                  </p>
                )}
                {(step.key !== "postcode" && step.key !== "photo") && <div className="mb-12" />}

                {/* Choice options */}
                {step.options && (
                  <div className="space-y-3">
                    {step.options.map((opt) => {
                      const selected = (answers as Record<string, unknown>)[step.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => selectOption(opt.value)}
                          className={cn(
                            "w-full text-left flex items-center justify-between gap-4 px-6 py-5 border transition-all duration-300",
                            "border-background/20 hover:border-background/60 hover:bg-background/[0.04]",
                            selected && "border-background bg-background/[0.06]"
                          )}
                        >
                          <span className="font-serif text-lg md:text-xl text-background">{opt.label}</span>
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
                    })}
                  </div>
                )}

                {/* Postcode */}
                {step.key === "postcode" && (
                  <div>
                    <Input
                      value={answers.postcode ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, postcode: e.target.value.toUpperCase() }))}
                      maxLength={7}
                      placeholder="1234 AB"
                      className="h-14 bg-transparent border-x-0 border-t-0 border-b border-background/20 rounded-none px-0 text-background text-lg font-serif placeholder:text-background/30 focus-visible:ring-0 focus-visible:border-background"
                    />
                    {errors.postcode && (
                      <p className="mt-2 text-xs text-destructive-foreground/90">{errors.postcode}</p>
                    )}
                  </div>
                )}

                {/* Photo upload */}
                {step.key === "photo" && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />
                    {!answers.photo ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border border-dashed border-background/30 hover:border-background/60 transition-colors px-6 py-12 flex flex-col items-center justify-center gap-3"
                      >
                        <Upload className="h-6 w-6 text-background/50" />
                        <span className="font-sans text-sm text-background/70">Kies een afbeelding (max 5MB)</span>
                      </button>
                    ) : (
                      <div className="border border-background/20 px-5 py-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-sans text-sm text-background truncate">{answers.photo.name}</p>
                          <p className="font-sans text-[11px] text-background/50">
                            {(answers.photo.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAnswers((a) => ({ ...a, photo: null }))}
                          className="text-background/60 hover:text-background"
                          aria-label="Verwijderen"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {errors.photo && (
                      <p className="mt-2 text-xs text-destructive-foreground/90">{errors.photo}</p>
                    )}
                  </div>
                )}

                {/* Contact */}
                {step.key === "contact" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-[0.3em] text-background/60 mb-3">
                        Naam
                      </label>
                      <Input
                        value={answers.name ?? ""}
                        onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
                        maxLength={100}
                        placeholder="Uw naam"
                        className="h-14 bg-transparent border-x-0 border-t-0 border-b border-background/20 rounded-none px-0 text-background text-lg font-serif placeholder:text-background/30 focus-visible:ring-0 focus-visible:border-background"
                      />
                      {errors.name && <p className="mt-2 text-xs text-destructive-foreground/90">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-[0.3em] text-background/60 mb-3">
                        E-mailadres
                      </label>
                      <Input
                        type="email"
                        value={answers.email ?? ""}
                        onChange={(e) => setAnswers((a) => ({ ...a, email: e.target.value }))}
                        maxLength={255}
                        placeholder="naam@voorbeeld.nl"
                        className="h-14 bg-transparent border-x-0 border-t-0 border-b border-background/20 rounded-none px-0 text-background text-lg font-serif placeholder:text-background/30 focus-visible:ring-0 focus-visible:border-background"
                      />
                      {errors.email && <p className="mt-2 text-xs text-destructive-foreground/90">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-[0.3em] text-background/60 mb-3">
                        Telefoonnummer (optioneel)
                      </label>
                      <Input
                        type="tel"
                        value={answers.phone ?? ""}
                        onChange={(e) => setAnswers((a) => ({ ...a, phone: e.target.value }))}
                        maxLength={30}
                        placeholder="+31 6 12 34 56 78"
                        className="h-14 bg-transparent border-x-0 border-t-0 border-b border-background/20 rounded-none px-0 text-background text-lg font-serif placeholder:text-background/30 focus-visible:ring-0 focus-visible:border-background"
                      />
                      {errors.phone && <p className="mt-2 text-xs text-destructive-foreground/90">{errors.phone}</p>}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-12 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={stepIdx === 0}
                    onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                    className={cn(
                      "inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] transition-opacity",
                      stepIdx === 0 ? "opacity-30 pointer-events-none" : "text-background/70 hover:text-background"
                    )}
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Terug
                  </button>

                  {step.key === "postcode" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={nextFromPostcode}
                      className="border-background/40 text-background hover:bg-background hover:text-foreground"
                    >
                      Volgende
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {step.key === "photo" && (
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setStepIdx((i) => i + 1)}
                        className="font-sans text-[11px] uppercase tracking-[0.2em] text-background/70 hover:text-background"
                      >
                        Overslaan
                      </button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStepIdx((i) => i + 1)}
                        disabled={!answers.photo}
                        className="border-background/40 text-background hover:bg-background hover:text-foreground"
                      >
                        Volgende
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {step.key === "contact" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={submitContact}
                      className="border-background/40 text-background hover:bg-background hover:text-foreground"
                    >
                      Aanvraag versturen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="outcome"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/50 mb-6">
                  Bedankt, {answers.name?.split(" ")[0]}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-[-0.01em] text-background leading-[1.1] mb-8">
                  {outcome.title}
                </h2>
                <p className="font-sans text-base md:text-lg text-background/70 leading-relaxed max-w-xl mb-12">
                  {outcome.body}
                </p>

                {outcome.cta && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-background/40 text-background hover:bg-background hover:text-foreground"
                  >
                    <a href={outcome.cta.href} target="_blank" rel="noopener noreferrer">
                      {outcome.cta.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                {/* Recap */}
                <div className="mt-16 pt-10 border-t border-background/10">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/50 mb-6">
                    Uw aanvraag
                  </p>
                  <dl className="space-y-3 font-sans text-sm">
                    {STEPS.filter((s) => s.options).map((s) => (
                      <div key={s.key} className="flex justify-between gap-6 border-b border-background/10 py-2">
                        <dt className="text-background/50">{s.label}</dt>
                        <dd className="text-background/90 text-right">
                          {s.options?.find((o) => o.value === (answers as Record<string, unknown>)[s.key])?.label ?? "—"}
                        </dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-6 border-b border-background/10 py-2">
                      <dt className="text-background/50">Postcode</dt>
                      <dd className="text-background/90 text-right">{answers.postcode ?? "—"}</dd>
                    </div>
                    <div className="flex justify-between gap-6 border-b border-background/10 py-2">
                      <dt className="text-background/50">Foto</dt>
                      <dd className="text-background/90 text-right">{answers.photo ? answers.photo.name : "—"}</dd>
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
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
