// Turns the originals in "Blaze Photos/" into web-ready WebP files in public/photos/
// and writes src/data/photos.generated.json (sizes + tiny blur placeholders).
// sharp drops EXIF/GPS metadata by default, so no location data ends up online.
// Run with: npm run photos
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'Blaze Photos');
const outDir = path.join(root, 'public', 'photos');
const manifestPath = path.join(root, 'src', 'data', 'photos.generated.json');
const WIDTHS = [480, 960];

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

const files = (await fs.readdir(srcDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const manifest = {};

for (const file of files) {
  const input = path.join(srcDir, file);
  const base = sharp(input).rotate();
  const { width, height } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const slug = slugFor(file);
  const srcset = [];

  for (const w of WIDTHS) {
    const target = Math.min(w, width);
    const name = `${slug}-${w}.webp`;
    await base.clone().resize({ width: target }).webp({ quality: 80, effort: 5 }).toFile(path.join(outDir, name));
    srcset.push({ w: target, src: `/photos/${name}` });
  }

  const blurBuf = await base.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  const match = file.match(/PXL_(\d{4})(\d{2})(\d{2})/);

  manifest[file] = {
    slug,
    width,
    height,
    srcset,
    blur: `data:image/webp;base64,${blurBuf.toString('base64')}`,
    date: match ? `${match[1]}-${match[2]}-${match[3]}` : null,
  };
  console.log(`✓ ${file} → ${slug}`);
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// Social share card (1200x630) built from the desk portrait
const ogSource = path.join(srcDir, 'PXL_20260603_080729817.jpg');
await sharp(ogSource)
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(root, 'public', 'og-image.jpg'));

console.log(`\nWrote ${files.length} photos + og-image.jpg`);

function slugFor(file) {
  const m = file.match(/PXL_(\d{8})_(\d{6})/);
  if (m) return `blaze-${m[1]}-${m[2]}`;
  return 'blaze-' + file.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 8).toLowerCase();
}
