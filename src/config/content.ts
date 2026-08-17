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
import type { OrbitIcon } from "@/components/brand/FlightScene";

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
  src?: string;
  /** Describe the person and what they are doing — this is read aloud. */
  alt: string;
  name: string;
  role: string;
  city: string;
};

export const hero = {
  eyebrow: "A Noboru World initiative",
  headline: "When pigs fly.",
  subhead:
    "Oinkfly is India's community for women founders — the mentors, network, and nerve to build the thing everyone called unrealistic.",
  primaryCta: { label: "Join Oinkfly", href: "/join" },
  secondaryCta: { label: "Explore events", href: "/events" },
  /**
   * TODO(pre-launch): these are stock photographs standing in for real
   * members, and the names and roles are illustrative. Replace both with
   * consented founder portraits — see public/images/founders/README.md.
   */
  slides: [
    {
      src: heroPhotos[0]?.src,
      alt: "A woman founder presenting to her team.",
      name: "Ananya Rao",
      role: "Founder, Studio Marigold",
      city: "Bengaluru",
    },
    {
      src: heroPhotos[1]?.src,
      alt: "Two women in conversation across a desk.",
      name: "Priya Menon",
      role: "Founder & CEO, Loom & Co.",
      city: "Kochi",
    },
    {
      src: heroPhotos[2]?.src,
      alt: "Women gathered in conversation at a community event.",
      name: "Fatima Sheikh",
      role: "Co-founder, Nourish Labs",
      city: "Mumbai",
    },
    {
      src: heroPhotos[3]?.src,
      alt: "A woman speaking to an audience at an Oinkfly event.",
      name: "Kavya Iyer",
      role: "Founder, The Daily Press",
      city: "Delhi",
    },
  ] as HeroSlide[],
  /** Icons that ring the hero visual. Positions are % of the scene box. */
  orbit: [
    { icon: HeartHandshake, label: "Mentorship", x: 2, y: 22 },
    { icon: Network, label: "Network", x: 97, y: 40 },
    { icon: Rocket, label: "Launch", x: 8, y: 74 },
    { icon: TrendingUp, label: "Growth", x: 94, y: 84 },
  ] satisfies OrbitIcon[],
};

/* --------------------------------------------------------------- Trust -- */
/**
 * Credibility strip. Built and reusable, but NOT part of the homepage flow —
 * the approved wireframe does not include it. Kept so it can be dropped onto
 * a page later; see <Trust>.
 */
