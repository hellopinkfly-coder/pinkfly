/**
 * Feature flags.
 *
 * Sections that are fully built but not yet ready to go live are switched off
 * here rather than deleted — flip a flag to `true` to enable the section.
 */
export const flags = {
  /** Homepage testimonials — wireframe notes "to be hidden for now". */
  testimonials: false,
  /** About page → Initiatives. Built and ready; enable once content exists. */
  initiatives: false,
  /** Article comment threads — needs a backend before it can be enabled. */
  articleComments: false,
} as const;

export type Flags = typeof flags;
