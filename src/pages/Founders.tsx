import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Hairline } from "@/components/ui/hairline";
import { SEOHead } from "@/components/seo";

// Pas dit handmatig aan zodra plekken geclaimd zijn
const FOUNDERS_REMAINING = 12;
const FOUNDERS_TOTAL = 12;

const benefits = [
  {
    title: "25% Founders korting",
    desc: "Op de normale atelierprijs. Een tafel van €8.500 wordt €6.375.",
  },
  {
    title: "Genummerde bronzen plaquette",
    desc: "Onder uw tafel — 1/12 t/m 12/12. Een blijvend bewijs dat u tot de eerste twaalf behoort.",
  },
  {
    title: "Portfolio fotoshoot",
    desc: "Wij fotograferen het eindresultaat in uw interieur voor het SERA NORR portfolio.",
  },
  {
    title: "Lifetime toegang nieuwe steencollecties",
    desc: "Founders krijgen als eerste inzage in nieuwe steensoorten en zeldzame slabs.",
  },
];

const reviews = [
  {
    quote:
      "De rust en eerlijkheid van het atelier sprak ons direct aan. Geen verkoopdruk — alleen vakmanschap en dialoog.",
    name: "M. & J. van der Velde",
    location: "Amsterdam",
  },
  {
    quote:
      "Een tafel die elk diner een ander gesprek wordt. De Calacatta Viola voelt als een kunstwerk dat we elke dag gebruiken.",
    name: "L. Bakker",
    location: "Wassenaar",
  },
];

export default function Founders() {
  return (
    <Layout>
      <SEOHead
        title="Founders Programma — 25% Korting | Sera Norr"
        description="Word een van de 12 Founders. 25% korting, genummerde plaquette, persoonlijke fotoshoot."
      />

      {/* Hero */}
      <section className="relative pt-40 pb-24 lg:pt-52 lg:pb-32 bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--background)/0.08),transparent_60%)]" />
        <div className="container relative mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-sans text-[11px] uppercase tracking-[0.3em] text-background/60 mb-8"
          >
            Founders Programma — Eenmalig
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-[-0.02em] leading-[1.05] text-background mb-8"
          >
            Word een van de 12 Founders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif italic text-xl md:text-2xl text-background/80 mb-6"
          >
            Niet namens een merk. Namens mezelf.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base md:text-lg text-background/70 leading-relaxed max-w-2xl mx-auto"
          >
            Een eenmalige uitnodiging aan de eerste twaalf klanten om deel uit te
            maken van het SERA NORR verhaal. Wie nu instapt, vormt mee aan wat
            volgt — en draagt voor altijd een genummerde plaquette onder zijn tafel.
          </motion.p>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 inline-flex flex-col items-center gap-3 border border-background/15 px-10 py-6"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/50">
              Beschikbaarheid
            </span>
            <span className="font-serif text-3xl md:text-4xl text-background">
              Nog {FOUNDERS_REMAINING} van de {FOUNDERS_TOTAL} plekken beschikbaar
            </span>
          </motion.div>

          <div className="mt-12">
            <Button asChild variant="outline" size="lg" className="border-background/40 text-background hover:bg-background hover:text-foreground">
              <Link to="/contact?subject=founders">
                Word Founder — Claim uw plek
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-background py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <Hairline className="mx-auto mb-6" />
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Wat Founders krijgen
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[-0.01em] text-foreground">
              Vier blijvende voordelen
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
            {benefits.map((b) => (
              <div key={b.title} className="bg-background p-10">
                <Check className="h-5 w-5 text-foreground/60 mb-5" strokeWidth={1.5} />
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {b.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Price example */}
          <div className="mt-16 border border-foreground/10 p-10 md:p-14 text-center bg-foreground/[0.02]">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Rekenvoorbeeld
            </p>
            <div className="flex items-baseline justify-center gap-6 flex-wrap">
              <span className="font-serif text-2xl text-muted-foreground line-through decoration-1">
                €8.500
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-serif text-4xl md:text-5xl text-foreground">
                €6.375
              </span>
            </div>
            <p className="mt-6 font-sans text-sm text-muted-foreground">
              Een Calacatta Viola eettafel als Founder — 25% onder de atelierprijs.
            </p>
          </div>

          <p className="mt-16 max-w-2xl mx-auto text-center font-serif italic text-sm text-muted-foreground leading-relaxed">
            Ter vergelijking: een Bulthaup-keuken met marmeren werkblad start bij €35.000.
            Een Founders-tafel van Sera Norr — op maat, bookmatched, levenslang —
            kost €6.375 (Founders-korting van 25% op €8.500).
          </p>

          <div className="mt-8 text-center">
            <Button asChild variant="sera-primary" size="lg">
              <Link to="/contact?subject=founders">
                Word Founder — Claim uw plek
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Founder profile */}
      <section className="bg-background border-t border-foreground/10 py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Over de oprichter
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[-0.01em] text-foreground">
              Wie staat er achter Sera Norr
            </h2>
          </div>

          <div className="grid md:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">
            <div
              className="bg-foreground/5 border border-foreground/10 flex items-center justify-center text-muted-foreground font-sans text-xs uppercase tracking-[0.25em]"
              style={{ width: "100%", maxWidth: 300, aspectRatio: "3 / 4" }}
            >
              Foto Laurens
            </div>
            <div>
              <h3 className="font-serif text-3xl md:text-4xl tracking-[-0.01em] text-foreground mb-2">
                Laurens Soedito
              </h3>
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
                Oprichter Sera Norr · Managing Director Ls Capital
              </p>
              <p className="font-sans text-base text-foreground/80 leading-relaxed mb-5">
                Via Ls Capital heb ik de afgelopen jaren tientallen high-end interieurbouw-projecten
                begeleid in Nederland. Ik ken de markt, de leveranciers, en de standaard die
                premium kopers verwachten. Sera Norr is het logische vervolg: hetzelfde niveau,
                maar in natuursteen.
              </p>
              <p className="font-sans text-base text-foreground/80 leading-relaxed">
                Dat betekent dat u niet met een webshop te maken heeft, maar met iemand die uw
                investering begrijpt en persoonlijk verantwoordelijk is voor het eindresultaat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Guarantee */}
      <section className="bg-foreground text-background py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="border border-background/20 p-10 md:p-14">
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-background/50 mb-6">
              Founders Guarantee
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[-0.01em] text-background mb-8 leading-tight">
              Mijn persoonlijke garantie
            </h2>
            <p className="font-sans text-base md:text-lg text-background/80 leading-relaxed mb-10">
              Ik sta met mijn naam voor elk stuk dat wij leveren. Niet tevreden binnen 30 dagen
              na levering? Volledig terugbetaald, ophalen op mijn kosten. Geen procedure,
              geen discussie.
            </p>
            <div className="pt-8 border-t border-background/15">
              <p className="font-serif italic text-xl text-background mb-2">
                Laurens Soedito
              </p>
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-background/50">
                Oprichter Sera Norr en Ls Capital
              </p>
              <p className="mt-6 font-sans text-sm text-background/70">
                Telefonisch bereikbaar via WhatsApp: +31 6 [VOEGHIERTOENUMMER]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-foreground/[0.02] border-t border-foreground/10 py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Wat anderen zeggen
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[-0.01em] text-foreground">
              Stemmen uit het atelier
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {reviews.map((r) => (
              <figure key={r.name} className="border border-foreground/10 p-10 bg-background">
                <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed tracking-[-0.005em]">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-8 pt-6 border-t border-foreground/10">
                  <p className="font-sans text-sm text-foreground">{r.name}</p>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {r.location}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}