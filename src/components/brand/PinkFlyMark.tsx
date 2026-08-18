import * as React from "react";

/* ==========================================================================
   Pink Fly — the mark
   --------------------------------------------------------------------------
   A pig with wings. The whole brand hangs off one line: "when pigs fly" —
   the thing everyone said was impossible, shipped anyway.

   The mark is drawn, not photographed: it stays crisp at any size, recolours
   with the theme, and adds nothing to the page weight.
   ========================================================================== */

type MarkProps = Omit<React.SVGProps<SVGSVGElement>, "opacity"> & {
  size?: number;
  /** Wing opacity. Lower it on busy backgrounds. */
  wing?: number;
};

export function PinkFlyMark({
  size = 32,
  wing = 0.6,
  className,
  ...props
}: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      {...props}
    >
      {/* Wing — three fanned feathers, swept up and back */}
      <g className="pf-wing" opacity={wing}>
        <path d="M28 33C20 26 10 14 14.5 10.5 19 7 26 22 28 33Z" fill="currentColor" />
        <path d="M28 33C18 28 6.5 20 8.5 15 11 10 24 24 28 33Z" fill="currentColor" />
        <path d="M28 33C18 33 6 30 6.5 25 7.5 20 22 28 28 33Z" fill="currentColor" />
      </g>

      {/* Curly tail */}
      <path
        d="M16.5 36.5c-4.5-1.5-8 1.5-6.5 4.8 1.3 2.9 5.6 2 5.3-1.2"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />

      {/* Ears */}
      <path d="M23 28 24.5 17.5 33 25.5Z" fill="currentColor" />
      <path d="M38.5 25 46 19.5 47 29Z" fill="currentColor" />

      {/* Trotters */}
      <rect x="24" y="46" width="5" height="9" rx="2.5" fill="currentColor" />
      <rect x="36" y="46" width="5" height="9" rx="2.5" fill="currentColor" />

      {/* Body */}
      <ellipse cx="33" cy="38" rx="17" ry="13" fill="currentColor" />

      {/* Snout — nostrils and eye are knocked out to the page background */}
      <ellipse cx="48" cy="40" rx="6.5" ry="5.5" fill="currentColor" />
      <ellipse cx="46.3" cy="40" rx="1.15" ry="1.6" fill="var(--pf-knockout)" />
      <ellipse cx="49.7" cy="40" rx="1.15" ry="1.6" fill="var(--pf-knockout)" />
      <circle cx="40" cy="33" r="2" fill="var(--pf-knockout)" />
    </svg>
  );
}

/* -------------------------------------------------------------- Wordmark -- */

type WordmarkProps = {
  className?: string;
  /** Pixel size of the mark beside the word. */
  markSize?: number;
};

/**
 * Mark + word lockup — the only place the brand name is set as a logo.
 * On hover the wings lift once (see `.pf-lockup` in globals.css).
 */
export function PinkFlyWordmark({ className, markSize = 26 }: WordmarkProps) {
  return (
    <span
      className={[
        "pf-lockup inline-flex items-center gap-2 font-[family-name:var(--font-display)] font-bold tracking-tight text-[var(--pf-heading)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PinkFlyMark
        size={markSize}
        className="shrink-0 text-[var(--pf-accent)]"
        aria-hidden
      />
      <span>
        Pink<span className="text-[var(--pf-accent)]">Fly</span>
      </span>
    </span>
  );
}
