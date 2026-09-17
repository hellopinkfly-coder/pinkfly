import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ResolvedImage } from "@/lib/cms/resolve";

/**
 * Pinkfly logo.
 *
 * SINGLE SOURCE OF TRUTH for the logo. Every placement — navbar, footer,
 * article header — renders this, so the brand only has to change here.
 *
 * The artwork ships in two cuts, both transparent-backed: the compact lockup
 * (balloon mark + "Pinkfly") and the full lockup, which adds the "Building
 * Dreams" tagline. The tagline is unreadable at navbar height, so the compact
 * cut is the default and the full one is opt-in via `withTagline`.
 *
 * Each cut has an on-light and an on-dark variant — only the neutrals differ,
 * the pink is identical, so the brand colour never shifts between surfaces.
 * Being a raster, the logo can't read the theme tokens, so both variants are
 * rendered and CSS in globals.css shows one: by `data-theme`, or forced to the
 * on-dark variant by `.pf-logo--on-dark` for placements over a dark hero.
 *
 * The mark takes a fixed height per size and derives its width from the
 * artwork's aspect ratio, so placements never need layout changes.
 *
 * A logo uploaded in the Studio (Site settings → Logo) replaces the shipped
 * artwork wherever this renders, which is every placement. Its width comes
 * from the asset's own dimensions, so a new lockup of any proportions drops
 * in without a code change; a second upload covers the dark theme, and when
 * there is only one it serves both.
 */

type LogoProps = {
  className?: string;
  /** The logo from Sanity, when one has been uploaded. */
  logo?: ResolvedImage;
  /** Its dark-theme counterpart. Falls back to `logo`. */
  logoDark?: ResolvedImage;
  /** Visual size. `sm` is the navbar, `md` the footer. */
  size?: "sm" | "md" | "lg";
  /** Where the logo links to — region-aware callers pass a prefixed path. */
  href?: string;
  /** Render light, for use over a dark full-bleed hero. */
  onDark?: boolean;
  /** Use the full lockup, which carries the "Building Dreams" tagline. */
  withTagline?: boolean;
};

/** Intrinsic artwork sizes, used to keep each cut's aspect ratio exact. */
const art = {
  compact: { src: "/brand/pinkfly-lockup", width: 807, height: 220 },
  full: { src: "/brand/pinkfly-logo", width: 976, height: 366 },
} as const;

/** Rendered height in pixels per size step. */
const heights = {
  sm: 28,
  md: 40,
  lg: 52,
} as const;

export function LogoMark({
  className,
  size = "sm",
  onDark = false,
  withTagline = false,
  logo,
  logoDark,
}: Omit<LogoProps, "href">) {
  const height = heights[size];
  const cut = withTagline ? art.full : art.compact;
  const width = Math.round((height * cut.width) / cut.height);
  const alt = withTagline ? "Pinkfly — Building Dreams" : "Pinkfly";

  // An uploaded logo wins, and both themes are drawn the same way as the
  // shipped artwork: one for each, with CSS showing the right one, so the
  // theme can change without a reload or a flash of the wrong lockup.
  if (logo) {
    const light = logo;
    const dark = logoDark ?? logo;
    const uploadedWidth = Math.round(height * (light.ratio ?? cut.width / cut.height));

    return (
      <span
        className={cn("inline-block", onDark && "pf-logo--on-dark", className)}
        style={{ width: uploadedWidth, height }}
      >
        <Image
          src={light.src}
          alt={light.alt || alt}
          width={uploadedWidth}
          height={height}
          priority
          unoptimized
          className="pf-logo__on-light object-contain"
          style={{ width: uploadedWidth, height }}
        />
        <Image
          src={dark.src}
          alt=""
          aria-hidden
          width={uploadedWidth}
          height={height}
          priority
          unoptimized
          className="pf-logo__on-dark object-contain"
          style={{ width: uploadedWidth, height }}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-block",
        onDark && "pf-logo--on-dark",
        className
      )}
      style={{ width, height }}
    >
      <Image
        src={`${cut.src}.png`}
        alt={alt}
        width={width}
        height={height}
        priority
        className="pf-logo__on-light object-contain"
        style={{ width, height }}
      />
      <Image
        src={`${cut.src}-dark.png`}
        alt=""
        aria-hidden
        width={width}
        height={height}
        priority
        className="pf-logo__on-dark object-contain"
        style={{ width, height }}
      />
    </span>
  );
}

export function Logo({
  className,
  size = "sm",
  href = "/",
  onDark = false,
  withTagline = false,
  logo,
  logoDark,
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Pinkfly — home"
      className={cn(
        "inline-flex items-center transition-opacity duration-200 hover:opacity-80",
        className
      )}
    >
      <LogoMark
        size={size}
        onDark={onDark}
        withTagline={withTagline}
        logo={logo}
        logoDark={logoDark}
      />
    </Link>
  );
}
