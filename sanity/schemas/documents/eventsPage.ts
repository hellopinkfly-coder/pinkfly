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
    defineField({ name: "bannerImage", title: "Banner image", type: "figure" }),
    defineField({
      name: "emptyState",
      title: "Message when no events match",
      type: "string",
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Events page" }) },
});
