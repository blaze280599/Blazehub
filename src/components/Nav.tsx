import { useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useLenis } from 'lenis/react';
import { BlazeFace } from './Doodles';

const LINKS = [
  { href: '#meet', label: 'Meet Blaze' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#day', label: 'A day' },
  { href: '#purrsonality', label: 'Purr-sonality' },
  { href: '#pet', label: 'Pet Blaze' },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
    setScrolled(y > 30);
  });

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (lenis) lenis.scrollTo(href, { offset: -20, duration: 1.6 });
    else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between gap-2 rounded-full px-3 py-2 transition-all duration-500 ${
          scrolled ? 'bg-white/70 shadow-[0_8px_30px_rgb(74_44_31_/_0.12)] ring-1 ring-cocoa/10 backdrop-blur-xl' : 'bg-transparent'
        }`}
        aria-label="Main"
      >
        <a href="#top" onClick={go('#top')} className="group flex items-center gap-2 rounded-full pr-3">
          <motion.span whileHover={{ rotate: [0, -12, 12, -6, 0] }} transition={{ duration: 0.6 }} className="grid size-11 place-items-center rounded-full bg-cream-deep">
            <BlazeFace className="w-9" />
          </motion.span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Blaze<span className="text-ginger">hub</span>
          </span>
        </a>

        <ul className="hidden items-center md:flex" onMouseLeave={() => setHover(null)}>
          {LINKS.map((l) => (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                onClick={go(l.href)}
                onMouseEnter={() => setHover(l.href)}
                className="relative z-10 block px-4 py-2 text-sm font-bold text-cocoa transition-colors hover:text-ginger-deep"
              >
                {l.label}
              </a>
              {hover === l.href && (
                <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-peach/70" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
            </li>
          ))}
        </ul>

        <button
          className="grid size-11 place-items-center rounded-full bg-cocoa text-cream md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <div className="relative h-3.5 w-5">
            <motion.span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-cream" animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} />
            <motion.span className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-cream" animate={{ opacity: open ? 0 : 1 }} />
            <motion.span className="absolute left-0 top-3 h-0.5 w-5 rounded bg-cream" animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute inset-x-4 top-16 rounded-3xl bg-white/90 p-3 shadow-xl ring-1 ring-cocoa/10 backdrop-blur-xl md:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.li key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <a href={l.href} onClick={go(l.href)} className="block rounded-2xl px-4 py-3 font-display text-lg font-medium hover:bg-peach/60">
                  🐾 {l.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
