import generated from './photos.generated.json';

export type Tag = 'naps' | 'sunbeams' | 'peekaboo' | 'portraits' | 'office';

export const TAGS: { id: Tag | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'Everything', emoji: '🐾' },
  { id: 'portraits', label: 'Portraits', emoji: '📸' },
  { id: 'naps', label: 'Naps', emoji: '💤' },
  { id: 'sunbeams', label: 'Sunbeams', emoji: '☀️' },
  { id: 'peekaboo', label: 'Peekaboo', emoji: '👀' },
  { id: 'office', label: 'Office cat', emoji: '💻' },
];

type Generated = {
  slug: string;
  width: number;
  height: number;
  srcset: { w: number; src: string }[];
  blur: string;
  date: string | null;
};

export type Photo = Generated & {
  file: string;
  caption: string;
  note: string;
  tags: Tag[];
};

// Captions keyed by original filename in "Blaze Photos/"
const INFO: Record<string, { caption: string; note: string; tags: Tag[] }> = {
  'PXL_20260603_080729817.jpg': { caption: 'Official portrait', note: 'Chin up. Paws together. Absolute professional.', tags: ['portraits', 'office'] },
  'PXL_20260719_164852730.jpg': { caption: 'The side profile', note: 'Those cheeks? Certified British.', tags: ['portraits'] },
  'PXL_20260704_160315469.jpg': { caption: 'Peekaboo!', note: 'You cannot see me. I am a mystery.', tags: ['peekaboo'] },
  'PXL_20260321_144855610.jpg': { caption: 'Nap with Goose', note: 'Best friends do everything together. Mostly sleep.', tags: ['naps'] },
  'PXL_20260407_083815427.MP.jpg': { caption: 'Sunbathing pro', note: 'Rotates every 20 minutes for an even tan.', tags: ['sunbeams', 'naps'] },
  'PXL_20260629_180447283.MP.jpg': { caption: 'Work-from-home assistant', note: 'Will be supervising your mouse arm today.', tags: ['office'] },
  'PXL_20260718_055215482.jpg': { caption: 'The mighty roar', note: 'Fearsome. Terrifying. Slightly sleepy.', tags: ['portraits'] },
  'PXL_20260621_150214269.jpg': { caption: 'Donut mode', note: 'Perfect circle achieved. Do not disturb.', tags: ['naps'] },
  'PXL_20260319_080016620.MP.jpg': { caption: 'Found the sunbeam', note: 'There is only one, and it belongs to Blaze.', tags: ['sunbeams'] },
  'PXL_20260315_132556928.MP.jpg': { caption: 'Gamer chair? My chair.', note: 'Seat has been claimed. Please find another.', tags: ['office', 'portraits'] },
  'PXL_20260525_170009373.jpg': { caption: 'Who goes there?', note: 'Guarding the cat tree castle.', tags: ['peekaboo'] },
  'PXL_20260714_203608292.jpg': { caption: 'Judging you, lovingly', note: 'The stare that means: dinner was 4 minutes ago.', tags: ['portraits'] },
  'PXL_20260423_194613712.jpg': { caption: 'Stream moderator', note: 'Keeping an eye on chat. And on you.', tags: ['office', 'portraits'] },
  'PXL_20260708_092347155.jpg': { caption: 'Neighbourhood watch', note: 'Reporting all birds to HQ.', tags: ['sunbeams'] },
  'PXL_20260508_174351553.MP.jpg': { caption: 'Sofa loaf', note: 'Bread? No. Just Blaze, perfectly proofed.', tags: ['naps'] },
  'PXL_20260221_231718680.NIGHT.jpg': { caption: 'Bedtime inspector', note: 'Making sure the duvet meets royal standards.', tags: ['portraits'] },
  'PXL_20260818_195935171.NIGHT.jpg': { caption: 'RGB whiskers', note: 'Gaming setup lighting hits different.', tags: ['portraits', 'office'] },
  '1100a4a9-baae-48c8-8fa1-8565e73adf18-copied-media~2.jpg': { caption: 'King of the high ground', note: 'Supervising the kingdom from the top shelf.', tags: ['peekaboo'] },
};

const gen = generated as Record<string, Generated>;

export const PHOTOS: Photo[] = Object.entries(INFO)
  .filter(([file]) => gen[file])
  .map(([file, info]) => ({ file, ...gen[file], ...info }));

export const photoByFile = (file: string): Photo => {
  const p = PHOTOS.find((x) => x.file === file);
  if (!p) throw new Error(`Missing photo ${file}`);
  return p;
};

export const formatDate = (date: string | null) =>
  date ? new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'A while ago';
