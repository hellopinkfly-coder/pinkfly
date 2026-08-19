/**
 * Content-as-data.
 *
 * All marketing copy lives here so messaging can change without touching a
 * single component — and so this module can be swapped for a CMS/CRM feed
 * later with no change to the presentation layer. Region-specific copy lives
 * in `src/config/regions.ts`; anything here is shared by every region.
 */
import {
  communityImages,
  aboutImages,
  heroSlides as heroPhotos,
  type StockImage,
} from "@/config/images";
import type { FrameShape } from "@/components/shared/ImageFrame";
import {
  Users,
  HeartHandshake,
  TrendingUp,
  Calendar,
  GraduationCap,
  Network,
  Rocket,
  Target,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ Hero -- */

/**
 * One slide of the hero carousel.
 *
 * `src` may be a remote URL (see `src/config/images.ts` and the matching
 * `remotePatterns` entry in next.config.ts) or a path under /public. Leave it
 * out and the slide renders the branded portrait treatment instead of a
 * broken image. See public/images/founders/README.md for the shoot spec.
 */
export type HeroSlide = {
  eyebrow: string;
  headline: string;
  subhead: string;
  /** Two short proof points. More than two and the panel stops scanning. */
  points: { icon: LucideIcon; label: string }[];
  cta: { label: string; href: string };
  image: {
    src?: string;
    /** Describe the person and what they are doing — this is read aloud. */
    alt: string;
    /** object-position, keeping the subject in frame as the crop changes. */
    focal?: string;
  };
};

/**
 * The hero banner carousel.
 *
 * Each slide is a self-contained panel — its own headline, two proof points,
 * CTA and photograph — so copy and image travel together and a slide always
 * reads as one composition. Every slide's CTA leads to Join Community.
 *
 * TODO(pre-launch): every `image.src` is a generic stock placeholder, NOT the
 * Indian-women photography the brand calls for. Replace the images and their
 * alt text together — see public/images/README.md.
 */
export const hero = {
  slides: [
    {
      eyebrow: "The Pink Fly community",
      headline: "Find your people.",
      subhead: "India's community for ambitious women founders.",
      points: [
        { icon: HeartHandshake, label: "Mentors who have already built it" },
        { icon: Network, label: "Introductions that open doors" },
      ],
      cta: { label: "Join Community", href: "/join" },
      image: {
        src: heroPhotos[0]?.src,
        alt: "A woman founder presenting to her team.",
        focal: heroPhotos[0]?.focal,
      },
    },
    {
      eyebrow: "Mentorship",
      headline: "Guidance that fits your stage.",
      subhead: "Matched to where you are, not to a curriculum.",
      points: [
        { icon: Target, label: "What to build next, what to ignore" },
        { icon: Users, label: "Small circles that keep you moving" },
      ],
      cta: { label: "Join Community", href: "/join" },
      image: {
        src: heroPhotos[1]?.src,
        alt: "Two women in conversation across a desk.",
        focal: heroPhotos[1]?.focal,
      },
    },
    {
      eyebrow: "Events",
      headline: "Rooms worth showing up for.",
      subhead: "Roundtables, meetups and one very good annual summit.",
      points: [
        { icon: Calendar, label: "Curated gatherings across India" },
        { icon: Rocket, label: "Launches, live and in person" },
      ],
      cta: { label: "Join Community", href: "/join" },
      image: {
        src: heroPhotos[2]?.src,
        alt: "Women gathered in conversation at a community event.",
        focal: heroPhotos[2]?.focal,
      },
    },
    {
      eyebrow: "Knowledge Base",
      headline: "Playbooks, not platitudes.",
      subhead: "Written for founders in a hurry.",
      points: [
        { icon: GraduationCap, label: "Masterclasses from women who shipped" },
        { icon: TrendingUp, label: "The policy changes that affect you" },
      ],
      cta: { label: "Join Community", href: "/join" },
      image: {
        src: heroPhotos[3]?.src,
        alt: "A woman speaking to an audience at a Pink Fly event.",
        focal: heroPhotos[3]?.focal,
      },
    },
  ] as HeroSlide[],
};


/* --------------------------------------------------------------- Trust -- */
/**
 * Credibility strip. Built and reusable, but NOT part of the homepage flow —
 * the approved wireframe does not include it. Kept so it can be dropped onto
 * a page later; see <Trust>.
 */
export const trust = {
  statement:
    "Trusted by founders, mentors and partner organisations across the Pink Fly network.",
  /** Placeholder names — replace with real logo assets before use. */
  logos: [
    "Partner name TBC",
    "Partner name TBC",
    "Partner name TBC",
    "Partner name TBC",
    "Partner name TBC",
    "Partner name TBC",
  ],
};

/* --------------------------------------------------- Why Pink Fly exists -- */
export const mission = {
  eyebrow: "Why Pink Fly exists",
  headline: "The room every founder wishes she'd found sooner.",
  body: [
    "Too many women build brilliant businesses alone. Pink Fly is the mentors, the peers and the network that changes that.",
  ],
  cta: { label: "Join the community", href: "/join" },
};

/* ---------------------------------------------------------------- Impact -- */
export const impact = {
  eyebrow: "Our impact",
  headline: "A movement, measured.",
  /**
   * Figures and labels are the wireframe's own. One icon each, so the row
   * reads visually before it reads verbally.
   * TODO(pre-launch): confirm every figure against source data.
   */
  stats: [
    { icon: Users, value: 1000, suffix: "+", label: "Community members" },
    { icon: Rocket, value: 600, suffix: "+", label: "Women who bootstrapped an idea into a business" },
    { icon: TrendingUp, value: 100, suffix: "+", label: "Founders who went on to raise funding" },
    { icon: Target, value: 10, suffix: "+", label: "Businesses scaled" },
  ] satisfies {
    icon: LucideIcon;
    value: number;
    suffix: string;
    label: string;
  }[],
};

/* ------------------------------------------------------------- Community -- */
export type CommunityCard = {
  title: string;
  description: string;
  image: StockImage;
  /** Frame treatment — drives the organic image shapes. */
  shape: FrameShape;
};

export const community = {
  eyebrow: "The community",
  headline: "How we gather.",
  intro: "Four ways we meet.",
  cards: [
    {
      title: "Meetups & launches",
      description:
        "Real rooms, real conversations.",
      image: communityImages.meetups,
      shape: "arch",
    },
    {
      title: "Online meets",
      description:
        "Small circles that keep you moving.",
      image: communityImages.onlineMeets,
      shape: "blob",
    },
    {
      title: "Webinars",
      description:
        "The exact skill you need next.",
      image: communityImages.webinars,
      shape: "leaf",
    },
    {
      title: "Coffee chats",
      description:
        "One-to-one with mentors who get it.",
      image: communityImages.coffeeChats,
      shape: "rect",
    },
  ] satisfies CommunityCard[],
};

/* ----------------------------------------------------------- Testimonials -- */
/** Hidden behind `flags.testimonials` — built, not yet live. */
export const testimonials = {
  eyebrow: "Founder stories",
  headline: "She found her people.",
  note: "Placeholder testimonials — replace with real founders before launch.",
  items: [
    {
      quote:
        "I was building in a vacuum. Now I have mentors on speed dial and a room that wants me to win.",
      name: "Placeholder Name",
      role: "Founder",
      company: "Placeholder Company",
    },
    {
      quote:
        "My accountability circle took me from side project to real revenue in six months.",
      name: "Placeholder Name",
      role: "Founder & CEO",
      company: "Placeholder Company",
    },
    {
      quote:
        "One introduction became my first stockist. The next became my first investor.",
      name: "Placeholder Name",
      role: "Co-founder",
      company: "Placeholder Company",
    },
  ],
};

/* ------------------------------------------------------------- Final CTA -- */
export const finalCta = {
  eyebrow: "Your seat is waiting",
  headline: "This is where you find your people.",
  body: "Membership is free. The room is already warm.",
  cta: { label: "Join the community", href: "/join" },
};

/* ------------------------------------------------------------ Newsletter -- */
export const newsletter = {
  headline: "Get the Pink Fly letter.",
  subhead: "Stories, playbooks and invites. Never noise.",
  placeholder: "you@yourbrand.com",
  cta: "Subscribe",
};

/* ------------------------------------------------------------ About page -- */
export const about = {
  hero: {
    eyebrow: "About Pink Fly",
    title: "A community built for the long climb.",
    intro:
      "Where ambitious women find the mentorship, network and belief to build.",
    image: aboutImages.banner,
  },
  founder: {
    eyebrow: "Founder story",
    name: "Anjan Prasad",
    role: "Founder, Pink Fly",
    image: aboutImages.founder,
    body: [
      "The women building the most interesting businesses were almost always doing it alone. They had the ambition. What they lacked was a room.",
      "So we built one — meetups, masterclasses, mentorship and introductions. The infrastructure ambition needs to survive its first few years.",
      // TODO(pre-launch): replace with the founder's own words.
    ],
  },
  guidelines: {
    eyebrow: "Community guidelines",
    headline: "How we show up for each other.",
    intro: "What every member agrees to.",
    image: aboutImages.guidelines,
    items: [
      {
        title: "Generosity first",
        description:
          "Give the introduction, the template, the hard-won lesson — before you ask.",
      },
      {
        title: "Confidentiality holds",
        description:
          "What's said in a circle stays in the circle. Numbers included.",
      },
      {
        title: "No pitching, no poaching",
        description:
          "A community, not a lead list. Relationship first.",
      },
      {
        title: "Respect the range",
        description:
          "Day-one founders and second-time CEOs, same room. Every stage counts.",
      },
      {
        title: "Show up honestly",
        description:
          "Progress updates beat highlight reels. The dips teach more.",
      },
      {
        title: "Zero tolerance for harm",
        description:
          "Harassment, discrimination or bad faith ends a membership. No exceptions.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact us",
    headline: "Talk to the Pink Fly team.",
    intro: "Partnerships, press, speaking, or just a question. We read everything.",
  },
};

/* ---------------------------------------------------- Join Community page -- */
export const join = {
  hero: {
    eyebrow: "Join the community",
    title: "Your seat is waiting.",
    intro: "Membership is free. Bring whatever you're building.",
  },
  whyJoin: {
    eyebrow: "Why join us",
    headline: "What membership actually gives you.",
    benefits: [
      {
        title: "Networking",
        description:
          "Introductions to founders, operators and investors who move things.",
      },
      {
        title: "Mentorship",
        description:
          "From women who have built, scaled and exited. Matched to your stage.",
      },
      {
        title: "Events",
        description:
          "Roundtables, meetups and city-wide founder summits.",
      },
      {
        title: "Masterclasses",
        description:
          "Short, practical sessions on the skills you need next.",
      },
      {
        title: "Knowledge Base",
        description:
          "Playbooks, business news and policy updates, kept brief.",
      },
      {
        title: "Accountability",
        description:
          "Small circles that keep you moving when motivation runs out.",
      },
    ],
  },
  /**
   * Long-form, CMS-managed block. `body` is an array of paragraphs so a CMS
   * can supply rich content later without a component change. Until the CMS
   * is connected, this placeholder copy renders in its place.
   */
  editorial: {
    key: "join-community-editorial",
    eyebrow: "From the team",
    headline: "What to expect in your first month.",
    body: [
      // TODO(pre-launch): replace with editor-authored content once the CMS is live.
      "Most members introduce themselves in the channel, join the next online meet, and book a coffee chat with someone a stage ahead.",
      "Attend as much or as little as you like. The community works at a slow pace too.",
    ],
  },
  cta: {
    eyebrow: "Membership",
    headline: "Join the community.",
    body: "Tell us where you are and what you're building. We'll send your welcome pack, point you at the next room, and introduce you to founders a step ahead.",
  },
  form: {
    submit: "Join Pink Fly",
    reassurance: "Free to join · Takes about a minute",
    successTitle: "You're in.",
    successBody:
      "Welcome to Pink Fly. Your welcome pack is on its way, with the community links and the next events near you.",
  },
  faqs: [
    {
      q: "Who can join Pink Fly?",
      a: "Any woman building, or seriously planning, a business. No revenue threshold, no stage requirement.",
    },
    {
      q: "Does membership cost anything?",
      a: "Membership is free. Some events and intensive programmes are ticketed, always priced up front.",
    },
    {
      q: "What happens after I submit the form?",
      a: "The team sends a welcome pack with your community links and the next events in your region.",
    },
    {
      q: "Can I join from outside the listed regions?",
      a: "Yes. Pick 'Global' in the region selector to see everything on offer.",
    },
  ],
};

/* ------------------------------------------------------- Knowledge Base -- */
export const knowledgeBase = {
  hero: {
    eyebrow: "Knowledge Base",
    title: "Written for founders in a hurry.",
    intro: "Playbooks, business news, and the policy changes that affect how you build.",
  },
};

/* ------------------------------------------------------ Value spotlight -- */
/**
 * Built and reusable, but NOT part of the homepage flow — the approved
 * wireframe does not include it. See <ValueSpotlight>.
 */
export const valueSpotlight = {
  eyebrow: "More than a network",
  headline: "Momentum you can feel, month after month.",
  body: "Not a directory you forget about. A rhythm — a mentor in your corner, a circle that checks in.",
  points: [
    "Matched mentorship, not a cold introduction.",
    "Small accountability circles that meet all year.",
    "Members-only masterclasses, playbooks and templates.",
  ],
  cta: { label: "See what's inside", href: "/join" },
};


/* ---------------------------------------------------------- Join (CTA) -- */
/**
 * The homepage's closing section. Distinct from `join` above, which is the
 * content for the full /join page.
 */
export const joinCta = {
  eyebrow: "Your seat is waiting",
  headline: "Ready when you are.",
  body: "Founder stories, playbooks, and first access to every room we open.",
  placeholder: "you@yourbrand.com",
  cta: "Join Pink Fly",
  success: "You're in. Welcome to Pink Fly.",
};
