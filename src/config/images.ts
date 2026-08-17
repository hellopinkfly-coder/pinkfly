/**
 * Stock image placeholders — women only.
 *
 * Every image on this site depicts women: founders, mentors, speakers and
 * community members. That is a hard rule for Oinkfly, so it is enforced here,
 * in the one place images are declared, rather than left to each component.
 *
 * ⚠️ VERIFY BEFORE LAUNCH — these are Unsplash IDs chosen for subject and
 * composition. Open the page once and eyeball every frame: a stock photo that
 * does not match the brief is far more damaging on this site than on most.
 * Replace `src` values here and every usage updates.
 */

export type StockImage = {
  src: string;
  alt: string;
  /** Optional caption rendered in the corner of the frame. */
  label?: string;
};

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

/**
 * Full-screen homepage hero carousel.
 *
 * Each slide carries one short line so the carousel tells a story as it
 * advances rather than repeating a single headline over four photographs.
 * `focal` sets object-position so faces stay in frame as the crop changes
 * across breakpoints.
 */
export type HeroSlide = StockImage & {
  /**
   * Short headline shown over this slide. Keep it to a handful of words —
   * the fold is deliberately sparse, and long lines undo that.
   */
  headline: string;
  /** CSS object-position keeping the subject in frame. */
  focal: string;
};

export const heroSlides: HeroSlide[] = [
  {
    src: u("1573497019940-1c28c88b4f3e", 2400),
    alt: "A woman entrepreneur presenting to her team in a bright office",
    label: "Founders",
    headline: "You were never meant to build alone.",
    focal: "50% 35%",
  },
  {
    src: u("1600880292203-757bb62b4baf", 2400),
    alt: "Two women in conversation across a desk",
    label: "Mentorship",
    headline: "Mentors who have already done it.",
    focal: "50% 40%",
  },
  {
    src: u("1594744803329-e58b31de8bf5", 2400),
    alt: "Women gathered in conversation at a community event",
    label: "Community",
    headline: "Rooms full of women who get it.",
    focal: "50% 40%",
  },
  {
    src: u("1551836022-d5d88e9218df", 2400),
    alt: "A woman speaking to an audience at a Oinkfly event",
    label: "Masterclasses",
    headline: "Skills you can use on Monday.",
    focal: "50% 35%",
  },
];

/** Milliseconds each hero slide holds before advancing. */
export const HERO_INTERVAL = 2000;

/** Homepage "How we gather" cards. */
export const communityImages: Record<string, StockImage> = {
  meetups: {
    src: u("1543269865-cbf427effbad", 1200),
    alt: "Women gathered around a table at a Oinkfly meetup",
    label: "Meetups & launches",
  },
  onlineMeets: {
    src: u("1573164713988-8665fc963095", 1200),
    alt: "A woman on a video call with her founder circle",
    label: "Online meets",
  },
  webinars: {
    src: u("1573497620053-ea5300f94f21", 1200),
    alt: "A woman presenting a session to an online audience",
    label: "Webinars",
  },
  coffeeChats: {
    src: u("1552581234-26160f608093", 1200),
    alt: "Two women founders in conversation over coffee",
    label: "Coffee chats",
  },
  networking: {
    src: u("1580894732444-8ecded7900cd", 1200),
    alt: "Women networking at a professional event",
    label: "Networking",
  },
  mentorship: {
    src: u("1573496359142-b8d87734a5a2", 1200),
    alt: "A mentor advising a younger woman founder",
    label: "Mentorship",
  },
};

/** About page. */
export const aboutImages = {
  banner: {
    src: u("1521737604893-d14cc237f11d", 2000),
    alt: "Women entrepreneurs collaborating in a bright workspace",
    label: "The Oinkfly community",
  } satisfies StockImage,
  founder: {
    src: u("1573497491208-6b1acb260507", 1200),
    alt: "Portrait placeholder for the Oinkfly founder",
    label: "Founder",
  } satisfies StockImage,
  guidelines: {
    src: u("1517048676732-d65bc937f952", 1400),
    alt: "Women working together in a supportive environment",
    label: "How we show up",
  } satisfies StockImage,
};

/** Join Community page. */
export const joinImages = {
  banner: {
    src: u("1594744803329-e58b31de8bf5", 2000),
    alt: "Women entrepreneurs meeting around a table",
    label: "Join the community",
  } satisfies StockImage,
};

/** Events. */
export const eventImages = {
  banner: {
    src: u("1551836022-d5d88e9218df", 2400),
    alt: "A woman addressing an audience at a Oinkfly event",
    label: "Oinkfly events",
  } satisfies StockImage,
  fallback: {
    src: u("1543269865-cbf427effbad", 1200),
    alt: "Women at a Oinkfly community event",
  } satisfies StockImage,
};

/** Knowledge Base editorial imagery. */
export const knowledgeImages = {
  banner: {
    src: u("1544717297-fa95b6ee9643", 2000),
    alt: "A woman reading and taking notes at her desk",
    label: "Knowledge Base",
  } satisfies StockImage,
};

/** Neutral portrait for team members and speakers with no photo yet. */
export const teamPlaceholder = u("1573496359142-b8d87734a5a2", 900);
