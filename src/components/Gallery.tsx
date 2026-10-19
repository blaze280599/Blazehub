import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { PHOTOS, TAGS, formatDate, type Photo, type Tag } from '../data/photos';
import { Heart, Paw, Sparkle } from './Doodles';
import { Img, SectionHeading, Tilt } from './ui';

// Deterministic "hand-placed" tilt for each polaroid
const tiltFor = (i: number) => [-3, 2, -1.5, 3, -2.5, 1.5][i % 6];
// Grid rows are 10px tall, so row span ≈ (image height + caption + gap) / 10.
// Images are cropped a touch (0.85) so very tall shots don't dominate.
const spanFor = (p: Photo) => {
  const ratio = p.height / p.width;
  if (ratio < 0.8) return { col: 'sm:col-span-2', rows: Math.round((ratio * 0.85 * 684 + 115) / 10) };
  return { col: '', rows: Math.round((ratio * 0.85 * 330 + 115) / 10) };
};

function Polaroid({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: () => void }) {
  const { col, rows } = spanFor(photo);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className={`${col} list-none pb-9`}
      style={{ gridRowEnd: `span ${rows}` }}
    >
      <Tilt className="h-full" max={8}>
        <motion.button
          onClick={onOpen}
          whileHover={{ rotate: 0, scale: 1.03, y: -6 }}
          whileTap={{ scale: 0.97 }}
          style={{ rotate: tiltFor(index) }}
          className="group relative flex h-full w-full flex-col rounded-xl bg-white p-3 pb-0 text-left shadow-[0_6px_0_var(--color-cocoa),0_18px_30px_-12px_rgb(74_44_31_/_0.35)] ring-2 ring-cocoa"
          aria-label={`Open photo: ${photo.caption}`}
        >
          {/* washi tape */}
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rounded-sm opacity-80"
            style={{ background: ['#ffc6d3', '#bfe8d6', '#ffd3a8', '#cfe6ff'][index % 4], rotate: `${tiltFor(index + 2) * 2}deg` }}
          />
          <motion.div layoutId={`photo-${photo.slug}`} className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
            <Img photo={photo} sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 340px" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Heart className="absolute right-3 top-3 w-8 scale-0 opacity-0 transition-all duration-300 ease-[var(--ease-bounce)] group-hover:scale-100 group-hover:opacity-100" />
          </motion.div>
          <div className="flex items-center justify-between gap-2 px-1 py-2.5">
            <p className="truncate font-hand text-2xl font-bold leading-none">{photo.caption}</p>
            <Paw className="size-5 shrink-0 opacity-40 transition group-hover:rotate-12 group-hover:opacity-100" />
          </div>
        </motion.button>
      </Tilt>
    </motion.li>
  );
}

function Lightbox({ list, index, onClose, onNav }: { list: Photo[]; index: number; onClose: () => void; onNav: (dir: 1 | -1) => void }) {
  const photo = list[index];
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    addEventListener('keydown', onKey);
    return () => {
      removeEventListener('keydown', onKey);
      lenis?.start();
    };
  }, [lenis, onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
    >
      <motion.div
        className="absolute inset-0 bg-cocoa/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 flex max-h-full w-full max-w-4xl flex-col items-center gap-4 md:flex-row md:items-stretch"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) onNav(1);
          else if (info.offset.x > 80) onNav(-1);
        }}
      >
        <motion.div
          layoutId={`photo-${photo.slug}`}
          className="relative max-h-[62vh] overflow-hidden rounded-3xl ring-4 ring-cream md:max-h-[80vh] md:flex-1"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
          <Img photo={photo} eager sizes="(max-width: 768px) 95vw, 900px" className="size-full object-cover" />
        </motion.div>

        <motion.div
          key={photo.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.1 } }}
          className="relative w-full max-w-sm rotate-1 rounded-3xl bg-cream p-6 shadow-[0_6px_0_var(--color-cocoa)] ring-2 ring-cocoa md:w-72 md:self-center"
        >
          <Sparkle className="absolute -right-3 -top-3 w-9" />
          <p className="text-xs font-bold uppercase tracking-widest text-ginger-deep">{formatDate(photo.date)}</p>
          <h3 className="mt-1 font-display text-3xl font-semibold leading-tight">{photo.caption}</h3>
          <p className="mt-2 font-hand text-2xl leading-snug text-cocoa-soft">{photo.note}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {photo.tags.map((t) => (
              <span key={t} className="rounded-full bg-peach px-3 py-1 text-xs font-bold">
                #{t}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <button onClick={() => onNav(-1)} className="grid size-11 place-items-center rounded-full bg-white text-xl ring-2 ring-cocoa transition hover:-translate-x-0.5 hover:bg-peach" aria-label="Previous photo">
              ←
            </button>
            <span className="text-sm font-bold text-cocoa-soft">
              {index + 1} / {list.length}
            </span>
            <button onClick={() => onNav(1)} className="grid size-11 place-items-center rounded-full bg-white text-xl ring-2 ring-cocoa transition hover:translate-x-0.5 hover:bg-peach" aria-label="Next photo">
              →
            </button>
          </div>
        </motion.div>
      </motion.div>

      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-20 grid size-12 place-items-center rounded-full bg-cream text-2xl font-bold ring-2 ring-cocoa transition hover:rotate-90"
        aria-label="Close"
      >
        ×
      </button>
    </motion.div>
  );
}

export function Gallery() {
  const [tag, setTag] = useState<Tag | 'all'>('all');
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(() => (tag === 'all' ? PHOTOS : PHOTOS.filter((p) => p.tags.includes(tag))), [tag]);

  const close = useCallback(() => setOpen(null), []);
  const nav = useCallback((d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  return (
    <section id="gallery" className="paw-pattern relative bg-cream-deep/60 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="The gallery" title="A floof in every frame" sub="Tap any photo for the full story. Swipe or use arrow keys to keep going." />

        <LayoutGroup>
          <div className="mb-12 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter photos">
            {TAGS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tag === t.id}
                onClick={() => setTag(t.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-bold ring-2 ring-cocoa transition-colors ${tag === t.id ? 'text-white' : 'bg-white hover:bg-peach'}`}
              >
                {tag === t.id && (
                  <motion.span layoutId="tag-pill" className="absolute inset-0 rounded-full bg-ginger" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative">
                  {t.emoji} {t.label}
                </span>
              </button>
            ))}
          </div>

          <motion.ul layout className="grid grid-cols-1 gap-x-6 gap-y-0 [grid-auto-rows:10px] sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <Polaroid key={p.slug} photo={p} index={i} onOpen={() => setOpen(i)} />
              ))}
            </AnimatePresence>
          </motion.ul>

          <AnimatePresence>{open !== null && list[open] && <Lightbox list={list} index={open} onClose={close} onNav={nav} />}</AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
