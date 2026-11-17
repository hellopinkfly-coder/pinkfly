import { LogoMark } from "@/components/shared/Logo";
import { siteConfig } from "@/config/site";

/**
 * The loading screen.
 *
 * Next renders this the moment a navigation starts and the page on the way
 * in has not resolved yet. Without it a slow page looks like a dead tap —
 * nothing moves, and on a phone that reads as the site hanging rather than
 * as the site working.
 *
 * Three things, and no more: the lockup, one line saying who this is for,
 * and a hairline that sweeps beneath them. A loading screen is read for a
 * second or two at most, so anything it adds past that is a page the reader
 * never asked for standing in front of the one they did.
 *
 * The mark breathes rather than spins — a spinner says "busy", a breath
 * says "nearly there". Both movements stop under `prefers-reduced-motion`,
 * which leaves the same three things, held still.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center"
    >
      <LogoMark size="lg" className="pf-breathe" withTagline />

      <p className="max-w-sm text-balance text-sm leading-relaxed text-[var(--pf-muted)]">
        A community for ambitious women founders.
      </p>

      <span className="pf-loadbar" aria-hidden />
      <span className="sr-only">Loading {siteConfig.name}</span>
    </div>
  );
}
