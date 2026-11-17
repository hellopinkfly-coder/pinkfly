"use client";

import { usePathname } from "next/navigation";
import { parsePathname } from "@/lib/region";
import { joinUrl } from "@/lib/join-url";
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

  // Every page but the homepage, which is where back would lead anyway.
  const showBack = rest !== "/" && rest !== "";

  // A page that opens on a full-bleed photograph runs it under the header on
  // purpose: the bar floats over the image with light type, and so does the
  // back row. Pushing such a page down by the height of that row left the
  // header's own lower half — the wordmark's descender and the tagline —
  // sitting on the photograph with a band of page colour above it, which is
  // what the Events page was showing: a logo cut in half by its own hero.
  const overHero = opensOnDarkHero(rest);

  return (
    <>
      <Navbar
        region={region}
        rest={rest}
        variant={navVariantFor(rest)}
        overHero={overHero}
        site={site}
        showBack={showBack}
      />
      {/* The back row adds a line to the fixed header on a phone and tablet,
          so a page of ordinary sections starts that much lower. Held here
          rather than in each page's own top padding, which is how the pages
          drifted apart in the first place. A hero page is the exception
          above: it reserves its own room and the row floats over it. */}
      <main id="main" className={showBack && !overHero ? "pt-14 lg:pt-0" : undefined}>
        {children}
      </main>
      <Footer region={region} site={site} />
      {/* Mounted here rather than in the layout so it inherits the Studio
          exemption above: the Studio returns before this point. */}
      <WelcomeDialog content={site.newsletterPopup} joinHref={joinUrl(site, region)} />
    </>
  );
}
