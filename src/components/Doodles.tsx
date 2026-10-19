import type { SVGProps } from 'react';

// Hand-drawn style doodles. Strokes use cocoa, fills use the site palette.
type P = SVGProps<SVGSVGElement>;
const stroke = { stroke: '#4a2c1f', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const Paw = ({ fill = '#f28a2e', ...p }: P & { fill?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden {...p}>
    <g fill={fill}>
      <path d="M16 15c4.5 0 8.5 4.2 8.5 8 0 3-2.6 4.3-5 3.6-1.3-.4-2.3-.9-3.5-.9s-2.2.5-3.5.9c-2.4.7-5-.6-5-3.6 0-3.8 4-8 8.5-8z" />
      <ellipse cx="6.5" cy="13" rx="3" ry="3.7" transform="rotate(-20 6.5 13)" />
      <ellipse cx="12" cy="7.2" rx="3" ry="3.9" transform="rotate(-8 12 7.2)" />
      <ellipse cx="20" cy="7.2" rx="3" ry="3.9" transform="rotate(8 20 7.2)" />
      <ellipse cx="25.5" cy="13" rx="3" ry="3.7" transform="rotate(20 25.5 13)" />
    </g>
  </svg>
);

export const Yarn = (p: P) => (
  <svg viewBox="0 0 80 80" aria-hidden {...p}>
    <path d="M58 62c6 4 12 3 16 8" fill="none" {...stroke} />
    <circle cx="38" cy="38" r="26" fill="#ff8fab" {...stroke} />
    <g fill="none" {...stroke} strokeWidth={2}>
      <path d="M16 30c10 2 30 14 38 30" />
      <path d="M22 18c8 8 22 30 24 45" />
      <path d="M40 12c-6 10-14 30-12 51" />
      <path d="M58 22c-14 2-34 14-44 28" />
      <path d="M63 40c-12-4-30-2-45 14" />
    </g>
  </svg>
);

export const Fish = (p: P) => (
  <svg viewBox="0 0 90 50" aria-hidden {...p}>
    <path d="M8 25c10-16 38-20 56-6l14-11c-2 7-2 25 0 32L64 31C46 45 18 41 8 25z" fill="#9fd3ff" {...stroke} />
    <circle cx="24" cy="22" r="3" fill="#4a2c1f" />
    <path d="M36 15c4 6 4 14 0 20M46 15c4 6 4 14 0 20" fill="none" {...stroke} strokeWidth={2} />
  </svg>
);

export const MouseToy = (p: P) => (
  <svg viewBox="0 0 100 60" aria-hidden {...p}>
    <path d="M14 44c-10 0-12-12-4-14" fill="none" {...stroke} />
    <path d="M14 44c4-22 26-34 50-30 14 2 24 12 26 24 1 6-4 8-10 8H14z" fill="#d9d1cc" {...stroke} />
    <circle cx="64" cy="14" r="9" fill="#ffc6d3" {...stroke} />
    <circle cx="80" cy="34" r="2.6" fill="#4a2c1f" />
    <path d="M92 40l6-2M92 44l6 2" {...stroke} strokeWidth={2} />
  </svg>
);

export const Star = ({ fill = '#ffd166', ...p }: P & { fill?: string }) => (
  <svg viewBox="0 0 40 40" aria-hidden {...p}>
    <path d="M20 3l4.6 10.8 11.4 1-8.7 7.6 2.6 11.4L20 28l-9.9 5.8 2.6-11.4L4 14.8l11.4-1z" fill={fill} {...stroke} />
  </svg>
);

export const Heart = ({ fill = '#ff8fab', ...p }: P & { fill?: string }) => (
  <svg viewBox="0 0 40 36" aria-hidden {...p}>
    <path d="M20 33S4 23 4 12c0-5 4-9 9-9 3.4 0 5.8 2 7 4.3C21.2 5 23.6 3 27 3c5 0 9 4 9 9 0 11-16 21-16 21z" fill={fill} {...stroke} />
  </svg>
);

export const Sparkle = ({ fill = '#ffb067', ...p }: P & { fill?: string }) => (
  <svg viewBox="0 0 40 40" aria-hidden {...p}>
    <path d="M20 2c1.5 10 6 16.5 18 18-12 1.5-16.5 8-18 18-1.5-10-6-16.5-18-18 12-1.5 16.5-8 18-18z" fill={fill} {...stroke} strokeWidth={2} />
  </svg>
);

export const Butterfly = (p: P) => (
  <svg viewBox="0 0 60 50" aria-hidden {...p}>
    <path d="M30 24C22 6 4 4 6 18c1 8 12 10 24 6zM30 24c8-18 26-20 24-6-1 8-12 10-24 6z" fill="#bfe8d6" {...stroke} />
    <path d="M30 26c-8 4-18 14-12 18 5 3 10-6 12-18zM30 26c8 4 18 14 12 18-5 3-10-6-12-18z" fill="#cfe6ff" {...stroke} />
    <path d="M30 14v22M30 14l-4-8M30 14l4-8" fill="none" {...stroke} />
  </svg>
);

export const Zzz = (p: P) => (
  <svg viewBox="0 0 60 60" aria-hidden {...p}>
    <g fill="none" {...stroke}>
      <path d="M8 40h12L8 54h12" />
      <path d="M26 22h10l-10 12h10" />
      <path d="M42 6h8l-8 10h8" />
    </g>
  </svg>
);

/** A round-faced cartoon Blaze: orange British Shorthair with chunky cheeks. */
export const BlazeFace = ({
  mood = 'happy',
  ...p
}: P & { mood?: 'happy' | 'blissful' | 'sleepy' | 'surprised' }) => (
  <svg viewBox="0 0 200 180" aria-hidden {...p}>
    {/* ears */}
    <path d="M38 70 L46 18 L88 48 Z" fill="#f28a2e" {...stroke} strokeWidth={4} />
    <path d="M162 70 L154 18 L112 48 Z" fill="#f28a2e" {...stroke} strokeWidth={4} />
    <path d="M50 58 L54 32 L74 48 Z" fill="#ffc6d3" />
    <path d="M150 58 L146 32 L126 48 Z" fill="#ffc6d3" />
    {/* head */}
    <ellipse cx="100" cy="104" rx="84" ry="68" fill="#ffa24c" {...stroke} strokeWidth={4} />
    {/* tabby stripes */}
    <g fill="none" stroke="#d96b14" strokeWidth={6} strokeLinecap="round">
      <path d="M100 40v16M84 44l4 14M116 44l-4 14" />
      <path d="M20 96h18M22 112h16M162 96h18M162 112h16" />
    </g>
    {/* muzzle */}
    <ellipse cx="82" cy="128" rx="22" ry="17" fill="#ffe2c4" />
    <ellipse cx="118" cy="128" rx="22" ry="17" fill="#ffe2c4" />
    {/* cheeks */}
    <ellipse cx="46" cy="124" rx="13" ry="8" fill="#ff8fab" opacity="0.55" />
    <ellipse cx="154" cy="124" rx="13" ry="8" fill="#ff8fab" opacity="0.55" />
    {/* eyes */}
    {mood === 'happy' && (
      <g>
        <ellipse cx="68" cy="96" rx="13" ry="15" fill="#e0a526" {...stroke} strokeWidth={3} />
        <ellipse cx="132" cy="96" rx="13" ry="15" fill="#e0a526" {...stroke} strokeWidth={3} />
        <ellipse cx="68" cy="98" rx="6" ry="11" fill="#2b1810" />
        <ellipse cx="132" cy="98" rx="6" ry="11" fill="#2b1810" />
        <circle cx="72" cy="90" r="3.6" fill="#fff" />
        <circle cx="136" cy="90" r="3.6" fill="#fff" />
      </g>
    )}
    {mood === 'surprised' && (
      <g>
        <circle cx="68" cy="96" r="16" fill="#e0a526" {...stroke} strokeWidth={3} />
        <circle cx="132" cy="96" r="16" fill="#e0a526" {...stroke} strokeWidth={3} />
        <circle cx="68" cy="97" r="11" fill="#2b1810" />
        <circle cx="132" cy="97" r="11" fill="#2b1810" />
        <circle cx="73" cy="91" r="4.5" fill="#fff" />
        <circle cx="137" cy="91" r="4.5" fill="#fff" />
      </g>
    )}
    {mood === 'blissful' && (
      <g fill="none" {...stroke} strokeWidth={4}>
        <path d="M54 100q14-14 28 0" />
        <path d="M118 100q14-14 28 0" />
      </g>
    )}
    {mood === 'sleepy' && (
      <g fill="none" {...stroke} strokeWidth={4}>
        <path d="M54 96q14 12 28 0" />
        <path d="M118 96q14 12 28 0" />
      </g>
    )}
    {/* nose + mouth */}
    <path d="M92 114h16l-8 9z" fill="#ff8fab" {...stroke} strokeWidth={3} />
    <path d="M100 123v6M100 129q-8 8-16 2M100 129q8 8 16 2" fill="none" {...stroke} strokeWidth={3} />
    {mood === 'surprised' && <ellipse cx="100" cy="142" rx="5" ry="6" fill="#4a2c1f" />}
    {/* whiskers */}
    <g fill="none" {...stroke} strokeWidth={2}>
      <path d="M58 128l-40-6M58 136l-40 4M142 128l40-6M142 136l40 4" />
    </g>
  </svg>
);

/** A curled-up sleeping cat, used in the footer and loader. */
export const SleepingCat = (p: P) => (
  <svg viewBox="0 0 220 120" aria-hidden {...p}>
    <ellipse cx="110" cy="108" rx="96" ry="9" fill="#4a2c1f" opacity="0.1" />
    <path
      d="M30 100c-8-34 20-64 70-66 46-2 86 18 90 50 2 14-6 20-20 20H44c-8 0-12-0-14-4z"
      fill="#ffa24c"
      {...stroke}
      strokeWidth={3.5}
    />
    <g fill="none" stroke="#d96b14" strokeWidth={5} strokeLinecap="round">
      <path d="M110 40c4 10 4 18 0 26M132 44c4 10 4 18 0 26M154 54c3 8 3 14 0 22" />
    </g>
    {/* tail wrapping round */}
    <path d="M190 90c4 16-20 18-70 16" fill="none" {...stroke} strokeWidth={14} />
    <path d="M190 90c4 16-20 18-70 16" fill="none" stroke="#ffa24c" strokeWidth={9} strokeLinecap="round" />
    {/* head */}
    <path d="M30 58l4-26 18 16M78 52l2-26-20 14" fill="#f28a2e" {...stroke} strokeWidth={3} />
    <ellipse cx="56" cy="74" rx="36" ry="28" fill="#ffa24c" {...stroke} strokeWidth={3.5} />
    <g fill="none" {...stroke} strokeWidth={3}>
      <path d="M38 72q7 6 14 0M62 72q7 6 14 0" />
      <path d="M54 84q3 3 6 0" />
    </g>
    <ellipse cx="36" cy="84" rx="7" ry="4" fill="#ff8fab" opacity="0.6" />
    <ellipse cx="78" cy="84" rx="7" ry="4" fill="#ff8fab" opacity="0.6" />
  </svg>
);

/** A cat silhouette walking, used as the scroll progress runner. */
export const WalkingCat = (p: P) => (
  <svg viewBox="0 0 64 40" aria-hidden {...p}>
    <path
      d="M6 14c-4-6 0-12 4-8M10 16c6-4 20-4 30-2l6-8 3 7h4l3-7 4 9c2 6-2 10-8 10-2 6-4 10-4 14h-4l-1-10H24l-3 10h-4l1-12c-6-2-8-6-8-11z"
      fill="#f28a2e"
      {...stroke}
      strokeWidth={2}
    />
    <circle cx="51" cy="18" r="1.6" fill="#4a2c1f" />
  </svg>
);
