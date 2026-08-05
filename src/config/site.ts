/**
 * Central place for site-wide configuration (metadata, nav, links).
 */
export const siteConfig = {
  name: "Pinkfly",
  description: "A Next.js application",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;
