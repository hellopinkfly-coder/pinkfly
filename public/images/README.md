# Photography brief

**Every person shown on this site is an Indian woman** — founders, mentors,
speakers, members. This is a brand rule, not a preference. It is enforced in
one place: `src/config/images.ts`.

## Current state

The site currently ships **generic stock placeholders**. They depict women,
but they are not Indian-women photography and the Unsplash IDs have never
been visually verified. Replacing them is the last blocking task before
launch.

## How to replace them

No component changes are needed.

1. Drop the files into this folder, using the structure below.
2. In `src/config/images.ts`, swap each `src` from `u("…")` to
   `local("founders/ananya-rao.jpg")`.
3. Update the matching `alt` to describe the new photograph.

```
public/images/
├── founders/      # hero carousel portraits (4:5)
├── community/     # "How we gather" cards (4:5)
├── about/         # banner, founder story, guidelines (16:9 and 4:5)
├── events/        # event hero and cards (16:9)
└── team/          # executive team headshots (1:1)
```

## Specification

| | |
|---|---|
| Hero / community / about portraits | 4:5, 1000 × 1250 px min |
| Banners, events | 16:9, 1920 × 1080 px min |
| Team headshots | 1:1, 800 × 800 px min |
| Format | `.jpg` ~80% quality, or `.webp` |
| Weight | under 250 KB each — Next.js re-encodes to AVIF/WebP on top |
| Naming | `firstname-lastname.jpg`, lowercase, hyphenated |

## Art direction

The brief is **relatable, not stock**. A visitor should recognise herself.

- **Indian women**, photographed where they actually work — a workshop, a
  kitchen counter, a shop floor, a shared desk. Not a studio backdrop, not a
  boardroom nobody has sat in.
- Diverse across age, region, skin tone, industry and body type. Avoid a set
  that reads as one demographic in four outfits.
- Natural light, warm tones. The palette should sit beside `#D8037D` without
  fighting it.
- Mid-action beats posed: packing an order, checking stock, mid-sentence.
- Leave headroom, keep the subject in the upper two-thirds — the bottom third
  carries the caption scrim on hero slides.
- **No AI-generated imagery.** It is recognisable, and on a site about real
  women it is actively damaging.

## Before publishing

- Written consent from every person shown, covering commercial web use.
- If licensing stock rather than shooting, keep the licence on file and
  confirm it permits commercial use.
- `alt` text must describe what is actually in the frame — the person and
  what they are doing, not "woman smiling". Never describe a photo as showing
  an Indian founder until it does.
