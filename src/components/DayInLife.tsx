import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { DAY } from '../data/blaze';
import { photoByFile } from '../data/photos';
import { Paw, Sparkle, Star } from './Doodles';
import { Img } from './ui';

const steps = DAY.map((d) => ({ ...d, photo: photoByFile(d.file) }));

/** Pinned section that scrolls sideways through Blaze's day, sky shifting from sunrise to night. */
export function DayInLife() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);

  const bg = useTransform(scrollYProgress, [0, 0.35, 0.65, 0.85, 1], ['#ffe2c4', '#cfe6ff', '#ffc6a8', '#3b2f5c', '#211a3a']);
  const ink = useTransform(scrollYProgress, [0, 0.7, 0.82], ['#4a2c1f', '#4a2c1f', '#fff7ec']);
  const sunY = useTransform(scrollYProgress, [0, 0.35, 0.75], ['40%', '-10%', '120%']);
  const sunX = useTransform(scrollYProgress, [0, 0.75], ['10%', '80%']);
  const moonY = useTransform(scrollYProgress, [0.68, 0.95], ['120%', '12%']);
  const starsOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.section id="day" ref={section} style={{ backgroundColor: bg, color: ink, height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* sky */}
        <motion.div aria-hidden className="absolute size-28 rounded-full bg-[#ffd166] shadow-[0_0_80px_30px_rgb(255_209_102_/_0.6)] md:size-36" style={{ top: sunY, left: sunX }} />
        <motion.div aria-hidden className="absolute right-[12%] size-20 rounded-full bg-[#fff3d6] shadow-[0_0_60px_20px_rgb(255_243_214_/_0.35)] md:size-28" style={{ top: moonY }}>
          <div className="absolute right-3 top-3 size-5 rounded-full bg-[#f1e2bd]" />
          <div className="absolute bottom-5 left-4 size-3 rounded-full bg-[#f1e2bd]" />
        </motion.div>
        <motion.div aria-hidden style={{ opacity: starsOpacity }} className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }).map((_, i) => (
            <Star key={i} fill="#fff3d6" className="absolute w-4 animate-float" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 45 + 4}%`, animationDelay: `${-i}s` }} />
          ))}
        </motion.div>

        <div className="relative z-10 mx-auto mb-8 w-full max-w-6xl px-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-ginger-deep ring-2 ring-cocoa">
            <Paw className="size-4" /> A day in the life
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl md:text-6xl">24 hours of Blaze</h2>
        </div>

        <motion.div ref={track} style={{ x }} className="relative z-10 flex w-max gap-6 px-5 md:gap-10 md:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]">
          {steps.map((s, i) => (
            <article
              key={s.time}
              className="group relative flex w-[78vw] max-w-[22rem] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-white text-cocoa shadow-[0_8px_0_var(--color-cocoa)] ring-[3px] ring-cocoa sm:w-[22rem]"
              style={{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }}
            >
              <div className="relative h-[34vh] max-h-72 overflow-hidden">
                <Img photo={s.photo} sizes="360px" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute left-4 top-4 rounded-full bg-cocoa px-3 py-1 font-display text-lg font-semibold text-cream">{s.time}</span>
              </div>
              <div className="relative p-5">
                <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-1 text-cocoa-soft">{s.text}</p>
                <Sparkle className="absolute -top-5 right-5 w-9 transition-transform duration-500 group-hover:rotate-90" fill={i % 2 ? '#ff8fab' : '#ffb067'} />
              </div>
            </article>
          ))}
          <div className="flex w-[60vw] max-w-sm shrink-0 flex-col items-center justify-center text-center">
            <p className="font-display text-5xl">💤</p>
            <p className="mt-3 font-hand text-4xl font-bold">…and repeat tomorrow.</p>
          </div>
        </motion.div>

        {/* progress through the day */}
        <div className="relative z-10 mx-auto mt-10 h-2 w-[min(28rem,80vw)] overflow-hidden rounded-full bg-white/40 ring-2 ring-cocoa/40">
          <motion.div className="h-full rounded-full bg-ginger" style={{ width: bar }} />
        </div>
      </div>
    </motion.section>
  );
}
