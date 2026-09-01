# PinkFly

Marketing site for PinkFly — a community for ambitious women entrepreneurs.
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## The brand

- **Logo** — a type-set wordmark, no symbol. `src/components/shared/Logo.tsx`
  is the single source of truth for every placement; the favicon at
  `src/app/icon.svg` is the matching PF monogram.
- **Motion** — one language, in `src/components/motion/variants.ts`:
  everything *lifts*. One easing curve (expo-out), three durations, two travel
  distances, one stagger rhythm. Nothing bounces or drops in. Reduced motion is
  honoured globally in `globals.css` and per-component via `useReducedMotion`.

## Homepage structure

Set by the wireframe, in this order — see `src/components/pages/HomePage.tsx`:

```
Hero banner carousel  →  every slide leads to About Us
Join CTA              →  FinalCTA
Impact                →  four figures, horizontal, one icon each
How we gather         →  Community, four image cards
Testimonials          →  hidden behind flags.testimonials
Why PinkFly exists   →  Mission
Join + newsletter     →  Join
```

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

## Content — everything is edited in Sanity

**Every page of this site is CMS-managed.** Not just the homepage: About,
Join Community, Events, the Knowledge Base, every article and event, every
policy page, the header, the footer and each regional site. If a PinkFly
admin could reasonably want to change it, it is a field in the Studio.

The Studio ships with the site at **`/studio`** — no separate deployment. It
also runs standalone for local editing:

```bash
npm run studio      # http://localhost:3333
```

A fresh dataset is empty until it is seeded — see *Seed content* below. Until
then the site renders its shipped seed content and the Studio looks bare.

### What is editable

| | |
| --- | --- |
| **Text** | headlines, eyebrows, subheads, paragraphs, section titles, card titles, descriptions, button and CTA text, supporting text, captions, quotes, form notes, empty-state and "not open yet" messages |
| **Images** | hero slides, section and banner images, card images, portraits, article and event thumbnails, social share images, an optional logo |
| **Links** | header and footer navigation, social links, policy links, registration form URLs, per-card and per-CTA destinations |
| **Repeated content** | events, Knowledge Base entries, team members, testimonials, initiatives, partners, FAQs, benefits, guidelines, impact figures, community cards |
| **Visibility** | every major section carries a Show/Hide switch, so a section can be turned off without deleting its content |

Icons are chosen from a fixed list (`sanity/schemas/objects/iconPicker.ts`) so
an editor can change one without being able to break the render.

### How it fits together

```
Sanity Studio (/studio)
   ↓  GROQ, one query per page
src/lib/cms/content.ts      resolves CMS values, falls back to the seed
   ↓  plain props
src/features/* components   unchanged layout, styling and motion
```

Components hold layout, styling, motion and interaction only — no editable
copy. Each page component fetches its own document once and hands every
section its slice.

### Publishing, unpublishing and the cache

Sanity is the source of truth whenever it answers. `cmsFetch` reports whether
the query reached Sanity, and the loaders read that:

| | |
|---|---|
| Sanity answers with a document | rendered |
| Sanity answers "no such document" (unpublished or deleted) | **not rendered** — the list is empty, the section hides, a detail route 404s |
| Sanity cannot be reached | seed content, so an outage never takes the site down |

Those last two used to be indistinguishable, which is why an unpublished
document kept appearing: a missing document looked like an outage, so the seed
was rendered in its place. A reference to an unpublished document also
dereferences to `null`, and those nulls are filtered out rather than rendered
as empty cards.

Freshness has two layers. Every query is cached by Next for 60 seconds and
tagged `sanity`, which bounds staleness even if nothing else is configured.
`POST /api/revalidate` purges that tag on demand, so a publish appears
immediately — point a Sanity webhook at it and set `SANITY_REVALIDATE_SECRET`
to the same secret. The route verifies the signature and refuses unsigned
requests. Setup steps are in the file's own comment.

### Seed content and the fallback

`src/config/*` and `src/data/*` still hold the site's shipped content. They
serve two purposes and neither is a second place to edit:

1. **The seed.** `npm run seed:sanity` imports all of it into a fresh dataset,
   after which the Studio is the source of truth.
