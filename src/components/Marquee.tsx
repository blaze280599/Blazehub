import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from 'motion/react';
import { MARQUEE } from '../data/blaze';
import { Paw } from './Doodles';

/** A strip that drifts by itself and speeds up / reverses with your scroll velocity. */
function VelocityRow({ base, className, reverse = false }: { base: number; className: string; reverse?: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [-6, 6]);
  const initial = reverse ? 1 : -1;
  const dir = useRef(initial);
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = -initial;
    else if (f > 0) dir.current = initial;
    let move = dir.current * base * (delta / 1000);
    move += dir.current * Math.abs(move) * Math.abs(f);
    x.set(x.get() + move);
  });

  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className={`overflow-hidden whitespace-nowrap py-4 ${className}`}>
      <motion.div className="flex w-max items-center" style={{ x: tx, skewX: skew }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center" aria-hidden={k === 1}>
            {items.map((w, i) => (
              <span key={i} className="flex items-center gap-6 px-3 font-display text-2xl font-semibold uppercase tracking-wide md:text-4xl">
                {w}
                <Paw className="size-7 shrink-0 md:size-9" fill="currentColor" style={{ rotate: `${(i % 3) * 15 - 15}deg` }} />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="Blaze’s titles" className="relative -mt-px overflow-hidden bg-ginger py-10 md:py-14">
      <div className="-rotate-2 scale-105">
        <VelocityRow base={3} className="bg-cocoa text-cream shadow-lg" />
      </div>
      <div className="mt-4 rotate-1 scale-105">
        <VelocityRow base={2.4} reverse className="bg-cream text-ginger-deep ring-2 ring-cocoa" />
      </div>
    </section>
  );
}
