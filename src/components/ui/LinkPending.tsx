"use client";

import { useLinkStatus } from "next/link";

/**
 * The spinner a pressed link grows while the next page is still coming.
 *
 * A press state answers the tap, but it lasts as long as the finger does. On
 * a slow connection the page then takes a second or two to arrive and the
 * button goes back to looking idle — so the visitor taps again, and the site
 * feels broken rather than busy. `useLinkStatus` reports Next's own
 * navigation as pending, which is the honest signal: it starts when the
 * router starts work and ends when the new page is ready to paint.
 *
 * It renders nothing at all until that happens, so an instant navigation —
 * a prefetched page, which is most of them — never flashes a spinner.
 */
export function LinkPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span
      // Decorative: the destination's own heading announces the new page, so
      // a screen reader gains nothing from narrating the wait.
      aria-hidden
      className="pf-link-spinner inline-block h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-current border-r-transparent align-[-1px]"
    />
  );
}
