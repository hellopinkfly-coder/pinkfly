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
  /** Placeholder contact block — confirm before launch. */
  address: ["Noboru World", "Bengaluru, Karnataka", "India"],
  phone: "+91 00000 00000",
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

/**
 * Footer link groups. Rendered as a multi-column footer:
 * brand → Join → About & Resources → Policies.
 */
export const footerNav = {
  join: {
    title: "Join",
    links: [
      { label: "Community", href: "/community" },
      { label: "FAQs", href: "/knowledge-base#faqs" },
      { label: "Knowledge Base", href: "/knowledge-base" },
      { label: "Events", href: "/events" },
    ],
  },
  about: {
    title: "About",
    links: [
      { label: "About Pink Fly", href: "/about" },
      { label: "Our Mission", href: "/about#mission" },
      { label: "Contact", href: "/contact" },
      { label: "Noboru World", href: "https://noboruworld.com" },
    ],
  },
  policies: {
    title: "Policies",
    links: [
      { label: "Terms & Conditions", href: "/policies/terms" },
      { label: "Refund Policy", href: "/policies/refund" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Community Guidelines", href: "/policies/community-guidelines" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
