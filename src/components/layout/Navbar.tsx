"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrolled } from "@/hooks/useScrollDirection";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { RegionSelector } from "@/components/region/RegionSelector";
import { MobileBackRow } from "./MobileBackRow";
import { regionPath, type Region } from "@/lib/region";
import type { SiteContent } from "@/lib/cms/content";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export type NavVariant = "default" | "knowledge";

type NavbarProps = {
  region: Region;
  /** Path inside the region, used to keep the page when switching region. */
  rest: string;
  /**
   * `default` — the standard site header.
   * `knowledge` — the Knowledge Base's own category navigation.
   */
  variant?: NavVariant;
  /**
   * True when the page opens on a dark, full-bleed hero. The bar then floats
   * transparent with light type until the visitor scrolls past the fold.
   */
  overHero?: boolean;
  /** Navigation, header button and brand name — all edited in Sanity. */
  site: SiteContent;
  /** Draw the phone-and-tablet back row under the bar. Off on the homepage. */
  showBack?: boolean;
};

export function Navbar({
  region,
  rest,
  variant = "default",
  overHero = false,
  site,
  showBack = false,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const items =
    variant === "knowledge"
      ? site.knowledgeBaseNav.map((i) => ({ ...i, href: withRegion(i.href) }))
      : site.mainNav.map((i) => ({ ...i, href: withRegion(i.href) }));

  function withRegion(href: string) {
    // In-page anchors on the current page stay as-is.
    if (href.startsWith("#")) return href;
    const [path, hash] = href.split("#");
    return regionPath(region, path) + (hash ? `#${hash}` : "");
  }

  // The bar's one button goes straight to the form.
  //
  // It used to point at `/join`, a page whose own job is to explain the
  // community and then offer the same form. Someone who has already decided
  // — which is who presses a button labelled "Join Pinkfly" — was made to
  // read a pitch first and find the form at the bottom of it. The region's
  // own form wins where one is set, exactly as every other join button on
  // the site resolves it; the /join page is still there for anyone who wants
  // the argument before the form.
  const joinHref =
    region.form.googleFormUrl || site.joinFormUrl || regionPath(region, site.navCta.href);
  const ctaLabel =
    variant === "knowledge" ? site.navCta.knowledgeLabel : site.navCta.label;
  // Light type only while the bar is still floating clear of the page, over
  // the hero image. Once it lands it is a solid surface and takes the page's
  // own type colours.
  const onDark = overHero && !scrolled && !open;
  const solid = !onDark;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-[var(--pf-ease)]",
        // Edge to edge and flush with the top of the page. The bar used to
        // float as a rounded capsule with air all around it, which read as a
        // widget laid over the site rather than the site's own header. It is
        // now part of the page: full width, square, a hairline along the
        // bottom instead of a ring all the way round.
        solid
          ? "border-b border-[var(--pf-border)] bg-[var(--pf-surface)]"
          : "border-b border-transparent"
      )}
    >
      <Container>
        <nav
          aria-label="Primary"
          className={cn(
            "flex items-center justify-between gap-3 transition-[padding] duration-300 ease-[var(--pf-ease)] sm:gap-5",
            // The breathing room lives here, inside the bar, and only here —
            // the sections below keep their own rhythm. It eases in a little
            // on a phone and opens up through tablet to desktop, then tightens
            // once the page is scrolled so the bar takes less of a small
            // screen when it matters most.
            scrolled
              ? "py-3 sm:py-3.5 lg:py-4"
              : "py-4 sm:py-5 lg:py-6"
          )}
        >
          {/* One lockup at every width, tagline included.
              The phone used to get a cut with no tagline, on the assumption
              that the full one needed width a phone bar does not have. It
              does not: "Building Dreams" tucks under the wordmark beside the
              balloon rather than extending past it, so both cuts are within
              a hair of the same proportions (3.81 against 3.85) and the full
              lockup costs the bar about two pixels. Dropping it only meant
              the brand line was missing on the devices most people use. */}
          <Logo
            href={regionPath(region, "/")}
            onDark={onDark}
            size="md"
            withTagline
            logo={site.logo}
            logoDark={site.logoDark}
            logoHeight={site.logoHeight}
          />

          {items.length > 0 && (
            <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
              {items.map((item) => {
                const active =
                  pathname === item.href.split("#")[0] &&
                  variant !== "knowledge";
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative text-sm transition-colors duration-200 hover:text-[var(--pf-accent)]",
                        "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-[var(--pf-accent)] after:transition-all after:duration-300 hover:after:w-full",
                        onDark
                          ? "text-white/90 hover:text-white after:bg-white"
                          : active
                            ? "text-[var(--pf-accent)] after:w-full"
                            : "text-[var(--pf-text)]"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="hidden items-center gap-2.5 lg:flex">
            <RegionSelector current={region} rest={rest} onDark={onDark} />
            <ThemeToggle onDark={onDark} />
            <Button href={joinHref} size="sm">
              {ctaLabel}
            </Button>
          </div>

          {/* Mobile controls. Light and dark is a setting people change on
              the device they read on, so it stays on the bar rather than
              behind the hamburger. The region selector does not: it is the
              wider control of the two and at 320px all three together
              overflowed the bar, so it lives in the menu panel. */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle onDark={onDark} />
            <button
              type="button"
              className={cn(
                "-mr-1 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                onDark ? "text-white" : "text-[var(--pf-heading)]"
              )}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </Container>

      {showBack && !open && (
        <MobileBackRow home={regionPath(region, "/")} onDark={onDark} />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden"
          >
            {/* Flush with the bar above it, same width as the page, so the
                open menu reads as the header growing rather than a card
                dropped on top of it. */}
            <div className="border-b border-[var(--pf-border)] bg-[var(--pf-surface)] shadow-[var(--pf-shadow-md)]">
              <Container className="flex max-h-[75vh] flex-col gap-1 overflow-y-auto py-3 sm:py-4">
                {items.map(
                  (item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex min-h-12 items-center rounded-xl px-4 py-3 text-[var(--pf-heading)] transition-colors hover:bg-[var(--pf-surface-muted)]"
                    >
                      {item.label}
                    </Link>
                  )
                )}

                <div className="my-2 h-px bg-[var(--pf-border)]" />
                <RegionSelector current={region} rest={rest} variant="inline" />

                <Button href={joinHref} className="mt-3 w-full">
                  {ctaLabel}
                </Button>
              </Container>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
