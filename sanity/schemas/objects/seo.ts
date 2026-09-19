import { defineField, defineType } from "sanity";

/** Per-page search and social metadata. */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Meta title", type: "string" }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Social share image (1200 × 630)",
      type: "figure",
      description:
        "What WhatsApp, LinkedIn and X show when this page is shared. Anything " +
        "other than 1200 × 630 is cropped to it.",
    }),
  ],
});
