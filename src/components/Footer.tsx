import { motion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { Paw, SleepingCat } from './Doodles';

export function Footer() {
  const lenis = useLenis();
  return (
    <footer className="relative overflow-hidden pb-10 pt-28">
      {/* a line of pawprints walking across */}
      <div aria-hidden className="absolute inset-x-0 top-6 flex justify-center gap-6 opacity-60">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: [0, 1, 0.5], scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            style={{ marginTop: i % 2 ? 14 : 0, rotate: 90 }}
          >
            <Paw className="size-5" fill="#d96b14" />
          </motion.div>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 text-center">
        <div className="relative">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute left-[22%] top-[18%] z-10 font-display text-3xl font-bold text-ginger-deep"
              animate={{ y: [0, -50], x: [0, 20 + i * 6], opacity: [0, 1, 0], scale: [0.6, 1 + i * 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
            >
              z
            </motion.span>
          ))}
          <motion.div animate={{ scaleY: [1, 1.035, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ originY: 1 }}>
            <SleepingCat className="w-56 md:w-64" />
          </motion.div>
        </div>
        <p className="mt-6 font-display text-2xl font-semibold">Made with love, treats &amp; a lot of fur</p>
        <p className="mt-2 text-cocoa-soft">© {new Date().getFullYear()} Blaze. All naps reserved.</p>
        <p className="mt-1 text-sm text-cocoa-soft/70">psst… try typing “meow” anywhere</p>
        <motion.button
          onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : scrollTo({ top: 0, behavior: 'smooth' }))}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold ring-2 ring-cocoa shadow-[0_4px_0_var(--color-cocoa)]"
        >
          <Paw className="size-5" /> Back to the top
        </motion.button>
      </div>
    </footer>
  );
}
