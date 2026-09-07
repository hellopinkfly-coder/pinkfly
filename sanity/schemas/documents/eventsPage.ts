import { defineField, defineType } from "sanity";

export const eventsPage = defineType({
  name: "eventsPage",
  title: "Events page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", title: "Page headline", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "intro",
      type: "text",
      rows: 2,
      description: "The region's own events line is appended to this.",
    }),
    defineField({
      name: "bannerImage",
      title: "Banner image — top of the Events page (2400 × 1600)",
      type: "figure",
      description:
        "The full-width photograph behind the Events page heading. It fills the screen's width " +
        "and about two thirds of its height, and is cropped to whatever shape that is — on a " +
        "phone a tall slice, on a desktop a wide one. Upload 2400 × 1600 (3:2) and keep the " +
        "subject near the centre, since the edges go first.",
    }),
    defineField({
      name: "emptyState",
      title: "Message when no events match",
      type: "string",
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Events page" }) },
});
