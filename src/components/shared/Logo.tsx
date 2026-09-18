import Image from "next/image";
import Link from "next/link";
import lockupLight from "../../../public/brand/pinkfly-lockup.png";
import lockupDark from "../../../public/brand/pinkfly-lockup-dark.png";
import logoLight from "../../../public/brand/pinkfly-logo.png";
import logoDarkArt from "../../../public/brand/pinkfly-logo-dark.png";
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
  /**
   * The height an uploaded logo is drawn at, in pixels.
   *
   * The size steps below are sized to the shipped artwork, which is cropped
   * tight. An upload carrying its own margin draws the lockup smaller than
   * the frame, and no code can know how much margin that is — so it is a
   * number an editor can turn until it looks right.
   */
  logoHeight?: number;
  /** Visual size. `sm` is the navbar, `md` the footer. */
  size?: "sm" | "md" | "lg";
  /** Where the logo links to — region-aware callers pass a prefixed path. */
  href?: string;
  /** Render light, for use over a dark full-bleed hero. */
  onDark?: boolean;
  /** Use the full lockup, which carries the "Building Dreams" tagline. */
  withTagline?: boolean;
  /**
   * Preload the artwork.
   *
   * Off by default, which is what a phone wants. Every placement renders
   * four files — two cuts, each with an on-light and an on-dark variant —
   * and CSS hides three of them; preloading fetched all four on every page,
   * about 28KB of pictures nobody sees, ahead of the one image that is
   * actually on screen. Left to load normally, the browser skips what is
   * `display: none` and the footer's copy waits until it is scrolled to.
   */
  priority?: boolean;
};

/**
 * The two cuts, imported rather than referenced by path.
 *
 * An import gives the file a content-hashed URL, so redrawing the artwork
 * changes the address and every browser and cache fetches it. Referenced by a
 * fixed path, a redrawn logo kept the old address and kept being served from
 * cache — the file in the repository had changed and no one could see it.
 *
 * The dimensions come with the import too, so the aspect ratio is whatever
 * the file actually is; the numbers written here by hand had already drifted
 * from the artwork.
 */
const art = {
  compact: { light: lockupLight, dark: lockupDark },
  full: { light: logoLight, dark: logoDarkArt },
} as const;

/**
 * Rendered height in pixels per size step.
 *
 * `md` is the header and the footer. It was 40, which is generous for a
 * wordmark cropped tight and mean for an uploaded lockup carrying its own
 * margin — the frame is the file's height, so the artwork inside it lands
 * smaller. The extra room costs the header a few pixels and gives every logo,
 * shipped or uploaded, more presence.
 *
 * The tagline sets the floor: it has to be legible, and it is a fraction of
 * the lockup's height. The supplied artwork draws it larger than the drawn-in
 * one did, so 46 reads where the old lockup needed 62 — and 62 with this
 * wider artwork made the logo 241px, which pushed the navigation onto two
 * lines. The phone bar keeps its own step and carries no tagline.
 */
const heights = {
  sm: 34,
  md: 46,
  lg: 58,
} as const;

export function LogoMark({
  className,
  size = "sm",
  onDark = false,
  withTagline = false,
  logo,
  logoDark,
  logoHeight,
  priority = false,
}: Omit<LogoProps, "href">) {
  const height = heights[size];
  const cut = withTagline ? art.full : art.compact;
  const width = Math.round((height * cut.light.width) / cut.light.height);
  const alt = withTagline ? "Pinkfly — Building Dreams" : "Pinkfly";

  // An uploaded logo wins, and both themes are drawn the same way as the
  // shipped artwork: one for each, with CSS showing the right one, so the
  // theme can change without a reload or a flash of the wrong lockup.
  if (logo) {
    const light = logo;
    const dark = logoDark ?? logo;
    // The editor's height applies to the full lockup; the compact cut keeps
    // its proportion of it, so raising one raises both together.
    const uploadedHeight = logoHeight
      ? Math.round(logoHeight * (height / heights.md))
      : height;
    const uploadedWidth = Math.round(
      uploadedHeight * (light.ratio ?? cut.light.width / cut.light.height)
    );

    return (
      <span
        className={cn("inline-block", onDark && "pf-logo--on-dark", className)}
        style={{ width: uploadedWidth, height: uploadedHeight }}
      >
        <Image
          src={light.src}
          alt={light.alt || alt}
          width={uploadedWidth}
          height={uploadedHeight}
          priority={priority}
          unoptimized
          className="pf-logo__on-light object-contain"
          style={{ width: uploadedWidth, height: uploadedHeight }}
        />
        <Image
          src={dark.src}
          alt=""
          aria-hidden
          width={uploadedWidth}
          height={uploadedHeight}
          priority={priority}
          unoptimized
          className="pf-logo__on-dark object-contain"
          style={{ width: uploadedWidth, height: uploadedHeight }}
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
        src={cut.light}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="pf-logo__on-light object-contain"
        style={{ width, height }}
      />
      <Image
        src={cut.dark}
        alt=""
        aria-hidden
        width={width}
        height={height}
        priority={priority}
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
  logoHeight,
  priority = false,
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
        logoHeight={logoHeight}
        priority={priority}
      />
    </Link>
  );
}
