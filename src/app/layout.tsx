import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
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
    "Pink Fly",
    "Noboru World",
  ],
  authors: [{ name: siteConfig.parent }],
  creator: siteConfig.parent,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF9F7" },
    { media: "(prefers-color-scheme: dark)", color: "#14110F" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
