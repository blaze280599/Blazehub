import { useRef, useState, type ReactNode, type CSSProperties, type PointerEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import type { Photo } from '../data/photos';
import { Paw } from './Doodles';

/** Responsive WebP image with a blurred placeholder that fades away once loaded. */
export function Img({
  photo,
  sizes = '(max-width: 768px) 90vw, 480px',
  className = '',
  style,
  eager = false,
}: {
  photo: Photo;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={photo.srcset[photo.srcset.length - 1].src}
      srcSet={photo.srcset.map((s) => `${s.src} ${s.w}w`).join(', ')}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={`Blaze: ${photo.caption}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      className={`transition-[filter,opacity] duration-700 ${loaded ? 'blur-0' : 'blur-md'} ${className}`}
      style={{ backgroundImage: `url(${photo.blur})`, backgroundSize: 'cover', ...style }}
    />
  );
}

/** Eyebrow chip + title whose words pop in, with a hand-drawn underline. */
export function SectionHeading({ eyebrow, title, sub, light = false }: { eyebrow: string; title: string; sub?: string; light?: boolean }) {
  const words = title.split(' ');
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <motion.span
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold tracking-wide ${
          light ? 'bg-white/15 text-cream' : 'bg-white text-ginger-deep shadow-[0_3px_0_var(--color-cocoa)] ring-2 ring-cocoa'
        }`}
      >
        <Paw className="size-4" fill={light ? '#ffd3a8' : '#f28a2e'} /> {eyebrow}
      </motion.span>
      <h2 className={`mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl ${light ? 'text-cream' : 'text-cocoa'}`}>
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 40, rotate: i % 2 ? 6 : -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.08 * i }}
          >
            {w}
            {i < words.length - 1 && ' '}
          </motion.span>
        ))}
      </h2>
      <svg viewBox="0 0 220 16" className="mx-auto mt-3 h-4 w-48" aria-hidden>
        <motion.path
          d="M4 10 Q 30 2 56 9 T 110 9 T 164 9 T 216 7"
          fill="none"
          stroke={light ? '#ffd3a8' : '#f28a2e'}
          strokeWidth={5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.3 }}
        />
      </svg>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className={`mt-4 text-lg ${light ? 'text-cream/80' : 'text-cocoa-soft'}`}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}

/** Moves children vertically at a different speed than the page while scrolling. */
export function Parallax({ children, speed = 1, className = '', style }: { children: ReactNode; speed?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [90 * speed, -90 * speed]);
  return (
    <motion.div ref={ref} style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

/** 3D tilt that follows the pointer, springing back on leave. */
export function Tilt({ children, className = '', max = 12 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgb(255 255 255 / 0.45), transparent 55%)`);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" style={{ background: glare }} />
      </motion.div>
    </div>
  );
}

export function Floater({
  children,
  className = '',
  delay = 0,
  rotate = 0,
  duration = 6,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  rotate?: number;
  duration?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none animate-float ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s`, ['--r' as string]: `${rotate}deg` }}
    >
      {children}
    </div>
  );
}

export function Wave({ fill, flip = false, className = '' }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className={`block h-12 w-full md:h-20 ${flip ? 'rotate-180' : ''} ${className}`} aria-hidden>
      <path
        d="M0 50 C 120 10 240 10 360 40 S 600 90 720 60 S 960 0 1080 30 S 1320 80 1440 40 V90 H0 Z"
        fill={fill}
      />
    </svg>
  );
}
