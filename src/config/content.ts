/**
 * Content-as-data.
 *
 * All marketing copy lives here so messaging can change without touching a
 * single component — and so this module can be swapped for a CMS/CRM feed
 * later with no change to the presentation layer. Region-specific copy lives
 * in `src/config/regions.ts`; anything here is shared by every region.
 */
import { communityImages, aboutImages, type StockImage } from "@/config/images";
import type { FrameShape } from "@/components/shared/ImageFrame";

/* ------------------------------------------------------------------ Hero -- */
export const hero = {
  /** The hero image itself links through to the About page (per wireframe). */
  imageHref: "/about",
  primaryCta: { label: "Join the community", href: "/join" },
  secondaryCta: { label: "Explore events", href: "/events" },
  /** Milliseconds between carousel slides. */
  interval: 1500,
};

/* --------------------------------------------------- Why Pink Fly exists -- */
export const mission = {
  eyebrow: "Why Pink Fly exists",
  headline:
    "We're building the room every woman founder wishes she'd walked into sooner.",
  body: [
    "Ambition shouldn't be lonely. Too many women build brilliant businesses in isolation — without mentors who understand the work, peers who cheer the small wins, or a network that quietly opens doors.",
    "Pink Fly exists to change that. It is a long-term ecosystem where women turn ideas into companies, and companies into legacies — with mentorship, education and a community that shows up.",
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
    { value: 10, suffix: "+", label: "Businesses scaled with Pink Fly support" },
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
        "Before Pink Fly I was building in a vacuum. Now I have mentors on speed dial and a room full of women who genuinely want me to win.",
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
  headline: "Get the Pink Fly letter.",
  subhead:
    "Founder stories, playbooks and event invites — a few times a month, never noise.",
  placeholder: "you@yourbrand.com",
  cta: "Subscribe",
};

/* ------------------------------------------------------------ About page -- */
export const about = {
  hero: {
    eyebrow: "About Pink Fly",
    title: "A community built for the long climb.",
    intro:
      "Pink Fly is where ambitious women find the mentorship, network and belief that make building a business survivable — and then successful.",
    image: aboutImages.banner,
  },
  founder: {
    eyebrow: "Founder story",
    name: "Anjan Prasad",
    role: "Founder, Pink Fly",
    image: aboutImages.founder,
    body: [
      "Pink Fly began with a simple observation: the women building the most interesting businesses were almost always doing it alone. They had the ambition and the idea. What they didn't have was a room.",
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
    headline: "Talk to the Pink Fly team.",
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
      "You'll get the Pink Fly letter every few weeks with upcoming events, member wins and playbooks worth your time.",
    ],
  },
  cta: {
    headline: "Ready when you are.",
    body: "Fill in the short form and the team will be in touch with your welcome pack.",
    label: "Join now",
  },
  faqs: [
    {
      q: "Who can join Pink Fly?",
      a: "Any woman building, or seriously planning, a business. There is no revenue threshold and no stage requirement.",
    },
    {
      q: "Does membership cost anything?",
      a: "Community membership is free. Some ticketed events and intensive programmes are paid — pricing is always shown up front.",
    },
    {
      q: "What happens after I submit the form?",
      a: "Your response goes to the Pink Fly team, who will send a welcome pack with the community links and the next set of events in your region.",
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
