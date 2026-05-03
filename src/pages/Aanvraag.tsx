import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/seo";
import { Hairline } from "@/components/ui/hairline";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Choice = { value: string; label: string };

type StepKey = "product" | "stone" | "size" | "leadtime" | "budget" | "contact";

const STEPS: { key: StepKey; label: string; question: string; options?: Choice[] }[] = [
  {
    key: "product",
    label: "Product",
    question: "Welk product wilt u?",
    options: [
      { value: "eettafel", label: "Eettafel" },
      { value: "salontafel", label: "Salontafel" },
      { value: "beide", label: "Beide" },
      { value: "onbekend", label: "Nog niet zeker" },
    ],
  },
  {
    key: "stone",
    label: "Steensoort",
    question: "Welke steensoort spreekt u aan?",
    options: [
      { value: "travertijn", label: "Travertijn" },
      { value: "marmer-licht", label: "Marmer — licht" },
      { value: "marmer-donker", label: "Marmer — donker" },
      { value: "advies", label: "Ik laat me adviseren" },
    ],
  },
  {
    key: "size",
    label: "Afmeting",
    question: "Wat is de beoogde afmeting?",
    options: [
      { value: "klein", label: "Klein — tot 160 cm" },
      { value: "standaard", label: "Standaard — 160 tot 200 cm" },
      { value: "groot", label: "Groot — 200 cm en groter" },
      { value: "onbekend", label: "Weet ik nog niet" },
    ],
  },
  {
    key: "leadtime",
    label: "Levertijd",
    question: "Wat is uw gewenste levertijd?",
    options: [
      { value: "flexibel", label: "Flexibel" },
      { value: "3-4-mnd", label: "3 tot 4 maanden" },
      { value: "kort", label: "Korter dan 3 maanden" },
    ],
  },
  {
    key: "budget",
    label: "Budget",
    question: "Wat is uw budget?",
    options: [
      { value: "1950-3000", label: "€1.950 — €3.000" },
      { value: "3000-5000", label: "€3.000 — €5.000" },
      { value: "5000+", label: "€5.000 en hoger" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    question: "Hoe kunnen we u bereiken?",
  },
];

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Vul uw naam in" })
    .max(100, { message: "Naam is te lang" }),
  email: z
    .string()
    .trim()
    .email({ message: "Vul een geldig e-mailadres in" })
    .max(255, { message: "E-mailadres is te lang" }),
});

type Answers = Partial<Record<StepKey, string>> & { name?: string; email?: string };

export default function Aanvraag() {
  const [params] = useSearchParams();
  const isFounder = params.get("founder") === "true";

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const step = STEPS[stepIdx];
  const total = STEPS.length;
  const progress = ((submitted ? total : stepIdx) / total) * 100;

  function selectOption(value: string) {
    setAnswers((a) => ({ ...a, [step.key]: value }));
    if (stepIdx < total - 1) {
      setTimeout(() => setStepIdx((i) => i + 1), 180);
    }
  }

  function submitContact() {
    const result = contactSchema.safeParse({ name: answers.name ?? "", email: answers.email ?? "" });
    if (!result.success) {
      const fe: { name?: string; email?: string } = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as "name" | "email";
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
    if (b === "5000+") {
      return {
        title: "Wij plannen een persoonlijk gesprek in",
        body: "Verwacht onze uitnodiging binnen 24 uur. U kunt ook direct een moment kiezen via onderstaande agenda.",
        cta: { label: "Plan een gesprek", href: "https://calendly.com/sera-norr/intake" },
      };
    }
    if (b === "3000-5000") {
      return {
        title: "Ons team neemt binnen 24 uur contact op met een voorstel",
        body: "U ontvangt per e-mail een eerste voorstel met passende steensoorten, afmetingen en richtprijs.",
      };
    }
    return {
      title: "Wij sturen u onze exclusieve steencollectie lookbook toe",
      body: "U ontvangt het lookbook met al onze geselecteerde steensoorten en richtprijzen in uw mailbox.",
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
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/50">
                Founder
              </span>
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
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-[-0.01em] text-background leading-[1.1] mb-12">
                  {step.question}
                </h1>

                {step.options && (
                  <div className="space-y-3">
                    {step.options.map((opt) => {
                      const selected = answers[step.key] === opt.value;
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
                          <span className="font-serif text-lg md:text-xl text-background">
                            {opt.label}
                          </span>
                          <span
                            className={cn(
                              "h-5 w-5 border rounded-full flex items-center justify-center shrink-0 transition-all",
                              selected
                                ? "border-background bg-background"
                                : "border-background/30"
                            )}
                          >
                            {selected && <Check className="h-3 w-3 text-foreground" strokeWidth={2.5} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

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
                      {errors.name && (
                        <p className="mt-2 text-xs text-destructive-foreground/90">{errors.name}</p>
                      )}
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
                      {errors.email && (
                        <p className="mt-2 text-xs text-destructive-foreground/90">{errors.email}</p>
                      )}
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
                      stepIdx === 0
                        ? "opacity-30 pointer-events-none"
                        : "text-background/70 hover:text-background"
                    )}
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Terug
                  </button>

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
                    {STEPS.slice(0, 5).map((s) => (
                      <div key={s.key} className="flex justify-between gap-6 border-b border-background/10 py-2">
                        <dt className="text-background/50">{s.label}</dt>
                        <dd className="text-background/90 text-right">
                          {s.options?.find((o) => o.value === answers[s.key])?.label ?? "—"}
                        </dd>
                      </div>
                    ))}
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