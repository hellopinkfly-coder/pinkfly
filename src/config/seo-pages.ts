/**
 * Per-page SEO copy, shared by the global and regional variants of a route.
 * The region suffix and the hreflang set are added by `buildMetadata`.
 */
export const pageSeo = {
  about: {
    title: "About Oinkfly — our story, team and community guidelines",
    description:
      "Why Oinkfly exists, the founder story behind it, how the community works, and the team building it.",
  },
  join: {
    title: "Join the Oinkfly community",
    description:
      "Membership is free. Networking, mentorship, events, masterclasses and a founder community built to help you grow.",
  },
  events: {
    title: "Events — meetups, webinars, masterclasses and coffee chats",
    description:
      "Browse upcoming Oinkfly events by location, month and event type, and register for the ones near you.",
  },
  knowledgeBase: {
    title: "Knowledge Base — articles, business news and government policies",
    description:
      "Founder playbooks, the business news that matters, and the policy changes that affect how you build.",
  },
} as const;
