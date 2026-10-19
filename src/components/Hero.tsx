import { useEffect, type ReactNode } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useLenis } from 'lenis/react';
import { photoByFile } from '../data/photos';
import { Butterfly, Fish, Heart, MouseToy, Paw, Sparkle, Star, Yarn } from './Doodles';
import { Img, Wave } from './ui';

const hero = photoByFile('PXL_20260603_080729817.jpg');

function Drift({ mx, my, depth, className, children }: { mx: MotionValue<number>; my: MotionValue<number>; depth: number; className: string; children: ReactNode }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div aria-hidden style={{ x, y }} className={`pointer-events-none absolute ${className}`}>
      {children}
    </motion.div>
  );
}

export function Hero() {
  const lenis = useLenis();
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 800], [0, 120]);
  const photoRotate = useTransform(scrollY, [0, 800], [0, 8]);
  const textY = useTransform(scrollY, [0, 800], [0, -80]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / innerWidth - 0.5) * 2);
      my.set((e.clientY / innerHeight - 0.5) * 2);
    };
    addEventListener('pointermove', onMove, { passive: true });
    return () => removeEventListener('pointermove', onMove);
  }, [mx, my]);

  const scrollTo = (id: string) => () => (lenis ? lenis.scrollTo(id, { offset: -20, duration: 1.6 }) : document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }));

  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-32">
      {/* background blobs */}
      <div aria-hidden className="absolute -left-40 top-10 size-[28rem] animate-blob rounded-full bg-peach/60 blur-3xl" />
      <div aria-hidden className="absolute -right-32 top-48 size-[24rem] animate-blob rounded-full bg-blush/50 blur-3xl [animation-delay:-5s]" />

      {/* floating doodles with mouse parallax */}
      <Drift mx={mx} my={my} depth={-30} className="left-[4%] top-[18%] hidden md:block">
        <div className="animate-wiggle"><Yarn className="w-20" /></div>
      </Drift>
      <Drift mx={mx} my={my} depth={24} className="left-[44%] top-[12%] hidden lg:block">
        <Star className="w-10 animate-spin-slow" />
      </Drift>
      <Drift mx={mx} my={my} depth={-18} className="bottom-[22%] left-[8%] hidden md:block">
        <Fish className="w-24 -rotate-12" />
      </Drift>
      <Drift mx={mx} my={my} depth={36} className="right-[4%] top-[16%]">
        <Butterfly className="w-14 animate-float" />
      </Drift>
      <Drift mx={mx} my={my} depth={-40} className="bottom-[16%] right-[6%] hidden sm:block">
        <MouseToy className="w-24" />
      </Drift>
      <Drift mx={mx} my={my} depth={20} className="left-[40%] bottom-[14%] hidden lg:block">
        <Heart className="w-9 animate-float" />
      </Drift>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 md:grid-cols-[1.1fr_1fr] md:pb-28">
        <motion.div style={{ y: textY }} className="relative z-10 text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ginger-deep shadow-[0_3px_0_var(--color-cocoa)] ring-2 ring-cocoa"
          >
            <Paw className="size-4" /> Orange British Shorthair
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(5.5rem,17vw,11rem)] font-bold leading-[0.85] tracking-tight" aria-label="Blaze">
            {'Blaze'.split('').map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="text-stroke inline-block text-ginger drop-shadow-[0_6px_0_var(--color-cocoa)]"
                initial={{ y: 120, opacity: 0, rotate: -20, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 14, delay: 1.25 + i * 0.08 }}
                whileHover={{ y: -18, rotate: i % 2 ? 10 : -10, scale: 1.1, transition: { type: 'spring', stiffness: 500, damping: 8 } }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-cocoa-soft md:mx-0 md:text-xl"
          >
            Professional napper. Chief sunbeam inspector. Round, orange, and{' '}
            <span className="font-hand text-3xl font-bold text-ginger-deep">absolutely adored.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start"
          >
            <motion.button
              onClick={scrollTo('#gallery')}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-ginger px-7 py-3.5 font-display text-lg font-semibold text-white shadow-[0_5px_0_var(--color-cocoa)] ring-2 ring-cocoa transition-shadow hover:shadow-[0_7px_0_var(--color-cocoa)]"
            >
              See the floof 📸
            </motion.button>
            <motion.button
              onClick={scrollTo('#pet')}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-white px-7 py-3.5 font-display text-lg font-semibold text-cocoa shadow-[0_5px_0_var(--color-cocoa)] ring-2 ring-cocoa"
            >
              Pet Blaze 🐾
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: photoY, rotate: photoRotate }}
          initial={{ opacity: 0, scale: 0.7, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 1.1 }}
          className="relative mx-auto aspect-square w-[80%] max-w-[26rem] sm:w-full"
        >
          {/* spinning ring of text */}
          <svg viewBox="0 0 400 400" className="absolute -inset-8 size-[calc(100%+4rem)] animate-spin-slow" aria-hidden>
            <defs>
              <path id="ring" d="M200 200 m-182 0 a182 182 0 1 1 364 0 a182 182 0 1 1 -364 0" />
            </defs>
            <text className="fill-cocoa font-display text-[17px] font-semibold uppercase tracking-[0.32em]">
              <textPath href="#ring">professional napper • sunbeam inspector • certified loaf • </textPath>
            </text>
          </svg>
          <div className="absolute inset-4 animate-blob bg-apricot ring-4 ring-cocoa [animation-duration:10s]" />
          <div className="absolute inset-4 translate-x-3 translate-y-3 animate-blob bg-cocoa [animation-duration:10s] -z-10" />
          <div className="absolute inset-7 animate-blob overflow-hidden [animation-duration:10s]">
            <Img photo={hero} eager sizes="(max-width: 768px) 90vw, 420px" className="size-full scale-110 object-cover object-[50%_30%]" />
          </div>
          <motion.div
            className="absolute -bottom-2 -left-4 rotate-[-8deg] rounded-2xl bg-white px-4 py-2 font-hand text-2xl font-bold shadow-[0_4px_0_var(--color-cocoa)] ring-2 ring-cocoa"
            animate={{ rotate: [-8, -4, -8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            hi, i’m Blaze! 👋
          </motion.div>
          <Sparkle className="absolute -right-2 top-6 w-10 animate-wiggle" />
          <Sparkle className="absolute right-10 -top-6 w-6 animate-wiggle [animation-delay:-1s]" fill="#ff8fab" />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-sm font-bold text-cocoa-soft md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
      >
        scroll for more floof
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <Paw className="size-6 rotate-180" />
        </motion.span>
      </motion.div>

      <Wave fill="var(--color-ginger)" />
    </section>
  );
}
