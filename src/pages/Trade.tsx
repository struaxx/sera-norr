import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { MicroLabel } from "@/components/ui/hairline";
import { SEOHead } from "@/components/seo";

const audience = [
  {
    n: "01",
    title: "Interieurontwerpers",
    desc: "Die stenen tafels als statement-piece inzetten in woonprojecten.",
  },
  {
    n: "02",
    title: "Architecten",
    desc: "Die maatwerkoplossingen zoeken voor high-end residentieel werk.",
  },
  {
    n: "03",
    title: "Projectontwikkelaars",
    desc: "Die premium meubels nodig hebben voor show-units en verhuurobjecten.",
  },
];

const tiers = [
  { label: "Omzet per jaar", preferred: "1–3 stuks", partner: "4–8 stuks", premier: "9+ stuks" },
  { label: "Korting", preferred: "20%", partner: "25–30%", premier: "30–35%" },
  { label: "Levertijd", preferred: "Standaard 12–16 wk", partner: "Prioriteit 10–14 wk", premier: "Expedite optie 8 wk" },
  { label: "Slab selectie", preferred: "Standaard", partner: "Pre-selectie", premier: "Persoonlijke slab-visit" },
  { label: "Dedicated contact", preferred: "Nee", partner: "Ja", premier: "Ja — directe lijn" },
];

const included = [
  "PDF materiaalstaten per steensoort (voor bestek en specificaties)",
  "Sample kit gratis bij eerste aanvraag (waarde €25)",
  "Projectprijzen op aanvraag voor orders 4+ stuks",
  "NDA beschikbaar voor confidentieel ontwerpwerk",
];

export default function Trade() {
  return (
    <Layout>
      <SEOHead
        title="Trade Program — Sera Norr"
        description="Voor interieurontwerpers, architecten en projectontwikkelaars. Trade-tarieven, prioriteit en persoonlijke slab-selectie."
        noindex
      />

      {/* HERO */}
      <section className="bg-foreground text-background pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <MicroLabel variant="dark">Trade Program</MicroLabel>
            <h1 className="mt-8 font-serif text-5xl md:text-6xl lg:text-7xl text-background leading-[1.05] tracking-tight">
              Ontworpen door u. Gemaakt door ons.
            </h1>
            <p className="mt-8 font-serif italic text-2xl md:text-3xl text-background/70 leading-relaxed">
              Sera Norr Trade Program — voor interieurontwerpers, architecten en projectontwikkelaars.
            </p>
            <div className="mt-12">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background/40 text-background hover:bg-background hover:text-foreground group"
              >
                <Link to="/aanvraag">
                  Trade toegang aanvragen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="bg-background border-t border-border py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <MicroLabel>Voor wie</MicroLabel>
          <h2 className="mt-8 font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Drie soorten partners
          </h2>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {audience.map((a) => (
              <div key={a.n} className="border-l border-border pl-6">
                <span className="font-serif text-3xl text-muted-foreground/60 tabular-nums">{a.n}</span>
                <h3 className="mt-4 font-serif text-xl text-foreground">{a.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS TABLE */}
      <section className="bg-secondary/30 border-t border-border py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <MicroLabel>Tiers</MicroLabel>
          <h2 className="mt-8 font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Drie niveaus van samenwerking
          </h2>

          <div className="mt-16 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-5 pr-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70" />
                  <th className="py-5 px-4 font-serif text-xl text-foreground">Preferred</th>
                  <th className="py-5 px-4 font-serif text-xl text-foreground">Partner</th>
                  <th className="py-5 px-4 font-serif text-xl text-foreground">Premier</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((row) => (
                  <tr key={row.label} className="border-b border-border/60 align-top">
                    <td className="py-5 pr-4 font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                      {row.label}
                    </td>
                    <td className="py-5 px-4 font-serif text-base text-foreground">{row.preferred}</td>
                    <td className="py-5 px-4 font-serif text-base text-foreground">{row.partner}</td>
                    <td className="py-5 px-4 font-serif text-base text-foreground">{row.premier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section className="bg-background border-t border-border py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <MicroLabel>Inbegrepen</MicroLabel>
          <h2 className="mt-8 font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Wat het Trade Program biedt
          </h2>
          <ul className="mt-12 space-y-5">
            {included.map((item) => (
              <li key={item} className="flex gap-4 border-b border-border/50 pb-5">
                <span className="font-serif text-muted-foreground/60 mt-1">—</span>
                <span className="font-serif text-lg text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW TO APPLY */}
      <section className="bg-foreground text-background border-t border-border py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <MicroLabel variant="dark">Aanvragen</MicroLabel>
          <h2 className="mt-8 font-serif text-4xl md:text-5xl text-background leading-tight">
            Hoe u aansluit
          </h2>
          <p className="mt-8 font-serif text-xl text-background/70 leading-relaxed">
            Stuur een korte introductie via het aanvraagformulier. Selecteer{" "}
            <span className="italic">B2B / Project</span> als ruimtetype.
          </p>
          <div className="mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/40 text-background hover:bg-background hover:text-foreground group"
            >
              <Link to="/aanvraag?type=trade">
                Trade toegang aanvragen
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}