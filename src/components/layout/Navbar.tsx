"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { mainNav, knowledgeBaseNav } from "@/config/site";
import { useScrolled } from "@/hooks/useScrollDirection";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { RegionSelector } from "@/components/region/RegionSelector";
import { regionPath, type Region } from "@/lib/region";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export type NavVariant = "default" | "knowledge" | "minimal";

type NavbarProps = {
  region: Region;
  /** Path inside the region, used to keep the page when switching region. */
  rest: string;
  /**
   * `default` — the standard site header.
   * `knowledge` — the Knowledge Base's own category navigation.
   * `minimal` — logo, region and CTA only, laid over a full-bleed hero
   *   (the Events page has no standard header per the wireframe).
   */
  variant?: NavVariant;
};

export function Navbar({ region, rest, variant = "default" }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const items =
    variant === "knowledge"
      ? knowledgeBaseNav.map((i) => ({ ...i, href: withRegion(i.href) }))
      : variant === "minimal"
        ? []
        : mainNav.map((i) => ({ ...i, href: withRegion(i.href) }));

  function withRegion(href: string) {
    // In-page anchors on the current page stay as-is.
    if (href.startsWith("#")) return href;
    const [path, hash] = href.split("#");
    return regionPath(region, path) + (hash ? `#${hash}` : "");
  }

  const joinHref = regionPath(region, "/join");
  const ctaLabel = variant === "knowledge" ? "Join Our Community" : "Join Community";
  const overlay = variant === "minimal";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[var(--pf-ease)]",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <Container>
        <nav
          aria-label="Primary"
          className={cn(
            "flex items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 ease-[var(--pf-ease)] sm:px-6",
            scrolled || open
              ? "pf-glass shadow-[var(--pf-shadow-sm)]"
              : overlay
                ? "pf-glass border-white/20 shadow-[var(--pf-shadow-sm)]"
                : "border border-transparent"
          )}
        >
          <Logo href={regionPath(region, "/")} />

          {items.length > 0 && (
            <ul className="hidden items-center gap-7 lg:flex">
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
                        active
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
            <RegionSelector current={region} rest={rest} />
            <ThemeToggle />
            <Button href={joinHref} size="sm">
              {ctaLabel}
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <RegionSelector current={region} rest={rest} />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--pf-heading)]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden"
          >
            <Container className="mt-2">
              <div className="pf-glass flex max-h-[75vh] flex-col gap-1 overflow-y-auto rounded-[var(--pf-radius-xl)] p-4 shadow-[var(--pf-shadow-md)]">
                {/* The minimal variant still needs a way into the site. */}
                {(items.length > 0 ? items : mainNav.map((i) => ({ ...i, href: withRegion(i.href) }))).map(
                  (item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-4 py-3 text-[var(--pf-heading)] transition-colors hover:bg-[var(--pf-surface-muted)]"
                    >
                      {item.label}
                    </Link>
                  )
                )}

                <div className="my-2 h-px bg-[var(--pf-border)]" />
                <RegionSelector current={region} rest={rest} variant="inline" />

                <div className="mt-3 flex items-center gap-3">
                  <ThemeToggle />
                  <Button href={joinHref} className="flex-1">
                    {ctaLabel}
                  </Button>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
