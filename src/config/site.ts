/**
 * Site-wide configuration: identity, social links, navigation, integrations.
 *
 * Anything region-specific lives in `src/config/regions.ts` instead — this
 * file holds only what is true for Pink Fly globally.
 */

export const siteConfig = {
  name: "Pink Fly",
  tagline: "Where ambitious women build what's next",
  description:
    "Pink Fly is a community for ambitious women founders — mentorship, network, events and education to help you launch, scale and conquer.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  parent: "Noboru World",
  parentUrl: "https://noboruworld.com",
  contactEmail: "hello@pinkfly.community",
  address: [
    "919, Gera's Imperium Rise",
    "Hinjawadi Phase II, Rajiv Gandhi Infotech Park",
    "Hinjawadi, Pune, Maharashtra 411057",
  ],
  phone: "+91 00000 00000",
  socials: {
    instagram: "https://www.instagram.com/pinkfly_official/",
    youtube: "https://www.youtube.com/@PinkFly-official",
    linkedin: "https://www.linkedin.com/in/pink-fly-aaa198429/",
    twitter: "https://x.com/Pinkflyofficial",
  },
} as const;

/**
 * External integrations. These are intentionally environment-driven so the
 * real destinations can be supplied without a code change. Nothing here is
 * invented — where a URL has not been provided the value stays empty and the
 * UI falls back to the on-site Join Community page.
 */
export const integrations = {
  /** Google Form that backs every join CTA. */
  joinFormUrl: process.env.NEXT_PUBLIC_JOIN_FORM_URL ?? "",
} as const;

/** Primary navigation, per the homepage wireframe. */
export const mainNav = [
  { label: "Events", href: "/events" },
  { label: "Knowledge Base", href: "/knowledge-base" },
  { label: "About Us", href: "/about" },
] as const;

/** Knowledge Base has its own navigation (see the Knowledge Base wireframe). */
export const knowledgeBaseNav = [
  { label: "Recent Articles", href: "/knowledge-base#recent-articles" },
  { label: "Business News", href: "/knowledge-base#business-news" },
  { label: "Government Policies", href: "/knowledge-base#government-policies" },
] as const;

/** Footer link columns, per the wireframe's three-column layout. */
export const footerNav = {
  community: {
    title: "Community",
    links: [
      { label: "Join Pink Fly", href: "/join" },
      { label: "FAQs", href: "/join#faqs" },
      { label: "Knowledge Base", href: "/knowledge-base" },
      { label: "Events", href: "/events" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/about#contact" },
      {
        label: "Community Guidelines",
        href: "/policies/community-guidelines",
      },
      { label: "Privacy Policy", href: "/policies/privacy" },
    ],
  },
} as const;

/** Legal pages, linked from the footer's bottom bar. */
export const policyNav = [
  { label: "Terms & Conditions", href: "/policies/terms" },
  { label: "Refund Policy", href: "/policies/refund" },
] as const;

export type SiteConfig = typeof siteConfig;
