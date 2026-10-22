# Blazehub 🐾

https://blazehub-eight.vercel.app/
<img width="2540" height="1269" alt="image" src="https://github.com/user-attachments/assets/182ee83b-5c47-4b98-8491-dc0230c77ec1" />

A cute, whimsical fan site for **Blaze**, an orange British Shorthair.

Built with **React 19 + Vite 8 + TypeScript**, styled with **Tailwind CSS v4**, animated with **Motion** (the successor to Framer Motion), plus **Lenis** smooth scrolling and **canvas-confetti** for treats.

## What's on the page

- **Loader**: a bouncing Blaze face, then a circular curtain reveal
- **Hero**: spring-animated title, a morphing blob photo frame, spinning ring text, doodles that drift with your mouse
- **Pawprint cursor + trail**: little paws follow your mouse, stepping left/right (desktop only)
- **Scroll cat**: a tiny cat walks along the top of the page as you scroll
- **Marquee**: two strips that speed up, skew and reverse with your scroll velocity
- **Meet Blaze**: a tilting 3D "Official Cat ID" card and counting-up stats
- **Gallery**: polaroids with washi tape, filter chips with animated reflow, and a lightbox that morphs from the card (arrow keys, swipe, Esc)
- **A day in the life**: a pinned horizontal timeline where the sky fades from sunrise to a starry night
- **Purr-sonality**: animated meters and sticky notes
- **Pet Blaze**: stroke the cartoon face to make it purr (hearts, optional synthesized purr sound, a remembered pet counter), boop the nose, throw treat confetti
- **Easter egg**: type `meow` anywhere

All motion respects the visitor's *reduce motion* setting.

## Editing content

| What | Where |
| --- | --- |
| Facts, stats, traits, likes, the daily timeline | `src/data/blaze.ts` |
| Photo captions, notes and filter tags | `src/data/photos.ts` |
| Colours and fonts | `@theme` block in `src/index.css` |

## Adding new photos

1. Drop the new photos into `Blaze Photos/`.
2. Run `npm run photos`. This writes resized WebP files to `public/photos/`, rebuilds `src/data/photos.generated.json`, and strips EXIF/GPS metadata so no location data goes online.
3. Add a caption entry for each new file in `src/data/photos.ts`. Photos without a caption entry are skipped.

The optimized files in `public/photos/` and `photos.generated.json` must be committed, because Vercel builds from them. The originals in `Blaze Photos/` are never deployed.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Deploying to Vercel (free Hobby plan)

It's a static site, so it fits comfortably in the free tier. `vercel.json` already sets the build command, output folder and long-lived caching for images.

**Option A: through GitHub (recommended, auto-deploys on every push)**

1. Push this folder to a new GitHub repository.
2. On vercel.com, click **Add New → Project** and import the repo.
3. Vercel detects Vite automatically. Click **Deploy**.

**Option B: from your computer with the Vercel CLI**

```bash
npx vercel
```

Then run `npx vercel --prod` to publish to production.
