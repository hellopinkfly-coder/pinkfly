import { defineField, defineType } from "sanity";
import { visibleField } from "../objects/blocks";

export const joinPage = defineType({
  name: "joinPage",
  title: "Join Community page",
  type: "document",
  groups: [
    { name: "hero", title: "Header", default: true },
    { name: "whyJoin", title: "Why join us" },
    { name: "editorial", title: "Editorial block" },
    { name: "cta", title: "Register" },
    { name: "faqs", title: "FAQs" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", type: "string", group: "hero" }),
    defineField({ name: "title", title: "Page headline", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({
      name: "intro",
      type: "text",
      rows: 2,
      group: "hero",
      description: "The region's own join line is appended to this.",
    }),
    defineField({ name: "bannerImage", title: "Banner image", type: "figure", group: "hero" }),

    defineField({ name: "whyJoinHeading", title: "Heading", type: "sectionHeading", group: "whyJoin" }),
    defineField({
      name: "benefits",
      type: "array",
      of: [{ type: "titledItem" }],
      group: "whyJoin",
    }),
    defineField({ ...visibleField, name: "whyJoinVisible", group: "whyJoin" }),

    defineField({
      name: "editorial",
      title: "Editorial block",
      type: "object",
      group: "editorial",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headline", type: "string" }),
        defineField({ name: "body", title: "Paragraphs", type: "array", of: [{ type: "text" }] }),
      ],
    }),
    defineField({ ...visibleField, name: "editorialVisible", group: "editorial" }),

    defineField({
      name: "cta",
      title: "Register",
      type: "object",
      group: "cta",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headline", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({ name: "formLabel", title: "Button text", type: "string" }),
        defineField({ name: "formNote", title: "Text beside the button", type: "string" }),
        defineField({
          name: "pending",
          title: "Message when no form is configured",
          type: "string",
          description: "Shown instead of a button with nowhere to go.",
        }),
        defineField({
          name: "steps",
          title: "What happens next",
          type: "array",
          of: [{ type: "string" }],
        }),
      ],
    }),

    defineField({
      name: "faqs",
      type: "array",
      of: [{ type: "faqItem" }],
      group: "faqs",
    }),
    defineField({ ...visibleField, name: "faqsVisible", group: "faqs" }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Join Community page" }) },
});
