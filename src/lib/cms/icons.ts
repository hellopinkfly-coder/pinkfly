import {
  Users,
  HeartHandshake,
  TrendingUp,
  Calendar,
  GraduationCap,
  Network,
  Rocket,
  Target,
  Sparkles,
  MessageCircle,
  BookOpen,
  Handshake,
  type LucideIcon,
} from "lucide-react";

/**
 * The icons an editor may choose, keyed by the value stored in Sanity.
 *
 * Icons are picked from a closed list in the Studio, so an unknown name can
 * only arrive from a schema change — `iconFor` falls back to a neutral icon
 * rather than throwing and taking the page down.
 */
const ICONS: Record<string, LucideIcon> = {
  users: Users,
  "heart-handshake": HeartHandshake,
  "trending-up": TrendingUp,
  calendar: Calendar,
  "graduation-cap": GraduationCap,
  network: Network,
  rocket: Rocket,
  target: Target,
  sparkles: Sparkles,
  "message-circle": MessageCircle,
  "book-open": BookOpen,
  handshake: Handshake,
};

export function iconFor(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name]) || Sparkles;
}

/** The reverse map, used by the seed script to store the right key. */
export function iconKey(icon: LucideIcon): string {
  const found = Object.entries(ICONS).find(([, value]) => value === icon);
  return found?.[0] ?? "sparkles";
}
