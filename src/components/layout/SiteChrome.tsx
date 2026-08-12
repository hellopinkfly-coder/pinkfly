"use client";

import { usePathname } from "next/navigation";
import { parsePathname } from "@/lib/region";
import { Navbar, type NavVariant } from "./Navbar";
import { Footer } from "./Footer";

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

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const { region, rest } = parsePathname(pathname);

  return (
    <>
      <Navbar region={region} rest={rest} variant={navVariantFor(rest)} />
      <main id="main">{children}</main>
      <Footer region={region} />
    </>
  );
}
