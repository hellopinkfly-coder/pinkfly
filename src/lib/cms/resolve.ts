import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset, cmsEnabled } from "../../../sanity/env";

/**
 * Turning CMS values into the shapes the components already expect.
 *
 * Two rules run through this file:
 *
 *  1. **Seed wins over nothing.** `pick` returns the seed value whenever the
 *     CMS field is absent or empty, so a half-filled document degrades to the
 *     shipped content instead of a blank section.
 *  2. **Shapes never change.** Every helper returns exactly the type the
 *     component took before — the presentation layer is untouched.
 */

const builder = cmsEnabled ? imageUrlBuilder({ projectId, dataset }) : null;

/** A Sanity image value: the asset reference, plus crop and hotspot. */
type SanityImage = {
  _type?: string;
  _ref?: string;
  asset?: { _ref?: string; _type?: string } | null;
  crop?: unknown;
  hotspot?: unknown;
};

/**
 * Sanity's `figure` object, as it comes back from GROQ.
 *
 * `asset` is the figure's *upload* field, and its type is `image` — so the
 * asset reference sits one level further in, at `asset.asset._ref`. The flat
 * shape is accepted too, for figures written directly as an image.
 */
export type CmsFigure = {
  asset?: SanityImage | null;
  url?: string | null;
  alt?: string | null;
  label?: string | null;
  focal?: string | null;
} | null | undefined;

export type ResolvedImage = {
  src: string;
  alt: string;
  label?: string;
  focal?: string;
};

/**
 * An uploaded asset beats an external URL, which beats the seed image. This
 * is what makes "replace the photo in Sanity" a drag-and-drop: the frame,
 * crop and dimensions are the component's, only the source changes.
 */
export function resolveImage(
  figure: CmsFigure,
  seed: ResolvedImage
): ResolvedImage;
export function resolveImage(
  figure: CmsFigure,
  seed?: ResolvedImage
): ResolvedImage | undefined;
export function resolveImage(
  figure: CmsFigure,
  seed?: ResolvedImage
): ResolvedImage | undefined {
  if (!figure) return seed;

  let src: string | undefined;
  const image = uploaded(figure.asset);
  if (image && builder) {
    src = builder.image(image).auto("format").fit("crop").width(2000).quality(85).url();
  } else if (figure.url) {
    src = figure.url;
  }

  if (!src) return seed;

  return {
    src,
    alt: figure.alt || seed?.alt || "",
    label: figure.label || seed?.label,
    focal: figure.focal || seed?.focal,
  };
}

/**
 * The uploaded image on a figure, whichever way round it was written.
 *
 * The `figure` schema names its upload field `asset` and types it `image`, so
 * a real upload arrives as `asset.asset._ref`. Returning the object the URL
 * builder wants — reference plus crop and hotspot — keeps the editor's chosen
 * focal point instead of centring every crop.
 */
function uploaded(value: SanityImage | null | undefined): SanityImage | undefined {
  if (!value) return undefined;
  if (value.asset?._ref) return value;
  if (value._ref) return { asset: { _ref: value._ref, _type: "reference" } };
  return undefined;
}

/** Empty is the same as missing — an editor clearing a field gets the seed. */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** CMS value when it has one, seed otherwise. */
export function pick<T>(cms: T | null | undefined, seed: T): T {
  return isEmpty(cms) ? seed : (cms as T);
}

/**
 * Booleans are their own case: `false` is a real value an editor chose (a
 * section switched off), so it must not fall through to the seed.
 */
export function pickBool(cms: boolean | null | undefined, seed: boolean): boolean {
  return typeof cms === "boolean" ? cms : seed;
}

/**
 * The seed list to fall back to.
 *
 * When Sanity answered (`live`), an absent or empty list is a real answer —
 * every item was unpublished or removed — so there is nothing to render and
 * the seed must not stand in for it. The seed is only for an outage.
 */
export function fallback<T>(items: T[], live: boolean): T[] {
  return live ? [] : items;
}

/**
 * The seed default for a section's visibility switch.
 *
 * When Sanity answered but the page document is gone, its sections have no
 * content behind them and stay hidden rather than reverting to the seed.
 */
export function fallbackFlag(value: boolean, live: boolean, doc: unknown): boolean {
  return live && !doc ? false : value;
}

/** Map a CMS list onto the seed's shape, keeping the seed when the list is empty. */
export function pickList<C, T>(
  cms: C[] | null | undefined,
  seed: T[],
  map: (item: C, index: number) => T
): T[] {
  if (!cms || cms.length === 0) return seed;
  return cms.map(map);
}
