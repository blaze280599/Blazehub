import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { PET_PHRASES } from '../data/blaze';
import { BlazeFace, Heart, Paw } from './Doodles';
import { treatBurst } from './Effects';
import { SectionHeading, Wave } from './ui';

const STORAGE_KEY = 'blaze-pets';
const readPets = () => {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
};

/** A soft synthesized purr: filtered noise pulsed ~24 times a second. */
function usePurr() {
  const ctx = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const start = () => {
    if (!ctx.current) {
      const ac = new AudioContext();
      const buffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ac.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 180;
      const pulse = ac.createGain();
      pulse.gain.value = 0.5;
      const lfo = ac.createOscillator();
      lfo.frequency.value = 24;
      const lfoDepth = ac.createGain();
      lfoDepth.gain.value = 0.5;
      lfo.connect(lfoDepth).connect(pulse.gain);
      const master = ac.createGain();
      master.gain.value = 0;
      noise.connect(lp).connect(pulse).connect(master).connect(ac.destination);
      noise.start();
      lfo.start();
      ctx.current = ac;
      gain.current = master;
    }
    void ctx.current.resume();
    gain.current!.gain.setTargetAtTime(0.9, ctx.current.currentTime, 0.15);
  };
  const stop = () => {
    if (ctx.current && gain.current) gain.current.gain.setTargetAtTime(0, ctx.current.currentTime, 0.25);
  };
  useEffect(() => () => void ctx.current?.close(), []);
  return { start, stop };
}

type Pop = { id: number; x: number; y: number; kind: 'heart' | 'text'; text?: string; rot: number };

