"use client";

import { usePathname } from "next/navigation";
import { parsePathname } from "@/lib/region";
import { Navbar, type NavVariant } from "./Navbar";
import { Footer } from "./Footer";
import { WelcomeDialog } from "@/features/newsletter/WelcomeDialog";
import type { SiteContent } from "@/lib/cms/content";

/**
 * Resolves the active region from the URL and renders the shared chrome
 * around every page. Keeping this in one client component means the root
 * layout stays a server component and no page has to pass the region down to
 * the header or footer itself.
 */

/** Which header a route gets — driven by the wireframes. */
function navVariantFor(rest: string): NavVariant {
  // The Knowledge Base has its own category navigation.
  if (rest.startsWith("/knowledge-base")) return "knowledge";
  // Everything else carries the site's own navigation, the Events listing
  // included. The wireframe gave it a stripped bar — logo, region and the
  // button — and in practice that read as a page missing its header: on the
  // Events page alone the links to the rest of the site were gone, and on a
  // desktop there was no way out of it but the logo.
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
      {/* Mounted here rather than in the layout so it inherits the Studio
          exemption above: the Studio returns before this point. */}
      <WelcomeDialog />
    </>
  );
}
