/**
 * How large a page headline is set.
 *
 * The display scale is deliberately big — a hero headline is the first thing
 * on the page and is meant to carry it. But how big is right depends on the
 * words: "Events" wants the full size, a nine-word sentence set over a
 * photograph does not, and the person writing the sentence is the one who can
 * see that. So it is an editor's choice rather than a number in a stylesheet,
 * and it is a choice between three sizes rather than a free number — a font
 * size box invites 43px, which belongs to no scale and matches nothing else
 * on the site.
 *
 * Every option keeps the same fluid behaviour: each is a clamp that grows
 * with the screen, so a "small" headline is still a headline on a phone.
 */
export type HeadingSize = "large" | "medium" | "small";

const CLASSES: Record<HeadingSize, string> = {
  large: "pf-display",
  medium: "pf-display pf-display--md",
  small: "pf-display pf-display--sm",
};

/** The class for a heading size, falling back to the full scale. */
export function headingSizeClass(size: HeadingSize | undefined): string {
  return CLASSES[size ?? "large"] ?? CLASSES.large;
}

/** What the Studio offers. Shared so the schema and the code cannot drift. */
export const HEADING_SIZE_OPTIONS: { title: string; value: HeadingSize }[] = [
  { title: "Large — the default", value: "large" },
  { title: "Medium — for a longer headline", value: "medium" },
  { title: "Small — for a headline of several words", value: "small" },
];
