"use client";

import { usePathname } from "next/navigation";
import { parsePathname } from "@/lib/region";
import { Navbar, type NavVariant } from "./Navbar";
import { Footer } from "./Footer";
import type { SiteContent } from "@/lib/cms/content";

/**
 * Resolves the active region from the URL and renders the shared chrome
 * around every page. Keeping this in one client component means the root
 * layout stays a server component and no page has to pass the region down to
 * the header or footer itself.
 */

/** Which header a route gets — driven by the wireframes. */
function navVariantFor(rest: string): NavVariant {
  // The Events listing opens straight into its hero image (no standard header).
  if (rest === "/events") return "minimal";
  // The Knowledge Base has its own category navigation.
  if (rest.startsWith("/knowledge-base")) return "knowledge";
  return "default";
}

/**
 * Routes that open on a dark, full-bleed image sitting directly beneath the
 * header. The bar floats over them with light type until the visitor scrolls.
 *
 * The homepage qualifies: its carousel runs edge to edge under the header.
 */
function opensOnDarkHero(rest: string): boolean {
  return rest === "/" || rest === "" || rest === "/events";
}

export function SiteChrome({
  children,
  site,
}: {
  children: React.ReactNode;
  /** Fetched once by the root layout, so the chrome stays a client component. */
  site: SiteContent;
}) {
  const pathname = usePathname() || "/";

  // The Studio is an application, not a page of the site: it draws its own
  // full-height chrome and its own navigation. Wrapped in the site header and
  // footer it sat under a floating navbar that covered its toolbar, so the
  // route renders bare.
  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    return <>{children}</>;
  }

  const { region, rest } = parsePathname(pathname);

  return (
    <>
      <Navbar
        region={region}
        rest={rest}
        variant={navVariantFor(rest)}
        overHero={opensOnDarkHero(rest)}
        site={site}
      />
      <main id="main">{children}</main>
      <Footer region={region} site={site} />
    </>
  );
}
