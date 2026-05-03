import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Hairline } from "@/components/ui/hairline";
import { SEOHead } from "@/components/seo";

const samples = [
  { name: "Travertijn Classico", desc: "warm beige, gevuld, licht gepolijst" },
  { name: "Light Emperador", desc: "warm bruin met goudtinten, Spaans marmer" },
  { name: "Calacatta Viola", desc: "crèmewit, goudgrijze brede aders (Signature)" },
  { name: "Statuario Extra", desc: "bijna wit, fijne grijze aders (Atelier Edition)" },
  { name: "Nero Marquina", desc: "diepzwart, witte aders (toekomstige collectie)" },
  { name: "Verde Alpi", desc: "donkergroen, goud-witte aders (toekomstige collectie)" },
];

const steps = [
  "Bestel de kit (€25, iDEAL of creditcard)",
  "Ontvangst binnen 3–5 werkdagen NL, 5–8 werkdagen EU",
  "Houd de stenen in uw ruimte, in echt licht",
  "Configureer uw tafel online — de €25 wordt automatisch verrekend",
];

export default function SampleKit() {
  return (
    <Layout>
      <SEOHead
        title="Marmer Atlas Sample Kit — Sera Norr"
        description="Zes handgesneden stenen monsters in uw hand, in uw eigen licht. €25, volledig verrekend bij bestelling."
      />

      {/* HERO */}
      <section className="bg-background pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Hairline label="Sample Kit" />
            <h1 className="mt-8 font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] tracking-tight">
              Voel het verschil. Dan beslist u.
            </h1>
            <p className="mt-8 font-serif italic text-2xl md:text-3xl text-muted-foreground leading-relaxed">
              6 stenen. In uw hand. In uw eigen licht.
            </p>
            <p className="mt-10 text-body-lg text-muted-foreground leading-relaxed max-w-2xl">
              Een marmeren tafel van €4.850 koop je niet op basis van een foto. Dat weten wij ook.
              Daarom versturen wij de Marmer Atlas Sample Kit: zes handgesneden monsters van de
              stenen die wij gebruiken, in een presentatie-box van stevig karton. U houdt ze naast
              uw vloer, uw keuken, uw muren. U ziet hoe het licht erop valt in de ochtend en
              's avonds.
            </p>
            <p className="mt-8 font-serif text-xl text-foreground">
              Prijs: <span className="italic">€25</span>. Volledig verrekend bij bestelling van een tafel.
            </p>
            <div className="mt-12">
              <Button asChild size="lg" className="group">
                <Link to="/aanvraag">
                  Bestel de Marmer Atlas Sample Kit
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS IN THE BOX */}
      <section className="bg-secondary/30 border-t border-border py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <Hairline label="In de box" />
          <h2 className="mt-8 font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Zes monsters, zorgvuldig gekozen
          </h2>
          <ol className="mt-12 space-y-6">
            {samples.map((s, i) => (
              <li key={s.name} className="flex gap-6 border-b border-border/50 pb-6">
                <span className="font-serif text-2xl text-muted-foreground/60 tabular-nums shrink-0 w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground">{s.name}</h3>
                  <p className="mt-1 text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-12 text-muted-foreground text-body-md leading-relaxed">
            Tevens inbegrepen: een materiaaldatasheet per steen, onderhoudsadvies en een QR-code
            naar de configurator.
          </p>
        </div>
      </section>

      {/* WHY 25 EURO */}
      <section className="bg-background border-t border-border py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <Hairline label="Waarom €25" />
          <h2 className="mt-8 font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Niet gratis — met opzet.
          </h2>
          <p className="mt-8 text-body-lg text-muted-foreground leading-relaxed">
            Een gratis sample kit trekt mensen aan die nooit gaan kopen. €25 is een commitment-step.
            Wie dit betaalt, is serieus. Het bedrag wordt volledig verrekend bij uw bestelling.
          </p>
          <p className="mt-8 font-serif italic text-sm text-muted-foreground/80">
            Ter vergelijking: het materiaal in de box vertegenwoordigt een inkoopwaarde van ruim €80.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-secondary/30 border-t border-border py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <Hairline label="Zo werkt het" />
          <h2 className="mt-8 font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Vier stappen
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2">
            {steps.map((step, i) => (
              <li key={i} className="border-l border-border pl-6">
                <span className="font-serif text-sm tracking-[0.2em] text-muted-foreground/70 uppercase">
                  Stap {i + 1}
                </span>
                <p className="mt-3 font-serif text-xl text-foreground leading-snug">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SPECS */}
      <section className="bg-background border-t border-border py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="grid gap-10 md:grid-cols-2 text-sm">
            <div>
              <p className="font-sans uppercase tracking-[0.2em] text-xs text-muted-foreground/70">
                Monsters
              </p>
              <p className="mt-3 font-serif text-lg text-foreground">
                10 × 10 cm, dikte 1,5–2 cm
              </p>
            </div>
            <div>
              <p className="font-sans uppercase tracking-[0.2em] text-xs text-muted-foreground/70">
                Verzendkosten
              </p>
              <p className="mt-3 font-serif text-lg text-foreground">
                €4,95 NL · €9,95 EU
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Button asChild size="lg" className="group">
              <Link to="/aanvraag">
                Bestel de Marmer Atlas Sample Kit
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}