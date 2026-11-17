# Curious by Design — Priya Singh

A personal-brand site positioning Priya Singh as a Senior/Advanced Product Designer for
Enterprise AI. Editorial, Swiss-inspired, built for an Atlassian / Google audience.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Lenis smooth scroll.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Edit the content
**Everything you write lives in one file:** [`lib/content.ts`](lib/content.ts).
Change copy, metrics, links, and case studies there — every section reads from it.

### Case-study content status
- **cnMaestro** — ✅ real content from the Figma case study (full before/after metrics).
- **Honeywell Campus Management** — ✅ real content from the Figma product file.
- **Cessna Pet App** — 🟡 product narrative is real (read from the app UI), but **role,
  timeframe, and measured outcomes are unconfirmed** (search `⚠ confirm`). The Figma file
  had no written case study. Fill these in and remove `placeholder: true` on the entry.

### ⚠ Still to replace before launch
- **Cessna** role / dates / outcome metrics (see above).
- **Testimonials** — swap in two real quotes, or delete the section import in
  `app/page.tsx`.
- **Project visuals** — abstract SVGs; swap for real screenshots (see below).

## Swap the abstract visuals for real screenshots
Each project currently shows an on-brand abstract SVG
([`components/ProjectVisual.tsx`](components/ProjectVisual.tsx)). To use real screenshots,
drop images in `public/` and replace the `<svg>` for a given `slug` with a Next `<Image>`.

## Structure
- `app/page.tsx` — the single-scroll home experience (all sections)
- `app/work/[slug]/page.tsx` — one page per case study (statically generated)
- `components/` — one file per section + interaction primitives (Cursor, SmoothScroll,
  ReadingProgress, MagneticButton, Reveal, Loader)

## Accessibility & performance
- Respects `prefers-reduced-motion` (smooth scroll, cursor, loader, reveals all degrade).
- Semantic landmarks, keyboard-navigable, AA-minded contrast.
- Static export–friendly; deploy on Vercel.

## Deploy
Deploy on Vercel. Production domain: **pixelsbypurpose.com** (set in
`app/layout.tsx` → `metadataBase` / Open Graph). Point the domain at the Vercel
project in the Vercel dashboard.

## Résumé
Served from `public/Priya_Singh_Resume.pdf`.
