import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names with Tailwind conflict resolution.
 * `clsx` handles conditionals; `tailwind-merge` de-dupes conflicting
 * utilities (e.g. `px-2 px-4` → `px-4`) so component overrides work.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
