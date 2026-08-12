import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Pink Fly wordmark.
 *
 * SINGLE SOURCE OF TRUTH for the logo. The final artwork is not available
 * yet, so this renders the type-set wordmark. When the real logo lands, swap
 * the contents of <LogoMark> for an <Image src="/images/logo.svg" …> — every
 * placement (navbar, footer, article header) updates at once and no layout
 * changes are needed, because the mark keeps its box.
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

export function LogoMark({
  className,
  size = "sm",
  onDark = false,
}: Omit<LogoProps, "href">) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-display)] font-bold tracking-tight transition-colors duration-300",
        onDark ? "text-white" : "text-[var(--pf-heading)]",
        sizes[size],
        className
      )}
    >
      Pink
      <span className={onDark ? "text-white/70" : "text-[var(--pf-accent)]"}>
        Fly
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
