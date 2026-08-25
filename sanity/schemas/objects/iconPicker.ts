import { defineType } from "sanity";

/**
 * The icons a section may use.
 *
 * A closed list rather than free text: every value maps to a Lucide icon in
 * `src/lib/cms/icons.ts`, so an editor can change an icon without being able
 * to break the render with a name that does not exist.
 */
export const ICON_OPTIONS = [
  "users",
  "heart-handshake",
  "trending-up",
  "calendar",
  "graduation-cap",
  "network",
  "rocket",
  "target",
  "sparkles",
  "message-circle",
  "book-open",
  "handshake",
] as const;

export type IconName = (typeof ICON_OPTIONS)[number];

export const iconPicker = defineType({
  name: "iconPicker",
  title: "Icon",
  type: "string",
  options: {
    list: ICON_OPTIONS.map((value) => ({
      title: value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
    })),
  },
});