2. **The fallback.** A field an editor has not filled in — or a Sanity outage,
   or a build before the CMS is configured — renders the seed value instead of
   a blank section. With `NEXT_PUBLIC_SANITY_PROJECT_ID` unset the whole site
   builds and runs from the seed.

The project id and dataset default to the PinkFly project, so in practice the
only thing the seed needs is a write token in `.env.local`:

```bash
# .env.local (gitignored — never commit the token)
SANITY_API_WRITE_TOKEN=sk...
```

```bash
npm run seed:sanity
```

Both are overridable if you are pointing at a different project or dataset:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx \
NEXT_PUBLIC_SANITY_DATASET=staging \
SANITY_API_WRITE_TOKEN=sk... \
npm run seed:sanity
```

Without a local checkout, the **Seed Sanity** workflow under the repository's
Actions tab does the same thing — it needs the token as the
`SANITY_API_WRITE_TOKEN` repository secret, and only ever runs when you start
it by hand.

Re-running restores the seed over those documents, so treat it as a reset, not
a sync.

### What deliberately stays in code

Region slugs, locales, timezones, currencies, Knowledge Base category keys and
in-page anchor ids. These are wiring, not copy — an editor changing a timezone
string would break date rendering rather than update a message. Region *names*,
copy, addresses, contact details and SEO are all editable.

### Placeholders

Phone numbers, team names, speakers, event venues and article bodies are still
explicit placeholders (`null`, or copy that says so). None of it is invented,
and all of it is now replaceable from the Studio rather than the codebase.

### Logo

`src/components/shared/Logo.tsx` is the only place the wordmark is defined.
When the final artwork arrives, replace the contents of `LogoMark` with an
`<Image>` — every placement updates and no layout changes.

## Join Community → Google Form

Registration is collected entirely in a Google Form. The site never asks for
the same details itself, so there is no second place a lead can go missing.

Set `NEXT_PUBLIC_JOIN_FORM_URL` (or the per-region variable in
`src/config/regions.ts`, which takes precedence) and every join CTA points at
it:

- `/join` shows the three steps and a single "Register now" button that opens
  the form in a new tab.
- The site-wide "Your seat is waiting" CTA on the homepage, About, Events,
  Knowledge Base and the region entry page also reads "Register now".
- Each link carries the region's `crmSegment`, so leads route to the right
  team.

Until a URL is supplied, `/join` says registration is opening shortly rather
than rendering a button with nowhere to go — no URL is ever invented.

## SEO

`src/lib/seo.ts` builds per-page metadata: a unique title and description per
region, a canonical URL, and the full `hreflang` set (`en`, `en-IN`, `en-AE`,
`en-US`, `x-default`). `sitemap.ts` enumerates every page of every region.

## Images

Every image is a `figure` in Sanity: an uploaded asset, or an external URL as a
fallback. Uploads win, so replacing a photograph is a drag-and-drop in the
Studio — the frame shape, crop, aspect ratio and dimensions belong to
`src/components/shared/ImageFrame.tsx` and do not change.

The seeded photography is still temporary Unsplash stock, and it is **not** the
Indian-women imagery the brand calls for. See `public/images/README.md` for the
shoot spec; the fix is now an upload per image rather than a code change.

## Structure

```
sanity/
├── sanity.config.ts     Studio configuration (mounted at /studio, and the
│                        config the standalone Studio runs on)
├── sanity.cli.ts        Sanity CLI configuration
├── schemas/             documents (pages, collections) + reusable objects
├── structure.ts         Studio navigation — pages as singletons
scripts/seed-sanity.ts   one-time import of the seed content
src/
├── app/                 routes (thin wrappers) + api, sitemap, robots, studio
├── lib/cms/             client, queries, loaders, seed-merge, icon map
├── components/
│   ├── layout/          Container, Section, Navbar, Footer, SiteChrome
│   ├── pages/           one component per page — shared across all regions
│   ├── region/          region selector
│   ├── shared/          ImageFrame, Rail, Reveal, Logo, PageHeader…
│   └── ui/              Button, Card, Input, Select, Badge
├── config/              seed content + fallbacks (site, regions, copy, images)
├── data/                events, knowledge base, team
├── features/            page sections grouped by feature
├── hooks/  lib/  types/
```
