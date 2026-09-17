/**
 * Types for importing an image file.
 *
 * Next writes these into next-env.d.ts, which this repository does not commit
 * — so `tsc --noEmit` on a fresh checkout, which is what CI runs before any
 * build, had no idea what `import logo from "./logo.png"` meant. Referencing
 * the same types from a committed file makes the checkout self-describing.
 */
/// <reference types="next/image-types/global" />
