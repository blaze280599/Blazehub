import { motion } from 'motion/react';
import { DISLIKES, LIKES, TRAITS } from '../data/blaze';
import { Heart, Paw, Yarn, Zzz } from './Doodles';
import { Floater, Parallax, SectionHeading } from './ui';

function Meter({ label, value, colour, note, i }: (typeof TRAITS)[number] & { i: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.08 }}
      className="group"
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-display text-lg font-semibold">{label}</span>
        <span className="font-hand text-xl text-cocoa-soft opacity-0 transition-opacity group-hover:opacity-100 max-sm:hidden">{note}</span>
        <span className="font-display text-lg font-bold tabular-nums">{value}%</span>
      </div>
      <div className="relative h-6 rounded-full bg-white ring-2 ring-cocoa">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `repeating-linear-gradient(-45deg, ${colour}, ${colour} 10px, color-mix(in srgb, ${colour} 80%, white) 10px, color-mix(in srgb, ${colour} 80%, white) 20px)` }}
          initial={{ width: '0%' }}
          whileInView={{ width: `${Math.max(value, 6)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.08 }}
        />
        <motion.div
          className="absolute -top-2"
          initial={{ left: '0%', rotate: 0 }}
          whileInView={{ left: `calc(${Math.max(value, 6)}% - 20px)`, rotate: 360 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.08 }}
        >
          <Paw className="size-9 drop-shadow-[0_2px_0_var(--color-cocoa)]" fill={colour} />
        </motion.div>
      </div>
    </motion.li>
  );
}

function StickyNote({ title, items, tone, rotate, icon }: { title: string; items: string[]; tone: string; rotate: number; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ rotate: 0, scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 160, damping: 14 }}
      className={`relative rounded-md p-6 pt-8 shadow-[0_14px_24px_-10px_rgb(74_44_31_/_0.4)] ${tone}`}
    >
      <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-3deg] bg-white/60 shadow-sm" />
      <h3 className="font-display text-2xl font-semibold">
        {icon} {title}
      </h3>
      <ul className="mt-3 space-y-1.5">
        {items.map((t, i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="font-hand text-2xl leading-tight"
          >
            • {t}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Purrsonality() {
  return (
    <section id="purrsonality" className="relative overflow-hidden py-24 md:py-32">
      <Parallax speed={1.2} className="absolute right-[4%] top-28 hidden md:block">
        <Floater rotate={8}><Yarn className="w-20" /></Floater>
      </Parallax>
      <Parallax speed={-0.8} className="absolute left-[8%] top-40 hidden md:block">
        <Floater delay={1.5}><Zzz className="w-16" /></Floater>
      </Parallax>
      <Parallax speed={1} className="absolute left-[46%] top-[42%] hidden lg:block">
        <Floater delay={0.6}><Heart className="w-10" /></Floater>
      </Parallax>

      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Purr-sonality" title="Scientifically measured vibes" sub="Results independently verified by one very biased human." />
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr] md:gap-20">
          <ul className="space-y-7">
            {TRAITS.map((t, i) => (
              <Meter key={t.label} {...t} i={i} />
            ))}
          </ul>
          <div className="grid content-center gap-8">
            <StickyNote title="Loves" items={LIKES} tone="bg-[#fff1a8]" rotate={-3} icon="💛" />
            <StickyNote title="Not a fan" items={DISLIKES} tone="bg-blush" rotate={2.5} icon="🙀" />
          </div>
        </div>
      </div>
    </section>
  );
}
