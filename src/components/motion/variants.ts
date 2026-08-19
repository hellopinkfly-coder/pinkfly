import type { Variants, Transition } from "framer-motion";

/* ==========================================================================
   Pink Fly — Motion System
   --------------------------------------------------------------------------
   One brand, one motion language. The metaphor is FLIGHT: everything on this
   site lifts. Elements rise into place, they never drop in, never spin, never
   bounce. Three durations, one easing curve, one direction.

   Use these tokens everywhere. If a component needs a bespoke transition,
   it is almost certainly wrong.
   ========================================================================== */

/** Signature easing — expo-out. Fast start, long settle. Reads as "premium". */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Easing for continuous ambient motion (float, orbit, drift). */
export const EASE_AMBIENT = "easeInOut" as const;

/** The only three durations on the site. */
export const DURATION = {
  /** Hovers, taps, colour changes. */
  fast: 0.28,
  /** The default: section reveals, card entrances. */
  base: 0.65,
  /** Hero / feature moments only. */
  slow: 0.9,
} as const;

/** The only two travel distances. Small for text, large for feature blocks. */
export const LIFT = { sm: 16, lg: 32 } as const;

/** Stagger rhythm — consistent everywhere children animate in sequence. */
export const STAGGER = 0.08;

export const transition: Transition = {
  duration: DURATION.base,
  ease: EASE,
};

/* ------------------------------------------------------------- Entrances -- */

/** The house entrance. Rise + fade. Used by <Reveal> and almost everything. */
export const lift: Variants = {
  hidden: { opacity: 0, y: LIFT.sm },
  visible: { opacity: 1, y: 0, transition },
};

/** Bigger travel — for feature blocks, images, and full compositions. */
export const liftLarge: Variants = {
  hidden: { opacity: 0, y: LIFT.lg },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/** Rise + settle in scale. Reserved for the hero and the impact visual. */
export const liftScale: Variants = {
  hidden: { opacity: 0, y: LIFT.lg, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
};

/** Parent that staggers its children. Children should use `lift`. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.05 } },
};

/** Slower stagger for small satellite elements (orbiting icons, chips). */
export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

/* ------------------------------------------------------------- Ambient -- */

/**
 * Gentle, endless hover for anything that should feel a little airborne —
 * never busy.
 * `seed` offsets each element so a group never moves in lockstep.
 */
export function float(seed = 0, distance = 8, duration = 6) {
  return {
    animate: { y: [0, -distance, 0] },
    transition: {
      duration: duration + (seed % 3),
      repeat: Infinity,
      ease: EASE_AMBIENT,
      delay: seed * 0.4,
    },
  };
}

/* --------------------------------------------------------- Carousel -- */

/**
 * Directional slide used by the story carousel. Slides travel along the
 * reading axis and lift very slightly, so the carousel speaks the same
 * language as every scroll reveal.
 */
export const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 48 : -48, y: 8 }),
  center: { opacity: 1, x: 0, y: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -48 : 48, y: -8 }),
};

/* -------------------------------------------------- Legacy aliases -- */
/** Kept so existing imports keep working; prefer `lift` / `stagger`. */
export const fadeUp = lift;
export const scaleIn = liftScale;
export const staggerContainer = stagger;
