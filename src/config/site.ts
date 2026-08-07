/**
 * Central place for site-wide configuration (metadata, nav, links).
 */
export const siteConfig = {
  name: "Pink Fly",
  tagline: "Where ambitious women build what's next",
  description:
    "Pink Fly is India's most trusted community for ambitious women entrepreneurs — mentorship, networking, education, and a founder community to help you launch, scale, and conquer. A flagship initiative by Noboru World.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  parent: "Noboru World",
  contactEmail: "hello@pinkfly.community",
  socials: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
  },
} as const;

/** Primary navigation — each item is a route or in-page anchor. */
export const mainNav = [
  { label: "About", href: "/about" },
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "Knowledge Base", href: "/knowledge-base" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  explore: [
    { label: "About", href: "/about" },
    { label: "Community", href: "/community" },
    { label: "Events", href: "/events" },
    { label: "Knowledge Base", href: "/knowledge-base" },
  ],
  connect: [
    { label: "Contact", href: "/contact" },
    { label: "Join Community", href: "/#join" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
