# Oinkfly

India's community for ambitious women founders. A [Next.js](https://nextjs.org)
application using the App Router, TypeScript, and Tailwind CSS.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## The brand in one line

**When pigs fly.** Everything — the mark, the motion, the copy — comes back to
building the thing everyone said was unrealistic.

- **Mark** — a winged pig, drawn as inline SVG in
  `src/components/brand/OinkflyMark.tsx`. No image request, crisp at any size,
  recolours with the theme. Its eye and nostrils knock through to
  `--pf-knockout`, so any element that puts the mark on a raised surface should
  carry `.pf-on-surface` or `.pf-on-muted`.
- **Motion** — one language, defined once in `src/components/motion/variants.ts`:
  everything *lifts*. One easing curve (expo-out), three durations, two travel
  distances, one stagger rhythm. Carousels slide along the reading axis and
  settle; ambient elements float. Nothing bounces, nothing drops in. Reduced
  motion is honoured globally by the guard in `globals.css` and per-component
  via `useReducedMotion`.
- **Type** — Space Mono throughout. Hierarchy comes from size and weight only.
- **Colour** — pink (`#D8037D`) is an accent, never a surface. Tokens live at
  the top of `src/app/globals.css` and are themed for light and dark.

## Editing content

All copy, stats, stories, and carousel slides live in `src/config/content.ts`;
site metadata and navigation live in `src/config/site.ts`. Sections read from
these, so messaging changes need no component edits.

## Before launch

Three things are still marked `TODO(pre-launch)` in the source:

1. **Founder photographs** — the hero carousel renders a branded fallback until
   real portraits are added. See `public/images/founders/README.md` for the
   shoot spec and how to drop them in.
2. **Testimonials** — the quotes in `content.ts` (`stories`) are illustrative.
   Replace with consented quotes from real members.
3. **Events and knowledge base listings** — placeholder entries in
   `src/app/(routes)/events/page.tsx` and `knowledge-base/page.tsx`. Point them
   at real listings or a CMS.

The impact figures in `proof.stats` should also be confirmed against source
data before publishing.

## Project Structure

```
src/
├── app/            # App Router: routes, layouts, pages
│   └── (routes)/   # Route groups for organizing sections
├── components/
│   ├── brand/      # The Oinkfly mark, wordmark, and flight scene
│   ├── motion/     # The shared motion language
│   ├── ui/         # Primitive, presentational UI elements
│   ├── layout/     # Structural components (navbar, footer, section)
│   └── shared/     # Cross-feature composite components
├── features/       # One folder per homepage section
├── lib/            # Framework-agnostic logic
├── hooks/          # Reusable React hooks
├── types/          # Shared TypeScript types
└── config/         # Content and site configuration

public/             # Static assets (images, icons, fonts)
```

Path alias `@/*` maps to `src/*`.
