import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const allImages = [
  '/lookbook/marble-round-livingroom.png',
  '/lookbook/travertine-oval-slab.png',
  '/lookbook/calacatta-viola-round.png',
  '/lookbook/travertine-round-cone.png',
  '/lookbook/hf_viola_dining_amsterdam.jpeg',
  '/lookbook/hf_viola_penthouse.jpeg',
  '/lookbook/marble-oval-dining.png',
  '/lookbook/marble-round-fluted.png',
  '/lookbook/travertine-round-fluted.png',
  '/lookbook/travertine-oval-fluted.png',
  '/lookbook/marble-coffee-fluted.png',
  '/lookbook/travertine-coffee-fluted.png',
  '/lookbook/hf_viola_countryside.jpeg',
  '/lookbook/hf_viola_townhouse.jpeg',
  '/lookbook/hf_viola_tuscany.jpeg',
  '/lookbook/hf_viola_nordic.jpeg',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  isNL: boolean;
  variants: any;
  isInView: boolean;
}

export function LookbookPreviewGrid({ isNL, variants, isInView }: Props) {
  const [visible, setVisible] = useState(() => shuffle(allImages).slice(0, 4));

  const rotate = useCallback(() => {
    setVisible(prev => {
      const pool = allImages.filter(img => !prev.includes(img));
      if (pool.length === 0) return prev;
      const slotIndex = Math.floor(Math.random() * 4);
      const newImg = pool[Math.floor(Math.random() * pool.length)];
      const next = [...prev];
      next[slotIndex] = newImg;
      return next;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(rotate, 4000);
    return () => clearInterval(id);
  }, [rotate]);

  return (
    <motion.div
      variants={variants.fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <Link to="/collections" className="group block">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-8">
          {visible.map((src, i) => (
            <div key={i} className="aspect-[4/5] overflow-hidden bg-secondary/50 relative">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={src}
                  src={src}
                  alt={isNL ? 'SERA NORR lookbook' : 'SERA NORR lookbook'}
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  loading="lazy"
                />
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
