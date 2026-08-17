/**
 * Content-as-data. All copy, stats, and stories live here so messaging can
 * change without touching components — and so this can later be swapped for
 * a CMS with no component changes.
 *
 * Voice: short, dry, confident. The brand is "when pigs fly" — so every line
 * should sound like someone who has stopped asking permission. If a sentence
 * needs a comma to survive, cut it.
 */
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

/* ---------------------------------------------------------------- Hero -- */

/**
 * One slide of the hero carousel.
 *
 * `src` is a path under /public — e.g. "/images/founders/ananya.jpg". Leave it
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
  primaryCta: { label: "Join Oinkfly", href: "/#join" },
  secondaryCta: { label: "See the proof", href: "/#proof" },
  /**
   * TODO(pre-launch): add `src` to each slide once the founder portraits are
   * shot and cleared. Names and roles below are illustrative until then.
   */
  slides: [
    {
      alt: "Ananya Rao at her workbench in Bengaluru, checking a run of hand-blocked textiles.",
      name: "Ananya Rao",
      role: "Founder, Studio Marigold",
      city: "Bengaluru",
    },
    {
      alt: "Priya Menon in her Kochi studio, packing the first big order of the week.",
      name: "Priya Menon",
      role: "Founder & CEO, Loom & Co.",
      city: "Kochi",
    },
    {
      alt: "Fatima Sheikh on the floor of her Mumbai production unit, mid-conversation with her team.",
      name: "Fatima Sheikh",
      role: "Co-founder, Nourish Labs",
      city: "Mumbai",
    },
    {
      alt: "Kavya Iyer at a Delhi founder meetup, laughing with two other members.",
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

/* ------------------------------------------------------------ Manifesto -- */
export const manifesto = {
  eyebrow: "Why we exist",
  headline: "Someone told you to be realistic.",
  body: "Oinkfly is the room where that advice stops. Women who have built it, women building it now, and the honest help in between.",
  /** Scrolls across the manifesto band — the flight path, spelled out. */
  marquee: [
    "Idea",
    "First customer",
    "First hire",
    "First round",
    "Scale",
    "Legacy",
  ],
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

/* ------------------------------------------------------------ What you get -- */
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
 * TODO(pre-launch): these are illustrative, not real members. Swap for
 * consented quotes and photos before the site goes live.
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

/* ------------------------------------------------------------------ Join -- */
export const join = {
  eyebrow: "Your seat is waiting",
  headline: "Ready when you are.",
  body: "Join Oinkfly for founder stories, playbooks, and first access to every room we open.",
  placeholder: "you@yourbrand.com",
  cta: "Join Oinkfly",
  success: "You're in. Welcome to Oinkfly.",
};
