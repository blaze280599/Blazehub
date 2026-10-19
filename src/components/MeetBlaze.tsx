import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'motion/react';
import { INTRO, PROFILE, STATS } from '../data/blaze';
import { photoByFile } from '../data/photos';
import { Fish, Paw, Star, Yarn } from './Doodles';
import { Floater, Img, Parallax, SectionHeading, Tilt } from './ui';

const idPhoto = photoByFile('PXL_20260719_164852730.jpg');

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: to > 100 ? 2.4 : 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString('en-GB')}
      {suffix}
    </span>
  );
}

function IdCard() {
  const rows: [string, string][] = [
    ['Name', PROFILE.name],
    ['Breed', PROFILE.breed],
    ['Colour', PROFILE.colour],
    ['Eyes', PROFILE.eyes],
    ['Occupation', PROFILE.job],
    ['Best friend', PROFILE.bestFriend],
  ];
  return (
    <Tilt className="mx-auto w-full max-w-md rotate-[-3deg]" max={10}>
      <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_10px_0_var(--color-cocoa)] ring-[3px] ring-cocoa">
        <div className="paw-pattern absolute inset-0 opacity-70" aria-hidden />
        <div className="relative flex items-center justify-between border-b-2 border-dashed border-cocoa/25 pb-3">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ginger-deep">Official Cat ID</p>
          <Paw className="size-6" />
        </div>
        <div className="relative mt-5 flex gap-5">
          <div className="w-32 shrink-0 overflow-hidden rounded-2xl ring-[3px] ring-cocoa sm:w-36">
            <Img photo={idPhoto} sizes="160px" className="aspect-[3/4] size-full object-cover" />
          </div>
          <dl className="grid flex-1 content-start gap-1.5 text-sm">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.7rem] font-bold uppercase tracking-wider text-cocoa-soft/70">{k}</dt>
                <dd className="font-display font-semibold leading-tight">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mt-5 flex items-end justify-between">
          <p className="max-w-[70%] font-hand text-xl leading-snug text-cocoa-soft">{PROFILE.motto}</p>
          <div className="text-center">
            <Paw className="size-12 -rotate-12" fill="#4a2c1f" />
            <p className="text-[0.6rem] font-bold uppercase tracking-wider text-cocoa-soft">signature</p>
          </div>
        </div>
        <div className="absolute -right-10 top-8 rotate-45 bg-rose px-10 py-1 text-xs font-bold uppercase tracking-widest text-white">Very good</div>
      </div>
    </Tilt>
  );
}

export function MeetBlaze() {
  return (
    <section id="meet" className="relative overflow-hidden py-24 md:py-32">
      <Parallax speed={1.4} className="absolute left-[3%] top-24 hidden md:block">
        <Floater rotate={-12}><Yarn className="w-16" /></Floater>
      </Parallax>
      <Parallax speed={-1} className="absolute right-[5%] top-40">
        <Floater delay={1}><Star className="w-10" /></Floater>
      </Parallax>
      <Parallax speed={0.8} className="absolute bottom-20 right-[10%] hidden md:block">
        <Floater delay={2} rotate={10}><Fish className="w-20" /></Floater>
      </Parallax>

      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Meet Blaze" title="The floof behind the fame" />

        <div className="grid items-center gap-14 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -8 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          >
            <IdCard />
          </motion.div>

          <div>
            {INTRO.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15 }}
                className={`mb-5 leading-relaxed text-cocoa-soft ${i === 0 ? 'text-xl font-semibold text-cocoa md:text-2xl' : 'text-lg'}`}
              >
                {p}
              </motion.p>
            ))}

            <div className="mt-8 grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16, delay: i * 0.1 }}
                  whileHover={{ y: -6, rotate: i % 2 ? 2 : -2 }}
                  className={`rounded-3xl p-5 ring-2 ring-cocoa shadow-[0_5px_0_var(--color-cocoa)] ${['bg-peach', 'bg-blush', 'bg-mint', 'bg-sky'][i % 4]}`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <p className="mt-1 font-display text-4xl font-bold">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-sm font-bold text-cocoa-soft">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