export function PetBlaze() {
  const [pets, setPets] = useState(0);
  const [petting, setPetting] = useState(false);
  const [surprised, setSurprised] = useState(false);
  const [sound, setSound] = useState(false);
  const [pops, setPops] = useState<Pop[]>([]);
  const [treats, setTreats] = useState(0);
  const purr = usePurr();
  const last = useRef({ x: 0, y: 0, dist: 0 });
  const idle = useRef<number>(0);
  const popId = useRef(0);

  const tiltX = useSpring(useMotionValue(0), { stiffness: 150, damping: 12 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 150, damping: 12 });
  const rotate = useTransform(tiltX, [-1, 1], [-10, 10]);
  const squish = useSpring(1, { stiffness: 300, damping: 10 });

  useEffect(() => setPets(readPets()), []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(pets));
    } catch {
      /* storage unavailable, that's fine */
    }
  }, [pets]);

  const addPop = (x: number, y: number, kind: Pop['kind']) => {
    const id = ++popId.current;
    const text = kind === 'text' ? PET_PHRASES[Math.floor(Math.random() * PET_PHRASES.length)] : undefined;
    setPops((p) => [...p.slice(-14), { id, x, y, kind, text, rot: Math.random() * 40 - 20 }]);
    setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 1400);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    tiltX.set((x / r.width - 0.5) * 2);
    tiltY.set((y / r.height - 0.5) * 2);

    const d = Math.hypot(x - last.current.x, y - last.current.y);
    last.current.x = x;
    last.current.y = y;
    if (e.pointerType === 'mouse' || e.buttons || e.pointerType === 'touch') last.current.dist += d;

    if (last.current.dist > 90) {
      last.current.dist = 0;
      setPets((n) => n + 1);
      setPetting(true);
      if (sound) purr.start();
      squish.set(0.94);
      setTimeout(() => squish.set(1), 120);
      addPop(x, y, Math.random() < 0.22 ? 'text' : 'heart');
      clearTimeout(idle.current);
      idle.current = window.setTimeout(() => {
        setPetting(false);
        purr.stop();
      }, 700);
    }
  };

  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    setPetting(false);
    purr.stop();
  };

  const boop = (e: MouseEvent<HTMLButtonElement>) => {
    const b = e.currentTarget;
    setSurprised(true);
    setTimeout(() => setSurprised(false), 900);
    addPop(b.offsetLeft, b.offsetTop - 30, 'text');
  };

  const giveTreat = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    treatBurst({ x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight });
    setTreats((t) => t + 1);
  };

  const mood = surprised ? 'surprised' : petting ? 'blissful' : 'happy';
  const level = Math.min(100, (pets % 50) * 2);

  return (
    <section id="pet" className="relative overflow-hidden bg-ginger text-cream">
      <Wave fill="var(--color-cream)" flip />
      <div className="paw-pattern absolute inset-0 opacity-60 [filter:brightness(3)]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
        <SectionHeading eyebrow="Interactive" title="Go on, pet Blaze" sub="Stroke the floof with your mouse (or finger). Boop the nose. Hand out treats." light />

        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div className="relative mx-auto w-full max-w-md">
            <motion.div
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              onPointerCancel={onLeave}
              style={{ rotate, scaleY: squish, touchAction: 'none' }}
              className="relative aspect-[10/9] w-full select-none"
              role="img"
              aria-label="Cartoon Blaze. Move the pointer over the face to pet."
            >
              <motion.div className="absolute inset-x-8 bottom-0 h-6 rounded-[50%] bg-cocoa/25 blur-md" style={{ scaleX: squish }} />
              <BlazeFace mood={mood} className="relative size-full drop-shadow-[0_10px_0_rgb(74_44_31_/_0.35)]" />
              <button
                onClick={boop}
                className="absolute left-1/2 top-[65%] size-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
                aria-label="Boop the nose"
              />
              <AnimatePresence>
                {pops.map((p) => (
                  <motion.div
                    key={p.id}
                    className="pointer-events-none absolute"
                    style={{ left: p.x, top: p.y }}
                    initial={{ opacity: 0, scale: 0.3, y: 0, x: '-50%', rotate: p.rot }}
                    animate={{ opacity: [0, 1, 1, 0], scale: 1, y: -110 }}
                    transition={{ duration: 1.3, ease: 'easeOut' }}
                  >
                    {p.kind === 'heart' ? (
                      <Heart className="w-11 drop-shadow-[0_2px_0_rgb(74_44_31_/_0.4)]" fill={p.id % 3 ? '#ff8fab' : '#fff7ec'} />
                    ) : (
                      <span className="whitespace-nowrap rounded-full bg-white px-3 py-1 font-hand text-2xl font-bold text-cocoa ring-2 ring-cocoa">{p.text}</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="rounded-[2rem] bg-cream p-7 text-cocoa shadow-[0_8px_0_var(--color-cocoa)] ring-[3px] ring-cocoa">
            <p className="text-sm font-bold uppercase tracking-widest text-ginger-deep">Pet-o-meter</p>
            <motion.p key={pets} initial={{ scale: 1.25 }} animate={{ scale: 1 }} style={{ originX: 0 }} className="mt-1 font-display text-6xl font-bold tabular-nums">
              {pets.toLocaleString('en-GB')}
            </motion.p>
            <p className="font-bold text-cocoa-soft">pets given (Blaze remembers)</p>

            <div className="mt-5">
              <div className="mb-1 flex justify-between text-sm font-bold">
                <span>Purr level</span>
                <span>{level >= 98 ? 'MAX PURR 💥' : `${level}%`}</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-white ring-2 ring-cocoa">
                <motion.div className="h-full bg-gradient-to-r from-apricot via-rose to-ginger" animate={{ width: `${level}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button
                onClick={giveTreat}
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.92 }}
                className="flex-1 rounded-full bg-ginger px-5 py-3 font-display text-lg font-semibold text-white shadow-[0_5px_0_var(--color-cocoa)] ring-2 ring-cocoa"
              >
                Give a treat 🐟
              </motion.button>
              <motion.button
                onClick={() => {
                  setSound((s) => !s);
                  purr.stop();
                }}
                whileTap={{ scale: 0.92 }}
                aria-pressed={sound}
                className={`rounded-full px-5 py-3 font-display font-semibold ring-2 ring-cocoa transition-colors ${sound ? 'bg-mint' : 'bg-white'}`}
              >
                {sound ? '🔊 Purr on' : '🔈 Purr off'}
              </motion.button>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={treats}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-4 flex items-center gap-2 font-hand text-2xl text-cocoa-soft"
              >
                <Paw className="size-5" />
                {treats === 0 ? 'Treat jar: untouched (for now)' : treats < 5 ? `${treats} treat${treats > 1 ? 's' : ''} served. More, please.` : `${treats} treats! Blaze is now 3% rounder.`}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Wave fill="var(--color-cream)" />
    </section>
  );
}
