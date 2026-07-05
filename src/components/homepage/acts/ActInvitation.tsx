// ============================================
// Act IV — Invitation
// Dark warm-black band. One CTA into /atelier.
// Purpose: single, confident conversion moment.
// ============================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HairlineDraw } from '@/components/motion/HairlineDraw';
import { useMotionPreference, riseStagger, settleTap, settleHover } from '@/lib/motion/primitives';

export function ActInvitation({ isNL }: { isNL: boolean }) {
  const { rise, settle } = useMotionPreference();

  return (
    <section
      className="relative py-32 lg:py-40 bg-sera-surface text-sera-inverted overflow-hidden film-grain"
      aria-labelledby="invitation-heading"
    >
      {/* Subtle warm glow behind the CTA — a spotlight, not a gradient. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 55%, hsl(35 12% 22%) 0%, transparent 70%)',
        }}
      />

      <div className="relative container mx-auto px-6 lg:px-12">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={riseStagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p
            variants={rise}
            className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-sera-inverted/60 mb-8"
          >
            {isNL ? 'Uw project' : 'Your project'}
          </motion.p>

          <motion.h2
            id="invitation-heading"
            variants={rise}
            className="font-serif text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] mb-6"
          >
            {isNL ? (
              <>
                Begin met één keuze:
                <br />
                <em className="italic text-sera-accent">de steen.</em>
              </>
            ) : (
              <>
                Begin with one choice:
                <br />
                <em className="italic text-sera-accent">the stone.</em>
              </>
            )}
          </motion.h2>

          <motion.p
            variants={rise}
            className="text-base lg:text-lg text-sera-inverted/70 leading-relaxed max-w-lg mx-auto mb-14"
          >
            {isNL
              ? 'De configurator geeft u binnen twee minuten een transparante vanaf-prijs. Geen verplichtingen.'
              : 'The configurator gives you a transparent starting price in under two minutes. No obligations.'}
          </motion.p>

          <motion.div variants={rise} className="flex flex-col items-center gap-6">
            {/* Settle on hover/tap — the physical click-into-place feedback. */}
            <motion.div whileHover={settleHover} whileTap={settleTap} transition={settle}>
              <Link
                to="/atelier"
                className="inline-flex items-center gap-3 px-10 py-4 bg-sera-inverted text-sera-surface hover:bg-sera-accent hover:text-sera-surface transition-colors rounded-sm text-xs uppercase tracking-[0.2em] font-medium"
              >
                {isNL ? 'Ontwerp uw tafel' : 'Design your table'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <Link
              to="/contact"
              className="text-sm text-sera-inverted/60 hover:text-sera-inverted underline underline-offset-4 transition-colors"
            >
              {isNL ? 'Of neem eerst contact op' : 'Or get in touch first'}
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust rail with animated hairlines — closing signature. */}
        <motion.div
          className="mt-24 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <HairlineDraw />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 text-center">
            {[
              { label: isNL ? 'Levertijd' : 'Lead time',    value: '12–16 wk' },
              { label: isNL ? 'Vanaf'    : 'From',          value: '€1.950' },
              { label: isNL ? 'Atelier'  : 'Atelier',       value: 'Nederland' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-sera-inverted/50 mb-2">
                  {s.label}
                </p>
                <p className="font-serif text-2xl text-sera-inverted">{s.value}</p>
              </div>
            ))}
          </div>
          <HairlineDraw />
        </motion.div>
      </div>
    </section>
  );
}