/**
 * Content-as-data. All copy, stats, pillars, and stories live here so
 * messaging can change without touching components — and so this can later
 * be swapped for a CMS with no component changes.
 */
import {
  Compass,
  Users,
  Sparkles,
  TrendingUp,
  Target,
  HeartHandshake,
  Calendar,
  GraduationCap,
  Network,
  Mic,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------- Hero -- */
export const hero = {
  eyebrow: "A Noboru World initiative",
  headline: "You were never meant to build alone.",
  subhead:
    "Pink Fly is India's community for ambitious women entrepreneurs — a place to launch, scale, and conquer with the mentorship, network, and belief you deserve.",
  primaryCta: { label: "Join the community", href: "/#join" },
  secondaryCta: { label: "Learn more", href: "/about" },
  /** Caption sitting beneath the hero visual. */
  mediaCaption:
    "Founders from across India — building in public, together.",
};

/* --------------------------------------------------------------- Trust -- */
export const trust = {
  statement:
    "Trusted by founders, mentors, and partner organisations across India.",
  /** Replace each name with a real logo asset in /public/images before launch. */
  logos: [
    "Noboru World",
    "SheLeads India",
    "Startup Collective",
    "Founders Guild",
    "WomenX",
    "The Growth Room",
  ],
};

/* ------------------------------------------------------------- Mission -- */
export const mission = {
  eyebrow: "Why Pink Fly exists",
  headline: "We're building the room every woman founder wishes she'd walked into sooner.",
  body: "Ambition shouldn't be lonely. Too many women build brilliant businesses in isolation — without mentors who get it, peers who cheer, or a network that opens doors. Pink Fly exists to change that: a long-term ecosystem where women turn dreams into companies, and companies into legacies.",
  pillars: [
    {
      icon: Compass,
      title: "Our vision",
      description:
        "A generation of women founders who never have to choose between ambition and support.",
    },
    {
      icon: Users,
      title: "Our community",
      description:
        "Founders, mentors, and operators who show up for each other — online and in the room.",
    },
    {
      icon: TrendingUp,
      title: "Business growth",
      description:
        "Strategy, accountability, and real playbooks to help you move from idea to scale.",
    },
    {
      icon: Sparkles,
      title: "Dreams, realized",
      description:
        "We help you do the thing you've been quietly planning for years — for real, this time.",
    },
  ] satisfies { icon: LucideIcon; title: string; description: string }[],
};

/* -------------------------------------------------------------- Impact -- */
export const impact = {
  eyebrow: "Our impact",
  headline: "A movement, measured.",
  subhead:
    "Placeholder figures — swap for verified numbers before launch.",
  stats: [
    { value: 5000, suffix: "+", label: "Community members" },
    { value: 1200, suffix: "+", label: "Women supported" },
    { value: 340, suffix: "+", label: "Businesses launched" },
    { value: 90, suffix: "+", label: "Workshops hosted" },
  ],
};

/* ----------------------------------------------------------- Community -- */
export const community = {
  eyebrow: "The community",
  headline: "Everything you need, and the people to do it with.",
  offerings: [
    {
      icon: Network,
      title: "Networking",
      description:
        "Meaningful introductions to founders, investors, and partners who move your business forward.",
    },
    {
      icon: HeartHandshake,
      title: "Mentorship",
      description:
        "Guidance from women who've built, scaled, and exited — matched to where you are now.",
    },
    {
      icon: Calendar,
      title: "Events",
      description:
        "Curated gatherings, from intimate roundtables to city-wide founder summits.",
    },
    {
      icon: GraduationCap,
      title: "Masterclasses",
      description:
        "Practical, no-fluff sessions on the exact skills a founder needs to grow.",
    },
    {
      icon: Mic,
      title: "Founder meetups",
      description:
        "Real rooms, real conversations — the peers who become your board of directors.",
    },
    {
      icon: Sparkles,
      title: "Accountability",
      description:
        "Small circles that keep you moving when motivation alone runs out.",
    },
  ] satisfies { icon: LucideIcon; title: string; description: string }[],
};

/* --------------------------------------------------------- Why Pink Fly -- */
export const whyPinkFly = {
  eyebrow: "Why Pink Fly",
  headline: "Six ways we help you win.",
  reasons: [
    {
      icon: Target,
      title: "Business Strategy",
      description: "Clarity on what to build, what to skip, and what to do next.",
    },
    {
      icon: HeartHandshake,
      title: "Mentorship",
      description: "One-to-one and group guidance from women who've done it.",
    },
    {
      icon: Network,
      title: "Networking",
      description: "The relationships that quietly change the trajectory of a business.",
    },
    {
      icon: TrendingUp,
      title: "Growth Support",
      description: "Hands-on help across marketing, product, hiring, and funding.",
    },
    {
      icon: Sparkles,
      title: "Accountability",
      description: "Structure and rhythm so progress becomes inevitable.",
    },
    {
      icon: Users,
      title: "Community",
      description: "A place to belong — where your wins are celebrated and your dips are held.",
    },
  ] satisfies { icon: LucideIcon; title: string; description: string }[],
};

/* ------------------------------------------------------ Founder Stories -- */
export const founderStories = {
  eyebrow: "Founder stories",
  headline: "She found her people. Then she found her stride.",
  subhead: "Placeholder testimonials — replace with real founders and photos before launch.",
  stories: [
    {
      quote:
        "Before Pink Fly I was building in a vacuum. Now I have mentors on speed dial and a room full of women who genuinely want me to win.",
      name: "Ananya Rao",
      role: "Founder",
      company: "Studio Marigold",
    },
    {
      quote:
        "The accountability circle got my brand from a side project to real revenue in six months. I stopped waiting for permission.",
      name: "Priya Menon",
      role: "Founder & CEO",
      company: "Loom & Co.",
    },
    {
      quote:
        "One introduction here led to my first stockist, then my first investor. This community opens doors I didn't know existed.",
      name: "Fatima Sheikh",
      role: "Co-founder",
      company: "Nourish Labs",
    },
    {
      quote:
        "I finally felt understood — as a founder and as a woman. That belonging is the thing no course ever gave me.",
      name: "Kavya Iyer",
      role: "Founder",
      company: "The Daily Press",
    },
  ],
};

/* ---------------------------------------------------------- Newsletter -- */
export const newsletter = {
  eyebrow: "Stay close",
  headline: "Get the Pink Fly letter.",
  subhead:
    "Founder stories, playbooks, and event invites — a few times a month, never noise.",
  placeholder: "you@yourbrand.com",
  cta: "Subscribe",
};

/* ------------------------------------------------------ Value spotlight -- */
export const valueSpotlight = {
  eyebrow: "More than a network",
  headline: "Momentum you can feel, month after month.",
  body: "Membership isn't a directory you forget about. It's a rhythm — a mentor in your corner, a circle that checks in, and rooms full of women who've already solved the thing you're stuck on.",
  points: [
    "Matched mentorship, not a random inbox introduction.",
    "Small accountability circles that meet all year.",
    "Members-only masterclasses, playbooks, and templates.",
  ],
  cta: { label: "See what's inside", href: "/community" },
};

/* ------------------------------------------------------------ Final CTA -- */
export const finalCta = {
  eyebrow: "Your seat is waiting",
  headline: "This is where you find your people.",
  body: "Join thousands of ambitious women building the businesses — and the lives — they actually want.",
  cta: { label: "Join the community", href: "/#join" },
};
