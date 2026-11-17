import { LogoMark } from "@/components/shared/Logo";

/**
 * The route-level loading screen.
 *
 * Next renders this the moment a navigation starts and a server component on
 * the way in has not resolved yet. Without it, a slow page looks like a dead
 * tap: nothing moves, and on a phone that reads as the site hanging rather
 * than as the site working. The spinner in the nav links answers the tap;
 * this answers the wait that follows it.
 *
 * The mark is the brand's own, breathing rather than spinning — a spinner
 * says "busy", a slow pulse says "nearly there" — with a hairline progress
 * sweep under it so there is always something moving even if the pulse is
 * stilled. Both animations are suppressed under `prefers-reduced-motion`,
 * where the screen is simply the mark on the page colour.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24"
    >
      <LogoMark size="lg" className="pf-breathe" />
      <span className="pf-loadbar" aria-hidden />
      <span className="sr-only">Loading</span>
    </div>
  );
}
