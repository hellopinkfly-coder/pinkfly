import Link from "next/link";
import { PinkFlyMark } from "@/components/brand/PinkFlyMark";
import { cn } from "@/lib/utils";

/**
 * Pink Fly logo.
 *
 * SINGLE SOURCE OF TRUTH for the logo. Every placement — navbar, footer,
 * article header — renders this, so the brand only has to change here.
 *
 * The mark is a winged pig drawn as inline SVG (see `PinkFlyMark`): crisp at
 * any size, themed via `currentColor`, and free of an image request. If final
 * artwork ever lands, swap the contents of <LogoMark> for an <Image> — the
 * mark keeps its box, so no layout changes are needed.
 */

type LogoProps = {
  className?: string;
  /** Visual size. `sm` is the navbar, `md` the footer. */
  size?: "sm" | "md" | "lg";
  /** Where the logo links to — region-aware callers pass a prefixed path. */
  href?: string;
  /** Render light, for use over a dark full-bleed hero. */
  onDark?: boolean;
};

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
} as const;

/** Pixel size of the mark for each type size, so the lockup stays balanced. */
const markSizes = { sm: 24, md: 28, lg: 34 } as const;

export function LogoMark({
  className,
  size = "sm",
  onDark = false,
}: Omit<LogoProps, "href">) {
  return (
    <span
      className={cn(
        "pf-lockup inline-flex items-center gap-2 font-[family-name:var(--font-display)] font-bold tracking-tight transition-colors duration-300",
        onDark ? "text-white" : "text-[var(--pf-heading)]",
        sizes[size],
        className
      )}
    >
      <PinkFlyMark
        size={markSizes[size]}
        wing={onDark ? 0.75 : 0.6}
        className={cn(
          "shrink-0",
          onDark ? "text-white" : "text-[var(--pf-accent)]"
        )}
        // Over a dark hero there is no flat surface to knock through to, so
        // the eye and nostrils are left open rather than punched in a colour
        // that would not match the photograph behind them.
        style={onDark ? { ["--pf-knockout" as string]: "transparent" } : undefined}
        aria-hidden
      />
      <span>
        Pink
        <span className={onDark ? "text-white/70" : "text-[var(--pf-accent)]"}>
          Fly
        </span>
      </span>
    </span>
  );
}

export function Logo({
  className,
  size = "sm",
  href = "/",
  onDark = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Pink Fly — home"
      className={cn(
        "inline-flex items-center transition-opacity duration-200 hover:opacity-80",
        className
      )}
    >
      <LogoMark size={size} onDark={onDark} />
    </Link>
  );
}
