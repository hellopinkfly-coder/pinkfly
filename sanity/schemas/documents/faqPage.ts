import { defineField, defineType } from "sanity";

/**
 * The dedicated FAQs page.
 *
 * Separate from the handful of questions on Join Community: that set answers
 * "should I sign up", this one is the whole reference, grouped by subject so
 * a reader can go straight to the part that concerns them. The Join page's
 * own list stays where it is — the two are edited independently, and a
 * question can honestly appear in both.
 */
export const faqPage = defineType({
  name: "faqPage",
  title: "FAQs",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "faqs", title: "Questions" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", type: "string", group: "hero" }),
    defineField({ name: "title", type: "string", group: "hero" }),
    defineField({ name: "intro", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "groups",
      title: "Sections",
      type: "array",
      group: "faqs",
      description:
        "Each section becomes a heading on the page and a shortcut at the " +
        "top. Order here is the order on the page.",
      of: [
        {
          type: "object",
          name: "faqGroup",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "intro",
              type: "string",
              description: "One line under the section heading. Optional.",
            }),
            defineField({
              name: "items",
              title: "Questions",
              type: "array",
              of: [{ type: "faqItem" }],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare: ({ title, items }) => ({
              title: title ?? "Section",
              subtitle: `${items?.length ?? 0} question${items?.length === 1 ? "" : "s"}`,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "contactNote",
      title: "Closing line",
      type: "string",
      group: "faqs",
      description:
        "Shown under the last section, for anyone whose question is not here.",
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "FAQs" }) },
});
