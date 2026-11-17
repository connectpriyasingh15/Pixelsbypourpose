# CLAUDE.md — Curious by Design (Priya Singh)

Personal-brand site positioning Priya Singh as a Senior/Advanced Product Designer for
Enterprise AI. Tone and look: editorial, Swiss-inspired, aimed at an Atlassian / Google
hiring audience. Keep new work consistent with that — restrained, typographic, precise.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Lenis smooth scroll.

## Commands
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — run before committing to catch type/build errors
```

## Where things live
- `lib/content.ts` — **single source of truth for all copy**: text, metrics, links, case
  studies. Change content here, not inside components. Every section reads from it.
- `app/page.tsx` — single-scroll home page (imports every section)
- `app/work/[slug]/page.tsx` — one statically generated page per case study
- `app/layout.tsx` — `metadataBase` / Open Graph; production domain `pixelsbypurpose.com`
- `components/` — one file per section, plus interaction primitives: Cursor, SmoothScroll,
  ReadingProgress, MagneticButton, Reveal, Loader
- `components/ProjectVisual.tsx` — abstract SVG per project `slug`
- `public/Priya_Singh_Resume.pdf` — résumé download

## Rules
- **Never invent facts** about Priya's work: roles, dates, metrics, client outcomes or
  testimonials. If something is unknown, leave a `⚠ confirm` marker and ask.
- **Accessibility is required:** respect `prefers-reduced-motion` in any new animation
  (smooth scroll, cursor, loader and reveals already degrade), use semantic landmarks,
  keep everything keyboard-navigable, and keep AA contrast.
- Keep the site static-export friendly (no server-only features). Deploys on Vercel.
- To replace a project visual with a screenshot: put the image in `public/` and swap that
  slug's `<svg>` in `ProjectVisual.tsx` for a Next `<Image>`.

## Content status
- **cnMaestro** — ✅ real content from the Figma case study (full before/after metrics).
- **Honeywell Campus Management** — ✅ real content from the Figma product file.
- **Cessna Pet App** — 🟡 product narrative is real, but role, timeframe and measured
  outcomes are unconfirmed (search `⚠ confirm`). Once filled in, remove
  `placeholder: true` from its entry.

## Still to do before launch
- Cessna role / dates / outcome metrics.
- Testimonials: swap in two real quotes, or remove the section import in `app/page.tsx`.
- Project visuals: replace the abstract SVGs with real screenshots.
