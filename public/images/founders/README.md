# Founder portraits — hero carousel

Drop the photographs in this folder, then add a `src` to the matching slide in
`src/config/content.ts` (`hero.slides`). No component changes are needed.

```ts
{
  src: "/images/founders/ananya-rao.jpg",
  alt: "Ananya Rao at her workbench in Bengaluru, checking a run of hand-blocked textiles.",
  name: "Ananya Rao",
  role: "Founder, Studio Marigold",
  city: "Bengaluru",
}
```

A slide with no `src` falls back to the branded portrait treatment, so the site
never shows a broken image while the shoot is still in progress.

## Spec

| | |
|---|---|
| Aspect ratio | 4:5 portrait (the frame crops to this) |
| Size | 1000 × 1250 px minimum |
| Format | `.jpg` at ~80% quality, or `.webp` |
| Weight | under 250 KB each — Next.js re-encodes and serves AVIF/WebP on top |
| Naming | `firstname-lastname.jpg`, lowercase, hyphenated |

## Art direction

The brief is **relatable, not stock**. Visitors should recognise themselves.

- Real Indian women founders, photographed where they actually work — a
  workshop, a kitchen counter, a shop floor, a shared desk. Not a studio
  backdrop, not a boardroom nobody has ever sat in.
- Natural light, warm tones. The palette should sit next to `#D8037D` without
  fighting it.
- Mid-action beats posed: packing an order, checking stock, mid-sentence with
  a colleague.
- Leave headroom and keep the subject in the upper two-thirds — the bottom
  third carries the caption scrim.
- A range of ages, regions, industries and body types. One founder per slide.

## Before publishing

- Get **written consent** from every person shown, covering web use.
- If you licence stock instead of shooting, keep the licence on file and
  confirm it permits commercial web use.
- Match `alt` text to what is actually in the frame — describe the person and
  what they are doing, not "woman smiling".
