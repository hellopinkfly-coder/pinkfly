/**
 * Stock image placeholders.
 *
 * Every entry is a contextual, temporary reference image served from
 * Unsplash. They are grouped by where they are used so a real photoshoot can
 * be dropped in one place. Replace the `src` values (and only those) when
 * final photography arrives — the layouts read `alt` and `label` from here
 * too, so the captions stay correct.
 */

export type StockImage = {
  src: string;
  alt: string;
  /** Optional caption rendered in the bottom-right corner of the frame. */
  label?: string;
};

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Homepage hero carousel — rotates every 1.5s. */
export const heroCarousel: StockImage[] = [
  {
    src: u("1573497019940-1c28c88b4f3e"),
    alt: "A woman entrepreneur presenting to her team",
    label: "Founders",
  },
  {
    src: u("1521737604893-d14cc237f11d"),
    alt: "Women collaborating around a table at a community meetup",
    label: "Meetups",
  },
  {
    src: u("1544717305-2782549b5136"),
    alt: "A founder working on her business plan",
    label: "Building",
  },
  {
    src: u("1556761175-b413da4baf72"),
    alt: "A group of women in conversation at a networking event",
    label: "Networking",
  },
];

/** Homepage "How we gather" cards. */
export const communityImages: Record<string, StockImage> = {
  meetups: {
    src: u("1511578314322-379afb476865", 1000),
    alt: "Women gathered at a community launch event",
    label: "Meetups & launches",
  },
  onlineMeets: {
    src: u("1584036561566-baf8f5f1b144", 1000),
    alt: "A woman on a video call with her founder circle",
    label: "Online meets",
  },
  webinars: {
    src: u("1591115765373-5207764f72e7", 1000),
    alt: "A speaker addressing an audience at a webinar recording",
    label: "Webinars",
  },
  coffeeChats: {
    src: u("1521737711867-e3b97375f902", 1000),
    alt: "Two founders in conversation over coffee",
    label: "Coffee chats",
  },
  networking: {
    src: u("1556761175-4b46a572b786", 1000),
    alt: "Women networking at a professional event",
    label: "Networking",
  },
  mentorship: {
    src: u("1573496359142-b8d87734a5a2", 1000),
    alt: "A mentor advising a younger founder",
    label: "Mentorship",
  },
};

/** About page. */
export const aboutImages = {
  banner: {
    src: u("1600880292203-757bb62b4baf", 1800),
    alt: "Women entrepreneurs collaborating in a bright workspace",
    label: "The Pink Fly community",
  } satisfies StockImage,
  founder: {
    src: u("1507003211169-0a1dd7228f2d", 1000),
    alt: "Portrait placeholder for the Pink Fly founder",
    label: "Founder",
  } satisfies StockImage,
  guidelines: {
    src: u("1522071820081-009f0129c71c", 1200),
    alt: "A team working together in a supportive environment",
    label: "How we show up",
  } satisfies StockImage,
};

/** Join Community page. */
export const joinImages = {
  banner: {
    src: u("1517048676732-d65bc937f952", 1800),
    alt: "Women entrepreneurs meeting around a table",
    label: "Join the community",
  } satisfies StockImage,
};

/** Events. */
export const eventImages = {
  banner: {
    src: u("1540575467063-178a50c2df87", 1800),
    alt: "An audience at a professional community event",
    label: "Pink Fly events",
  } satisfies StockImage,
  fallback: {
    src: u("1475721027785-f74eccf877e2", 1000),
    alt: "A Pink Fly community event",
  } satisfies StockImage,
};

/** Knowledge Base editorial imagery. */
export const knowledgeImages = {
  banner: {
    src: u("1499750310107-5fef28a66643", 1800),
    alt: "An editorial desk with notes and a laptop",
    label: "Knowledge Base",
  } satisfies StockImage,
};

/** Generic square placeholder for team members with no photo yet. */
export const teamPlaceholder = u("1573496359142-b8d87734a5a2", 800);
