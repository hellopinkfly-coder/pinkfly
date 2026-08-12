import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "women entrepreneurs",
    "women founders India",
    "founder community",
    "mentorship",
    "women in business",
    "Pink Fly",
    "Noboru World",
  ],
  authors: [{ name: "Noboru World" }],
  creator: "Noboru World",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
