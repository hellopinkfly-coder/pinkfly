/**
 * Executive team and past initiatives.
 *
 * Both lists are rendered by reusable components, so adding a real team
 * member or a past initiative is a matter of appending an object here.
 * The Initiatives section is gated behind `flags.initiatives`.
 */
import { teamPlaceholder } from "@/config/images";

export type TeamMember = {
  name: string;
  role: string;
  /** Portrait. `null` renders the neutral placeholder frame. */
  image: string | null;
  bio?: string;
  linkedin?: string;
};

export const executiveTeam: TeamMember[] = [
  {
    name: "Name to be confirmed",
    role: "CEO",
    image: teamPlaceholder,
    bio: "Placeholder biography — replace with the team member's own words.",
  },
  {
    name: "Name to be confirmed",
    role: "CMO",
    image: teamPlaceholder,
    bio: "Placeholder biography — replace with the team member's own words.",
  },
];

export type Initiative = {
  slug: string;
  title: string;
  /** Year or date range, e.g. "2025" or "2024 – 2025". */
  period: string;
  summary: string;
  image: { src: string; alt: string } | null;
  /** Optional headline outcomes. */
  highlights?: string[];
};

/**
 * Previous Pink Fly activities and initiatives. Hidden for now via
 * `flags.initiatives` — do not delete, this goes live once content is ready.
 */
export const initiatives: Initiative[] = [
  {
    slug: "placeholder-initiative-one",
    title: "Initiative title to be confirmed",
    period: "Year TBC",
    summary:
      "Placeholder summary of a past Pink Fly initiative. Replace with the real programme description.",
    image: {
      src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",
      alt: "Placeholder image for a past Pink Fly initiative",
    },
    highlights: ["Placeholder outcome", "Placeholder reach"],
  },
  {
    slug: "placeholder-initiative-two",
    title: "Initiative title to be confirmed",
    period: "Year TBC",
    summary:
      "Placeholder summary of a past Pink Fly initiative. Replace with the real programme description.",
    image: {
      src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
      alt: "Placeholder image for a past Pink Fly initiative",
    },
    highlights: ["Placeholder outcome", "Placeholder reach"],
  },
  {
    slug: "placeholder-initiative-three",
    title: "Initiative title to be confirmed",
    period: "Year TBC",
    summary:
      "Placeholder summary of a past Pink Fly initiative. Replace with the real programme description.",
    image: {
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
      alt: "Placeholder image for a past Pink Fly initiative",
    },
    highlights: ["Placeholder outcome", "Placeholder reach"],
  },
];
