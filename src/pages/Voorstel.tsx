import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEOHead, generateBreadcrumbSchema } from "@/components/seo";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowRight } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import {
  STONE_OPTIONS,
  SHAPE_OPTIONS,
  LEG_STYLE_OPTIONS,
} from "@/components/configurator/options";
import { computeRange } from "@/components/configurator/pricing";

const FINISH_LABELS: Record<string, string> = {
  gepolijst: "Gepolijst",
  gezoet: "Gezoet",
};

const shapeCode = (id: string) => {
  switch (id) {
    case "round": return "RO";
    case "ovale": return "OV";
    case "ellips": return "EL";
    case "corner": return "RE";
    default: return "XX";
  }
};

const stoneCode = (id: string) => {
  const map: Record<string, string> = {
    "classic-cloudy": "CC",
    "tiramisu": "TI",
    "light-emprador": "LE",
    "dark-emperador": "DE",
    "calacatta-viola": "CV",
  };
  return map[id] ?? "XX";
};

const Voorstel = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === "nl";
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    notes: "",
    honeypot: "",
  });

  // Read configuration from URL
  const stoneId = searchParams.get("stoneId") ?? "calacatta-viola";
  const shape = searchParams.get("shape") ?? "corner";
  const lengthMm = Number(searchParams.get("lengthMm") ?? 2200);
  const widthMm = Number(searchParams.get("widthMm") ?? 1000);
  const legCount = (Number(searchParams.get("legCount") ?? 2) as 1 | 2 | 4);
  const legStyle = searchParams.get("legStyle") ?? "cylindrical";
  const rawFinish = searchParams.get("finish") ?? "gepolijst";
  // Defensive: unknown finish keys (e.g. legacy `geborsteld` URLs) fall back to gepolijst.
  const finish = rawFinish in FINISH_LABELS ? rawFinish : "gepolijst";

  const stone = STONE_OPTIONS.find((s) => s.id === stoneId);
  const shapeOpt = SHAPE_OPTIONS.find((s) => s.id === shape);
  const legStyleOpt = LEG_STYLE_OPTIONS.find((o) => o.id === legStyle);

  const stoneLabel = stone?.label ?? stoneId;
  const shapeLabel = shapeOpt?.label ?? shape;
  const finishLabel = FINISH_LABELS[finish] ?? "Gepolijst";
  const legStyleLabel = legStyleOpt?.label ?? legStyle;

  const dimensions =
    shape === "round"
      ? `⌀ ${(lengthMm / 10).toFixed(0)} cm`
      : `${(lengthMm / 10).toFixed(0)} × ${(widthMm / 10).toFixed(0)} cm`;

  const onderstel = `${legCount} × ${legStyleLabel}`;

  const range = useMemo(
    () => computeRange({ stoneId, lengthMm, widthMm, legCount, finish: finish as any }),
    [stoneId, lengthMm, widthMm, legCount, finish]
  );

  const dossierCode = `SN-${shapeCode(shape)}-${stoneCode(stoneId)}-${(lengthMm / 10).toFixed(0)}x${(widthMm / 10).toFixed(0)}`;

  const dossier = [
    { label: "Vorm", value: shapeLabel },
    { label: "Afmetingen", value: dimensions },
    { label: "Steensoort", value: stoneLabel },
    { label: "Afwerking", value: finishLabel },
    { label: "Onderstel", value: onderstel },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: isNL ? "Ongeldig e-mailadres" : "Invalid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const metadata = {
        dossierCode,
        stoneId,
        stone: stoneLabel,
        shape,
        shapeLabel,
        lengthMm,
        widthMm,
        dimensions,
        legCount,
        legStyle,
        onderstel,
        finish,
        finishLabel,
        indicatieLow: range.low,
        indicatieHigh: range.high,
        postcode: formData.postcode,
      };

      const { error } = await supabase.functions.invoke("submit-form", {
        body: {
          form_type: "voorstel",
          email: formData.email,
          phone: formData.phone,
          message: formData.notes,
          metadata,
          honeypot: formData.honeypot,
        },
      });
      if (error) throw error;

      trackLeadSubmit("voorstel" as const, {
        productType: "tafel",
        stone: stoneLabel,
      });

      setSubmitted(true);
      toast({
        title: isNL ? "Aanvraag ontvangen" : "Request received",
        description: isNL
          ? "Wij nemen zo spoedig mogelijk contact met u op."
          : "We will be in touch as soon as possible.",
      });
    } catch (err: any) {
      if (import.meta.env.DEV) console.error("Submit error", err);
      toast({
        title: isNL ? "Verzenden mislukt" : "Submission failed",
        description: isNL ? "Probeer het opnieuw." : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoTitle = isNL
    ? "Uw voorstel — Sera Norr"
    : "Your proposal — Sera Norr";
  const seoDescription = isNL
    ? "Bekijk uw configuratie en vraag vrijblijvend een persoonlijk voorstel aan."
    : "Review your configuration and request a personal proposal.";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: isNL ? "Voorstel" : "Proposal", url: "/voorstel" },
  ]);

  if (submitted) {
    return (
      <Layout>
        <SEOHead title={seoTitle} description={seoDescription} structuredData={breadcrumbSchema} />
        <section className="pt-28 lg:pt-36 pb-16 lg:pb-24 bg-background min-h-screen">
          <div className="container mx-auto px-6 lg:px-12 max-w-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-display-sm text-foreground mb-3">
              {isNL ? "Aanvraag ontvangen" : "Request received"}
            </h1>
            <p className="text-muted-foreground text-body-md mb-2">
              {isNL
                ? "Dank u. Wij nemen zo spoedig mogelijk contact met u op."
                : "Thank you. We will be in touch as soon as possible."}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-6">
              {isNL ? "Dossiernummer" : "Dossier number"}
            </p>
            <p className="font-mono text-lg text-foreground">{dossierCode}</p>
            <div className="mt-10">
              <Button asChild variant="atelier">
                <Link to="/collections">
                  {isNL ? "Bekijk stijlcollecties" : "View style collections"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title={seoTitle} description={seoDescription} structuredData={breadcrumbSchema} />
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <header className="mb-10">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {isNL ? "Uw configuratie" : "Your configuration"}
            </p>
            <h1 className="font-serif text-display-sm lg:text-display-md text-foreground mb-4">
              {isNL ? "Vraag vrijblijvend voorstel aan" : "Request a personal proposal"}
            </h1>
            <p className="text-muted-foreground text-body-md max-w-xl">
              {isNL
                ? "Hieronder vindt u de samenvatting van uw ontwerp. Vul uw gegevens in en wij sturen u een voorstel op maat."
                : "Below is the summary of your design. Share your details and we will send you a tailored proposal."}
            </p>
          </header>

          {/* Dossier */}
          <div className="border border-border/60 rounded-sm p-6 mb-10 bg-secondary/20">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-serif text-xl text-foreground">{isNL ? "Dossier" : "Dossier"}</h2>
              <span className="font-mono text-xs text-muted-foreground">{dossierCode}</span>
            </div>
            <dl className="space-y-3">
              {dossier.map((row) => (
                <div key={row.label} className="flex justify-between border-b border-border/30 pb-2 text-sm">
                  <dt className="text-muted-foreground uppercase tracking-[0.1em] text-xs">{row.label}</dt>
                  <dd className="text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 pt-4 border-t border-border/40">
              <span className="block text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                {isNL ? "Indicatie" : "Indication"}
              </span>
              <div className="font-serif text-2xl text-foreground">
                €{range.low.toLocaleString("nl-NL")} – €{range.high.toLocaleString("nl-NL")}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isNL
                  ? "Inclusief BTW · Transport inbegrepen · Exacte prijs in uw voorstel."
                  : "Incl. VAT · Transport included · Exact price in your proposal."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website-voorstel">Website</label>
              <input
                id="website-voorstel"
                type="text"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <Label htmlFor="name">{isNL ? "Naam" : "Name"} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">{isNL ? "E-mail" : "Email"} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">
                {isNL ? "Telefoon" : "Phone"}{" "}
                <span className="text-muted-foreground text-xs">({isNL ? "optioneel" : "optional"})</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="postcode">
                {isNL ? "Postcode" : "Postcode"}{" "}
                <span className="text-muted-foreground text-xs">({isNL ? "optioneel" : "optional"})</span>
              </Label>
              <Input
                id="postcode"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">{isNL ? "Opmerkingen" : "Notes"}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder={isNL ? "Bijzondere wensen of vragen…" : "Special requests or questions…"}
              />
            </div>

            <Button type="submit" variant="atelier-filled" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting
                ? (isNL ? "Verzenden…" : "Submitting…")
                : (isNL ? "Vraag vrijblijvend voorstel aan" : "Request a personal proposal")}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Voorstel;
