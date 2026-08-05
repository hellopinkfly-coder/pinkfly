/**
 * Join conditional class names into a single string.
 * Lightweight, dependency-free. Swap for `clsx` + `tailwind-merge`
 * if you later need class de-duplication/merging.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
