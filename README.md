# Oinkfly

Marketing site for Oinkfly — a community for ambitious women entrepreneurs.
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## The brand in one line

**When pigs fly.** Everything — the mark, the motion, the copy — comes back to
building the thing everyone said was unrealistic.

- **Mark** — a winged pig, drawn as inline SVG in
  `src/components/brand/OinkflyMark.tsx`. No image request, crisp at any size,
  recolours with the theme. Its eye and nostrils knock through to
  `--pf-knockout`, so any element placing the mark on a raised surface should
  carry `.pf-on-surface` or `.pf-on-muted`. `src/components/shared/Logo.tsx`
  wraps it and stays the single source of truth for every logo placement.
- **Motion** — one language, in `src/components/motion/variants.ts`:
  everything *lifts*. One easing curve (expo-out), three durations, two travel
  distances, one stagger rhythm. Nothing bounces or drops in. Reduced motion is
  honoured globally in `globals.css` and per-component via `useReducedMotion`.

## Design system

Space Mono throughout; hierarchy comes from size and weight. Pink `#D8037D` is
an accent, never a large surface. All tokens live in `src/app/globals.css`
(`--pf-*`) and are theme-aware — the site ships light and dark variants.

## Multi-region architecture

The global site lives at `/`; regional sites at `/india`, `/dubai`, `/usa`.
They are **not** duplicated pages. Every route exists twice as a five-line
wrapper — once statically (`src/app/about/page.tsx`) and once under the
`[region]` segment (`src/app/[region]/about/page.tsx`) — and both render the
same component from `src/components/pages/`.

```
src/config/regions.ts   →  region objects (address, phone, currency, copy, form)
src/lib/region.ts       →  resolve a region from the URL, build region-aware paths
src/components/pages/*  →  one page component per page, region passed as a prop
src/app/**/page.tsx     →  thin wrappers that pick the region and render
```

**To add a region:** add one entry to `regions` in `src/config/regions.ts` and
its slug to `regionalSlugs`. It appears in the region selector, the sitemap and
the `hreflang` set automatically; no new pages are needed.

Region selection is always explicit — there are no IP-based redirects, so every
regional URL stays crawlable.

## Content and configuration

Nothing user-facing is hard-coded in a component.

| File | Holds |
| --- | --- |
| `src/config/site.ts` | identity, social links, navigation, integrations |
| `src/config/content.ts` | all marketing copy |
| `src/config/regions.ts` | per-region data and copy |
| `src/config/images.ts` | stock image placeholders |
| `src/config/flags.ts` | feature flags for built-but-hidden sections |
| `src/data/*.ts` | events, Knowledge Base entries, team, initiatives |

Each `src/data` module exposes accessor functions (`getEventsForRegion`,
`getEntriesByCategory`, …). Swapping to a CMS means changing those functions
and nothing else.

### Feature flags

`src/config/flags.ts` gates sections that are complete but not yet live —
homepage testimonials, the About page's Initiatives rail, and article comments.
These components are fully built; do not delete them, flip the flag when the
content is ready.

### Placeholders

Addresses, phone numbers, team names, speakers, event venues and article bodies
are explicit placeholders (`null`, or copy that says so). None of it is
invented. Everything is replaceable from the config/data files above.

### Logo

`src/components/shared/Logo.tsx` is the only place the wordmark is defined.
When the final artwork arrives, replace the contents of `LogoMark` with an
`<Image>` — every placement updates and no layout changes.

## Join Community → CRM

The "Join now" CTA points at a Google Form supplied via environment variables
(`NEXT_PUBLIC_JOIN_FORM_URL`, plus per-region overrides). Each region carries a
`form.crmSegment` tag so submissions can be routed. The intended flow is:

```
Google Form → Apps Script / Zapier → CRM_WEBHOOK_URL → CRM record
```

Until a form URL is configured the button falls back to a mailto and the page
says so — no URL is fabricated.

## SEO

`src/lib/seo.ts` builds per-page metadata: a unique title and description per
region, a canonical URL, and the full `hreflang` set (`en`, `en-IN`, `en-AE`,
`en-US`, `x-default`). `sitemap.ts` enumerates every page of every region.

## Images

Temporary stock photography from Unsplash, declared in `src/config/images.ts`
and rendered exclusively through `src/components/shared/ImageFrame.tsx`, which
owns the organic frame shapes (arch, blob, leaf, rect) and the corner caption
chip. When final photography lands, drop the files in `/public` and update the
`src` values; the `remotePatterns` entry in `next.config.ts` can then go.

## Structure

```
src/
├── app/                 routes (thin wrappers) + api, sitemap, robots
├── components/
│   ├── layout/          Container, Section, Navbar, Footer, SiteChrome
│   ├── pages/           one component per page — shared across all regions
│   ├── region/          region selector
│   ├── shared/          ImageFrame, Rail, Reveal, Logo, PageHeader…
│   └── ui/              Button, Card, Input, Select, Badge
├── config/              site, regions, content, images, flags, seo
├── data/                events, knowledge base, team
├── features/            page sections grouped by feature
├── hooks/  lib/  types/
```
