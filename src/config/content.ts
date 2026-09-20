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
import { siteConfig } from "@/config/site";
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
      eyebrow: "The Pinkfly community",
      headline: "For dreams that are ready to fly.",
      subhead:
        "A community for ambitious women, giving you the connections, confidence and support to take your ambition further.",
      points: [
        { icon: HeartHandshake, label: "Mentors who have already built it" },
        { icon: Network, label: "Introductions that open doors" },
      ],
      cta: { label: "Take flight with Pinkfly", href: "/join" },
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
      cta: { label: "Take flight with Pinkfly", href: "/join" },
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
      cta: { label: "Take flight with Pinkfly", href: "/join" },
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
      cta: { label: "Take flight with Pinkfly", href: "/join" },
      image: {
        src: heroPhotos[3]?.src,
        alt: "A woman speaking to an audience at a Pinkfly event.",
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
    "Trusted by founders, mentors and partner organisations across the Pinkfly network.",
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

/* --------------------------------------------------- Why Pinkfly exists -- */
export const mission = {
  eyebrow: "Why Pinkfly exists",
  headline: "Building a business is hard enough on your own.",
  body: [
    "Pinkfly connects women founders with mentors who have built companies before, peers at the same stage, and the introductions that are otherwise hard to come by.",
    "Meetups, masterclasses and one-to-one conversations — in person across India, the UAE and the United States, and online wherever you are.",
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
  body: "Founders here find the introduction, the answer or the room they needed — then do the same for someone else. Register and we will send your welcome pack, the community links and the next events near you.",
  /**
   * Two labels, because the button has two honest destinations: the Google
   * Form once its URL is configured, or the on-site Join page until then.
   * See <FinalCTA>.
   */
  cta: {
    formLabel: "Register now",
    label: "Register now",
    href: "/join",
  },
  note: "Takes about a minute · Reviewed by a person",
};

/* ------------------------------------------------------------ Newsletter -- */
export const newsletter = {
  headline: "Get the Pinkfly letter.",
  subhead: "Stories, playbooks and invites. Never noise.",
  placeholder: "you@yourbrand.com",
  cta: "Subscribe",
};

/**
 * The invitation that appears a few seconds after someone arrives.
 *
 * Every line is editable in the Studio (Site settings → Newsletter popup),
 * including whether it appears at all and how long it waits. These are the
 * defaults it falls back to.
 */
export const newsletterPopup = {
  enabled: true,
  delaySeconds: 3,
  eyebrow: "Before you go",
  headline: "Get what founders here are reading.",
  body: "One email: the new playbooks, the policy changes worth knowing, and the events near you. No pitch, and you can leave any time.",
  placeholder: "you@company.com",
  cta: "Subscribe",
  joinPrompt: "Ready for the whole thing?",
  joinLabel: "Join the community",
  joinNote: "— takes about a minute.",
  successTitle: "You're on the list.",
  successBody:
    "The next one lands soon. Membership is the bigger door — mentors, introductions and the rooms behind all this.",
};

/* ------------------------------------------------------------ About page -- */
export const about = {
  hero: {
    eyebrow: "About Pinkfly",
    title: "A community built for the long climb.",
    intro:
      "Where ambitious women find the mentorship, network and belief to build.",
    image: aboutImages.banner,
  },
  founder: {
    eyebrow: "Founder story",
    name: "Anjan Prasad",
    role: "Founder, Pinkfly",
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
    headline: "Talk to the Pinkfly team.",
    intro: "Partnerships, press, speaking, or just a question. We read everything.",
  },
};

/* ----------------------------------------------------------- Contact page -- */
/**
 * The Contact page.
 *
 * The address, phone and inbox are not here: they belong to each region and
 * live in `src/config/regions.ts`, so the page shows whichever region the
 * visitor is on.
 */
export const contact = {
  hero: {
    eyebrow: "Contact us",
    title: "Talk to the Pinkfly team.",
    intro:
      "Partnerships, press, speaking, sponsorship — or a question you cannot find the answer to. A person reads every message.",
  },
  heading: {
    eyebrow: "Write to us",
    headline: "Tell us what you need.",
    intro:
      "The more you can say about what you are after, the more useful the reply.",
  },
  responseNote: "We usually reply within two working days.",
  /** The short invitation that stands in for this page on About. */
  aboutCta: {
    eyebrow: "Contact us",
    headline: "Something you want to ask?",
    body: "Partnerships, press, speaking, or a question about the community.",
    label: "Go to Contact",
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
    headline: "You don't have to build it alone.",
    /**
     * What she gets, not what we do with her details. The old line described
     * our process — "tell us where you are", "we'll send your welcome pack" —
     * which is admin, not a reason to join.
     */
    body: "Every week, founders in this community find the introduction, the answer or the room they needed. Membership is free, and it takes about a minute.",
    /** Shown when the Google Form is live. */
    formLabel: "Join Pinkfly — it's free",
    /** Sets expectations before the visitor leaves the site. */
    formNote: "Free, always · About a minute · No pitch, no spam",
    /** Shown until a form URL is configured — never a dead button. */
    pending: "Registration opens shortly. Check back soon.",
    steps: [
      "Meet founders a stage ahead of you, in your city and online.",
      "Get the next events, playbooks and policy changes before they are public.",
      "Ask the room anything — pricing, hiring, funding, burnout.",
    ],
  },
  form: {
    submit: "Register",
    reassurance: "Free to join · Takes about a minute",
    successTitle: "You're in.",
    successBody:
      "Welcome to Pinkfly. Your welcome pack is on its way, with the community links and the next events near you.",
  },
  faqs: [
    {
      q: "Who can join Pinkfly?",
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

/* ------------------------------------------------------------------ FAQs -- */
/**
 * The dedicated FAQs page.
 *
 * Grouped by what the reader is actually worried about — whether they belong
 * here, what it costs, what happens at an event — rather than by which part
 * of the organisation owns the answer. The Join page keeps its own short set
 * for the moment of deciding; this is the reference.
 *
 * TODO(pre-launch): confirm every answer with the team. Anything the team has
 * not confirmed says so rather than inventing a policy.
 */
export const faqPage = {
  hero: {
    eyebrow: "FAQs",
    title: "Questions, answered.",
    intro:
      "Everything people ask before they join, and most of what they ask afterwards. If yours is not here, write to us and we will answer it — and add it.",
  },
  contactNote:
    "Still not sure about something? Email {email} and a person will reply.",
  groups: [
    {
      title: "Joining Pinkfly",
      intro: "Who it is for, and how to get in.",
      items: [
        {
          question: "Who can join Pinkfly?",
          answer:
            "Any woman building, or seriously planning, a business. No revenue threshold, no stage requirement, no invitation needed. Founders at the idea stage sit in the same rooms as founders who have raised — that is the point of it.",
        },
        {
          question: "Does membership cost anything?",
          answer:
            "Membership is free, and stays free. Some events and intensive programmes are ticketed; the price is always shown up front, before you register.",
        },
        {
          question: "What happens after I submit the form?",
          answer:
            "The team sends a welcome pack with your community links and the next events in your region. It usually arrives within a couple of working days.",
        },
        {
          question: "Can I join from outside the listed regions?",
          answer:
            "Yes. Choose 'Global' in the region selector to see everything on offer, including the online meets, which have no location at all.",
        },
        {
          question: "I am not a founder yet. Is it too early?",
          answer:
            "No. A good share of the community joined with an idea and no company. Coming early is easier than arriving once you are stuck.",
        },
      ],
    },
    {
      title: "Events and meetups",
      intro: "What they are like, and what they cost.",
      items: [
        {
          question: "What kinds of events do you run?",
          answer:
            "Meetups and launches in person, online meets, webinars and masterclasses, and one-to-one coffee chats. The Events page lists what is coming up and lets you filter by city, month and type.",
        },
        {
          question: "Do I have to attend everything?",
          answer:
            "Not at all. Come to what is useful and ignore the rest. The community works at a slow pace too.",
        },
        {
          question: "Are events free?",
          answer:
            "Most are. Ticketed events say so on their own page, with the price before you register.",
        },
        {
          question: "Can I bring someone with me?",
          answer:
            "Yes, if they would join the community themselves. Ask them to register too, so we know who is in the room.",
        },
        {
          question: "Can I speak or host a session?",
          answer:
            "We are always looking for members to share what they have learned. Write to us with the subject and roughly what you would cover.",
        },
      ],
    },
    {
      title: "Mentorship and introductions",
      intro: "How the matching actually works.",
      items: [
        {
          question: "How does mentorship work?",
          answer:
            "You are matched to where you are, not to a curriculum: a mentor who has built something at the stage ahead of yours. Some pairings run for months, some are a single conversation that answers the question.",
        },
        {
          question: "Can I be a mentor?",
          answer:
            "Yes, and members who have shipped something are exactly who we want. Tell us what you can help with and roughly how much time you have.",
        },
        {
          question: "Will you introduce me to investors?",
          answer:
            "Introductions happen inside the community, and some of them have led to funding. We do not promise investor access, and anyone who does is selling you something.",
        },
      ],
    },
    {
      title: "The Knowledge Base",
      intro: "The writing, and who it is for.",
      items: [
        {
          question: "Who writes the articles?",
          answer:
            "Members of the community and the Pinkfly team. Every piece carries its author and the date it was published.",
        },
        {
          question: "Can I write for the Knowledge Base?",
          answer:
            "Yes. Pitch the idea rather than the finished piece — a paragraph on what you would cover and who it helps is enough.",
        },
        {
          question: "How current are the government policy pages?",
          answer:
            "Each policy entry shows its effective date and the authority behind it. Treat it as a starting point and check the authority's own page before you act on it.",
        },
      ],
    },
    {
      title: "Your details and your privacy",
      intro: "What we hold, and what we do with it.",
      items: [
        {
          question: "What do you do with my details?",
          answer:
            "They are used to run your membership: your welcome pack, the events near you, and the newsletter if you asked for it. The full detail is in the privacy policy.",
        },
        {
          question: "Will you sell my data or pass it to sponsors?",
          answer:
            "No. We do not sell member data, and sponsors do not get your details.",
        },
        {
          question: "How do I unsubscribe or leave?",
          answer:
            "Every newsletter has an unsubscribe link, and you can write to us to have your membership and your details removed entirely.",
        },
      ],
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
  cta: "Join Pinkfly",
  success: "You're in. Welcome to Pinkfly.",
};

/* --------------------------------------------------------- Social wall -- */

/**
 * The homepage social wall: a row of link cards that open the real post.
 *
 * These four are placeholders pointing at the profiles themselves, so the
 * section renders correctly from the first build. Replace them in Sanity with
 * links to actual posts — paste the post URL, add the picture you posted, and
 * the card is done. YouTube links bring their own still.
 */
export const social = {
  eyebrow: "Follow along",
  headline: "What Pinkfly is up to.",
  intro:
    "Posts, reels and sessions from the community. Tap any of them to open the post.",
  posts: [
    {
      url: siteConfig.socials.instagram,
      caption: "Pinkfly on Instagram",
      image: communityImages.meetups,
    },
    {
      url: siteConfig.socials.youtube,
      caption: "Sessions and talks on YouTube",
      image: communityImages.webinars,
    },
    {
      url: siteConfig.socials.linkedin,
      caption: "Pinkfly on LinkedIn",
      image: communityImages.networking,
    },
    {
      url: siteConfig.socials.twitter,
      caption: "Pinkfly on X",
      image: communityImages.coffeeChats,
    },
  ],
};