export const trust = {
  statement:
    "Trusted by founders, mentors and partner organisations across the Oinkfly network.",
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

/* --------------------------------------------------- Why Oinkfly exists -- */
export const mission = {
  eyebrow: "Why Oinkfly exists",
  headline:
    "We're building the room every woman founder wishes she'd walked into sooner.",
  body: [
    "Ambition shouldn't be lonely. Too many women build brilliant businesses in isolation — without mentors who understand the work, peers who cheer the small wins, or a network that quietly opens doors.",
    "Oinkfly exists to change that. It is a long-term ecosystem where women turn ideas into companies, and companies into legacies — with mentorship, education and a community that shows up.",
  ],
  cta: { label: "Join the community", href: "/join" },
};

/* ---------------------------------------------------------------- Impact -- */
export const impact = {
  eyebrow: "Our impact",
  headline: "A movement, measured.",
  note: "Placeholder figures — replace with verified numbers before launch.",
  stats: [
    { value: 1000, suffix: "+", label: "Community members" },
    { value: 600, suffix: "+", label: "Women who bootstrapped an idea into a business" },
    { value: 100, suffix: "+", label: "Founders who went on to raise funding" },
    { value: 10, suffix: "+", label: "Businesses scaled with Oinkfly support" },
  ],
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
  intro:
    "Four ways the community meets — online, in person, and everywhere in between.",
  cards: [
    {
      title: "Meetups & launches",
      description:
        "Real rooms, real conversations — and the launch parties that follow.",
      image: communityImages.meetups,
      shape: "arch",
    },
    {
      title: "Online meets",
      description:
        "Small circles that keep you moving, wherever you're building from.",
      image: communityImages.onlineMeets,
      shape: "blob",
    },
    {
      title: "Webinars",
      description:
        "No-fluff sessions on the exact skills a founder needs next.",
      image: communityImages.webinars,
      shape: "leaf",
    },
    {
      title: "Coffee chats",
      description:
        "One-to-one introductions with the mentors and peers who get it.",
      image: communityImages.coffeeChats,
      shape: "rect",
    },
  ] satisfies CommunityCard[],
};

/* ----------------------------------------------------------- Testimonials -- */
/** Hidden behind `flags.testimonials` — built, not yet live. */
export const testimonials = {
  eyebrow: "Founder stories",
  headline: "She found her people. Then she found her stride.",
  note: "Placeholder testimonials — replace with real founders before launch.",
  items: [
    {
      quote:
        "Before Oinkfly I was building in a vacuum. Now I have mentors on speed dial and a room full of women who genuinely want me to win.",
      name: "Placeholder Name",
      role: "Founder",
      company: "Placeholder Company",
    },
    {
      quote:
        "The accountability circle took my brand from a side project to real revenue in six months. I stopped waiting for permission.",
      name: "Placeholder Name",
      role: "Founder & CEO",
      company: "Placeholder Company",
    },
    {
      quote:
        "One introduction led to my first stockist, then my first investor. This community opens doors I didn't know existed.",
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
  body: "Join the women building the businesses — and the lives — they actually want. Membership is free, and the room is already warm.",
  cta: { label: "Join the community", href: "/join" },
};

/* ------------------------------------------------------------ Newsletter -- */
export const newsletter = {
  headline: "Get the Oinkfly letter.",
  subhead:
    "Founder stories, playbooks and event invites — a few times a month, never noise.",
  placeholder: "you@yourbrand.com",
  cta: "Subscribe",
};

/* ------------------------------------------------------------ About page -- */
export const about = {
  hero: {
    eyebrow: "About Oinkfly",
    title: "A community built for the long climb.",
    intro:
      "Oinkfly is where ambitious women find the mentorship, network and belief that make building a business survivable — and then successful.",
    image: aboutImages.banner,
  },
  founder: {
    eyebrow: "Founder story",
    name: "Anjan Prasad",
    role: "Founder, Oinkfly",
    image: aboutImages.founder,
    body: [
      "Oinkfly began with a simple observation: the women building the most interesting businesses were almost always doing it alone. They had the ambition and the idea. What they didn't have was a room.",
      "So we built one. What started as a handful of founders comparing notes has grown into an ecosystem of meetups, masterclasses, mentorship and introductions — the infrastructure that ambition needs to survive its first few years.",
      "Placeholder biography — replace with the founder's own words before launch.",
    ],
  },
  guidelines: {
    eyebrow: "Community guidelines",
    headline: "How we show up for each other.",
    intro:
      "A community works because of what its members agree to. These are ours.",
    image: aboutImages.guidelines,
    items: [
      {
        title: "Generosity first",
        description:
          "Share the introduction, the template, the hard-won lesson. The room compounds when everyone gives before they ask.",
      },
      {
        title: "Confidentiality holds",
        description:
          "What's said in a circle stays in the circle. Revenue numbers, hard seasons and half-formed ideas are all safe here.",
      },
      {
        title: "No pitching, no poaching",
        description:
          "This is a community, not a lead list. Build the relationship first — business follows on its own.",
      },
      {
        title: "Respect the range",
        description:
          "Day-one founders and second-time CEOs share the same room. Every stage is a legitimate stage.",
      },
      {
        title: "Show up honestly",
        description:
          "Progress updates beat highlight reels. The dips are the part other founders actually learn from.",
      },
      {
        title: "Zero tolerance for harm",
        description:
          "Harassment, discrimination and bad-faith behaviour end a membership. No exceptions, no warnings needed.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact us",
    headline: "Talk to the Oinkfly team.",
    intro:
      "Partnerships, press, speaking or just a question about membership — we read everything.",
  },
};

/* ---------------------------------------------------- Join Community page -- */
export const join = {
  hero: {
    eyebrow: "Join the community",
    title: "Your seat is waiting.",
    intro:
      "Membership is free. Bring your ambition, your questions and whatever you're building right now.",
  },
  whyJoin: {
    eyebrow: "Why join us",
    headline: "What membership actually gives you.",
    benefits: [
      {
        title: "Networking",
        description:
          "Introductions to founders, operators and investors who move your business forward.",
      },
      {
        title: "Mentorship",
        description:
          "Guidance from women who have built, scaled and exited — matched to where you are now.",
      },
      {
        title: "Events",
        description:
          "Curated gatherings, from intimate roundtables to city-wide founder summits.",
      },
      {
        title: "Masterclasses",
        description:
          "Practical, no-fluff sessions on the exact skills a founder needs to grow.",
      },
      {
        title: "Knowledge Base",
        description:
          "Playbooks, business news and policy updates, written for founders in a hurry.",
      },
      {
        title: "Accountability",
        description:
          "Small circles that keep you moving when motivation alone runs out.",
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
      "Placeholder content — this block is designed to be managed through the CMS/CRM. Everything below will be replaced by editor-authored content once the integration is live.",
      "Most members start by introducing themselves in the community channel, joining the next online meet, and booking a coffee chat with someone a stage ahead of them. There is no obligation to attend everything — the community works just as well at a slow pace.",
      "You'll get the Oinkfly letter every few weeks with upcoming events, member wins and playbooks worth your time.",
    ],
  },
  cta: {
    headline: "Ready when you are.",
    body: "Fill in the short form and the team will be in touch with your welcome pack.",
    label: "Join now",
  },
  faqs: [
    {
      q: "Who can join Oinkfly?",
      a: "Any woman building, or seriously planning, a business. There is no revenue threshold and no stage requirement.",
    },
    {
      q: "Does membership cost anything?",
      a: "Community membership is free. Some ticketed events and intensive programmes are paid — pricing is always shown up front.",
    },
    {
      q: "What happens after I submit the form?",
      a: "Your response goes to the Oinkfly team, who will send a welcome pack with the community links and the next set of events in your region.",
    },
    {
      q: "Can I join from outside the listed regions?",
      a: "Yes. The global community is open worldwide — pick 'Global' in the region selector to see everything on offer.",
    },
  ],
};

/* ------------------------------------------------------- Knowledge Base -- */
export const knowledgeBase = {
  hero: {
    eyebrow: "Knowledge Base",
    title: "Everything worth knowing, written for founders in a hurry.",
    intro:
      "Playbooks from the community, the business news that matters, and the policy changes that affect how you build.",
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
  body: "Membership isn't a directory you forget about. It's a rhythm — a mentor in your corner, a circle that checks in, and rooms full of women who've already solved the thing you're stuck on.",
  points: [
    "Matched mentorship, not a random inbox introduction.",
    "Small accountability circles that meet all year.",
    "Members-only masterclasses, playbooks and templates.",
  ],
  cta: { label: "See what's inside", href: "/join" },
};


/* ==========================================================================
   Oinkfly homepage
   --------------------------------------------------------------------------
   The sections below drive the homepage. Voice: short, dry, confident. The
   brand is "when pigs fly" — every line should sound like someone who has
   stopped asking permission. If a sentence needs a comma to survive, cut it.

   `mission`, `impact`, `community`, `testimonials`, `finalCta` and
   `newsletter` above still power the About, Events and Knowledge Base pages
   (and remain available for reuse), so they are intentionally kept.
   ========================================================================== */

/* ------------------------------------------------------------ Manifesto -- */
export const manifesto = {
  eyebrow: "Why we exist",
  headline: "Someone told you to be realistic.",
  body: "Oinkfly is the room where that advice stops. Women who have built it, women building it now, and the honest help in between.",
  /** Scrolls across the manifesto band — the flight path, spelled out. */
  marquee: ["Idea", "First customer", "First hire", "First round", "Scale", "Legacy"],
};

/* --------------------------------------------------------------- Proof -- */
export const proof = {
  eyebrow: "Our impact",
  headline: "It flies.",
  subhead: "Four years of women refusing to stay grounded.",
  stats: [
    { value: 1000, suffix: "+", label: "In the community" },
    { value: 600, suffix: "+", label: "Ideas turned into businesses" },
    { value: 100, suffix: "+", label: "Founders who raised" },
    { value: 10, suffix: "+", label: "Businesses scaled with Oinkfly" },
  ],
  /** Icons that ring the proof visual. */
  orbit: [
    { icon: Users, label: "Community", x: 4, y: 16 },
    { icon: Rocket, label: "Launched", x: 96, y: 30 },
    { icon: TrendingUp, label: "Funded", x: 3, y: 66 },
    { icon: Target, label: "Scaled", x: 97, y: 80 },
  ] satisfies OrbitIcon[],
};

/* ---------------------------------------------------------- Membership -- */
export const offering = {
  eyebrow: "Membership",
  headline: "Everything you need for takeoff.",
  items: [
    {
      icon: HeartHandshake,
      title: "Mentorship",
      description: "Matched to where you are, not where a curriculum says you should be.",
    },
    {
      icon: Network,
      title: "Network",
      description: "Introductions to founders, buyers, and investors who move things.",
    },
    {
      icon: Target,
      title: "Strategy",
      description: "Clarity on what to build next — and what to ignore.",
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Roundtables, meetups, and one very good annual summit.",
    },
    {
      icon: GraduationCap,
      title: "Masterclasses",
      description: "Short, practical, no-fluff sessions from women who've shipped.",
    },
    {
      icon: Users,
      title: "Accountability",
      description: "Small circles that keep you moving when motivation runs out.",
    },
  ] satisfies { icon: LucideIcon; title: string; description: string }[],
};

/* ------------------------------------------------------------- Stories -- */
/**
 * TODO(pre-launch): illustrative, not real members. Swap for consented
 * quotes and photographs before the site goes live.
 */
export const stories = {
  eyebrow: "Founder stories",
  headline: "Ask the ones who took off.",
  items: [
    {
      quote:
        "I was building in a vacuum. Now I have mentors on speed dial and a room that wants me to win.",
      name: "Ananya Rao",
      role: "Founder, Studio Marigold",
    },
    {
      quote:
        "My accountability circle took me from side project to real revenue in six months.",
      name: "Priya Menon",
      role: "Founder & CEO, Loom & Co.",
    },
    {
      quote:
        "One introduction here became my first stockist. The next became my first investor.",
      name: "Fatima Sheikh",
      role: "Co-founder, Nourish Labs",
    },
    {
      quote:
        "Every accelerator taught me tactics. Oinkfly gave me the people who make them stick.",
      name: "Kavya Iyer",
      role: "Founder, The Daily Press",
    },
  ],
};

/* ---------------------------------------------------------- Join (CTA) -- */
/**
 * The homepage's closing section. Distinct from `join` above, which is the
 * content for the full /join page.
 */
export const joinCta = {
  eyebrow: "Your seat is waiting",
  headline: "Ready when you are.",
  body: "Join Oinkfly for founder stories, playbooks, and first access to every room we open.",
  placeholder: "you@yourbrand.com",
  cta: "Join Oinkfly",
  success: "You're in. Welcome to Oinkfly.",
};
