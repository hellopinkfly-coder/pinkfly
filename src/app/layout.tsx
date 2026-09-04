import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getSiteContent } from "@/lib/cms/content";
import "./globals.css";

/**
 * Space Mono is the single typeface for the whole site.
 *
 * Self-hosted rather than fetched via `next/font/google` so the build never
 * depends on reaching fonts.gstatic.com — that fetch fails behind TLS-inspecting
 * proxies and silently degrades every page to a fallback face.
 * Files: public/fonts (latin subset, woff2). Licensed under the OFL — see
 * public/fonts/OFL.txt.
 */
const spaceMono = localFont({
  src: [
    {
      path: "../../public/fonts/SpaceMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SpaceMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

// Runs before first paint to set the theme (no flash of wrong theme).
// Priority: stored preference → system preference → light.
const themeInitScript = `
(function(){try{
  var t = localStorage.getItem('pf-theme');
  if(t !== 'light' && t !== 'dark'){
    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', t);
}catch(e){}})();
`;

/**
 * Root metadata. Per-page titles, descriptions, canonicals and hreflang are
 * supplied by `buildMetadata` in each route — this only sets the defaults.
 */
/**
 * Render on request rather than at build.
 *
 * Every page's content comes from Sanity, and a prerendered page keeps
 * whatever the CMS held when the deploy ran — so a change published in the
 * Studio never appeared until the next deploy. Rendering on request means a
 * publish is on the page at the next refresh.
 *
 * The Studio route sets its own `force-static` and is unaffected, and this is
 * the same one switch as `CMS_REVALIDATE_SECONDS`: once the publish webhook is
 * configured, remove this and put that back to 60 to return to a cached,
 * webhook-purged site.
 */
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s`,
  },
  description: siteConfig.description,
  keywords: [
    "women entrepreneurs",
    "women founders",
    "founder community",
    "mentorship",
    "women in business",
    "Pinkfly",
    "Noboru World",
  ],
  authors: [{ name: siteConfig.parent }],
  creator: siteConfig.parent,
  robots: { index: true, follow: true },
  // Icons and the default share image come from the brand artwork in
  // public/brand. src/app/{icon,apple-icon,opengraph-image}.png cover the
  // file-convention tags; these entries add the sizes browsers ask for by name.
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/brand/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF9F7" },
    { media: "(prefers-color-scheme: dark)", color: "#14110F" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Navigation, footer links, contact details and the header button are all
  // edited in Sanity; fetching them here keeps the chrome in one place.
  const site = await getSiteContent();

  return (
    <html lang="en" className={spaceMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--pf-accent)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteChrome site={site}>{children}</SiteChrome>
      </body>
    </html>
  );
}
