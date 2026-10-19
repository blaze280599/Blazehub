import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import confetti from 'canvas-confetti';
import { BlazeFace, Paw, WalkingCat } from './Doodles';

/** Intro screen: a bouncing Blaze face, then a circular curtain reveal. */
export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const finish = () => setTimeout(() => setDone(true), 900);
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const failsafe = setTimeout(() => setDone(true), 3500);
    return () => clearTimeout(failsafe);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] grid place-items-center bg-ginger"
          initial={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{ clipPath: 'circle(0% at 50% 50%)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={{ y: [0, -26, 0], scaleY: [1, 1.05, 0.92, 1], rotate: [0, -4, 4, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BlazeFace className="w-36 drop-shadow-[0_8px_0_rgb(74_44_31_/_0.25)]" />
            </motion.div>
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.6] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                  style={{ rotate: i % 2 ? 12 : -12, marginTop: i % 2 ? 10 : 0 }}
                >
                  <Paw className="size-7" fill="#fff7ec" />
                </motion.div>
              ))}
            </div>
            <p className="font-display text-xl font-medium tracking-wide text-cream">Fluffing the floof…</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PAW_SVG = `<svg viewBox="0 0 32 32" width="22" height="22"><g fill="#f28a2e"><path d="M16 15c4.5 0 8.5 4.2 8.5 8 0 3-2.6 4.3-5 3.6-1.3-.4-2.3-.9-3.5-.9s-2.2.5-3.5.9c-2.4.7-5-.6-5-3.6 0-3.8 4-8 8.5-8z"/><ellipse cx="6.5" cy="13" rx="3" ry="3.7"/><ellipse cx="12" cy="7.2" rx="3" ry="3.9"/><ellipse cx="20" cy="7.2" rx="3" ry="3.9"/><ellipse cx="25.5" cy="13" rx="3" ry="3.7"/></g></svg>`;

/** Leaves a trail of little pawprints behind the mouse, alternating left/right like real steps. */
export function PawTrail() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden';
    document.body.appendChild(layer);

    let lastX = 0;
    let lastY = 0;
    let step = 0;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist < 70) return;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      const side = step++ % 2 ? 1 : -1;
      const ox = (-dy / dist) * 9 * side;
      const oy = (dx / dist) * 9 * side;
      lastX = e.clientX;
      lastY = e.clientY;

      const el = document.createElement('div');
      el.innerHTML = PAW_SVG;
      el.style.cssText = `position:absolute;left:${e.clientX + ox - 11}px;top:${e.clientY + oy - 11}px;transform:rotate(${angle}deg)`;
      layer.appendChild(el);
      el.animate(
        [
          { opacity: 0, transform: `rotate(${angle}deg) scale(0.4)` },
          { opacity: 0.55, transform: `rotate(${angle}deg) scale(1)`, offset: 0.15 },
          { opacity: 0, transform: `rotate(${angle}deg) scale(0.9)` },
        ],
        { duration: 1400, easing: 'ease-out' },
      ).onfinish = () => el.remove();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      layer.remove();
    };
  }, [reduce]);
  return null;
}

/** Top-of-page scroll progress: a little cat strolls along a dotted path. */
export function ScrollCat() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const left = useTransform(progress, (v) => `calc(${v * 100}% - ${v * 44}px)`);
  const width = useTransform(progress, (v) => `${v * 100}%`);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1.5">
      <motion.div className="h-full rounded-r-full bg-gradient-to-r from-apricot via-ginger to-rose" style={{ width }} />
      <motion.div className="absolute top-1" style={{ left }}>
        <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 0.4, repeat: Infinity }}>
          <WalkingCat className="w-11" />
        </motion.div>
      </motion.div>
    </div>
  );
}

const fishShape = typeof window !== 'undefined' ? confetti.shapeFromText({ text: '🐟', scalar: 2 }) : undefined;
const pawShape = typeof window !== 'undefined' ? confetti.shapeFromText({ text: '🐾', scalar: 2 }) : undefined;
const catShape = typeof window !== 'undefined' ? confetti.shapeFromText({ text: '🐱', scalar: 2 }) : undefined;

export function treatBurst(origin = { x: 0.5, y: 0.6 }) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const shapes = [fishShape, pawShape].filter(Boolean) as confetti.Shape[];
  confetti({ particleCount: 40, spread: 80, startVelocity: 38, origin, shapes, scalar: 2, ticks: 160, gravity: 0.9 });
  confetti({ particleCount: 50, spread: 110, origin, colors: ['#f28a2e', '#ffb067', '#ff8fab', '#ffd166', '#bfe8d6'], ticks: 180 });
}

/** Type "meow" anywhere on the page for a surprise. */
export function MeowEasterEgg() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let buf = '';
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest('input, textarea, [contenteditable]')) return;
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf !== 'meow') return;
      buf = '';
      setShow(true);
      setTimeout(() => setShow(false), 2600);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const shapes = [catShape, pawShape, fishShape].filter(Boolean) as confetti.Shape[];
      const end = Date.now() + 1500;
      (function frame() {
        confetti({ particleCount: 4, angle: 270, spread: 140, startVelocity: 8, gravity: 0.6, origin: { x: Math.random(), y: -0.1 }, shapes, scalar: 2.4, ticks: 320 });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ y: 80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-cocoa px-6 py-3 font-display text-lg text-cream shadow-xl"
        >
          🐱 Meow detected! It’s raining cats!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
