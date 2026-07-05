// ============================================
// Act III — Craft
// Editorial split: atelier photograph with Drift parallax
// on the left, typographic manifesto with staggered Rise
// on the right. HairlineDraw dividers between claims.
// Purpose: humanize the maker.
// ============================================

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HairlineDraw } from '@/components/motion/HairlineDraw';
import { useMotionPreference, riseStagger } from '@/lib/motion/primitives';
import atelierImage from '@/assets/about-atelier.jpg';

export function ActCraft({ isNL }: { isNL: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { rise, driftFactor } = useMotionPreference();

  // Drift — the atelier image lags the scroll by 15%. Purpose:
  // suggest depth, as if the workshop lies just behind the text.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${20 * driftFactor}%`, `${-20 * driftFactor}%`],
  );

  const claims = isNL
    ? [
        { number: '01', title: 'Eén slab, één tafel', body: 'Elke tafel wordt uit één blok gezaagd. De aders lopen door van rand tot rand.' },
        { number: '02', title: 'Op maat gemaakt',    body: 'Formaat, vorm, afwerking, onderstel. Alles begint bij uw ruimte, niet bij een catalogus.' },
        { number: '03', title: 'White-glove levering', body: 'Wij plaatsen de tafel op zijn plek. U hoeft alleen de deur open te doen.' },
      ]
    : [
        { number: '01', title: 'One slab, one table',    body: 'Every table is cut from a single block. The veining runs continuously edge to edge.' },
        { number: '02', title: 'Made to measure',        body: 'Size, shape, finish, base. Everything starts with your room, not a catalogue.' },
        { number: '03', title: 'White-glove delivery',   body: 'We place the table where it belongs. You only open the door.' },
      ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-sera-bg overflow-hidden"
      aria-labelledby="craft-heading"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <HairlineDraw label={isNL ? 'Het atelier' : 'The atelier'} />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: the workshop photograph with Drift parallax. */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-sm bg-sera-bg-deep film-grain">
            <motion.img
              src={atelierImage}
              alt={
                isNL
                  ? 'De werkplaats waar elke tafel op maat wordt gemaakt'
                  : 'The workshop where each table is made to order'
              }
              className="absolute inset-0 w-full h-[120%] object-cover"
              style={{ y }}
              loading="lazy"
              decoding="async"
            />
            {/* Editorial caption in the corner — print catalogue rhythm. */}
            <div className="absolute bottom-6 left-6 bg-sera-bg/85 backdrop-blur-sm px-4 py-3 rounded-sm max-w-[70%]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-sera-text-soft mb-1">
                {isNL ? 'Plaat 01' : 'Plate 01'}
              </p>
              <p className="text-sm text-sera-text leading-snug">
                {isNL
                  ? 'De werkbank, tussen twee slabs Calacatta.'
                  : 'The bench, between two slabs of Calacatta.'}
              </p>
            </div>
          </div>

          {/* Right: the typographic manifesto. */}
          <motion.div
            variants={riseStagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              id="craft-heading"
              variants={rise}
              className="font-serif text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] tracking-[-0.015em] text-sera-text mb-8"
            >
              {isNL ? (
                <>
                  Stone is a slow material.
                  <br />
                  <em className="italic text-sera-accent-hover">We work at its pace.</em>
                </>
              ) : (
                <>
                  Stone is a slow material.
                  <br />
                  <em className="italic text-sera-accent-hover">We work at its pace.</em>
                </>
              )}
            </motion.h2>

            <motion.p variants={rise} className="text-body-md text-sera-text-soft leading-relaxed mb-12 max-w-md">
              {isNL
                ? 'Sera Norr is een klein Nederlands atelier. Wij ontwerpen, snijden en polijsten in eigen huis, in nauw contact met onze Italiaanse en Turkse groeves.'
                : 'Sera Norr is a small Dutch atelier. We design, cut, and polish in-house, in close dialogue with our Italian and Turkish quarries.'}
            </motion.p>

            {/* Three claims separated by animated hairlines. */}
            <div className="space-y-0">
              {claims.map((c, i) => (
                <motion.div key={c.number} variants={rise}>
                  {i > 0 && <HairlineDraw />}
                  <div className="py-6 grid grid-cols-[auto_1fr] gap-6 items-baseline">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-sera-text-soft/70 tabular-nums">
                      {c.number}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl text-sera-text mb-1">{c.title}</h3>
                      <p className="text-sm text-sera-text-soft leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}