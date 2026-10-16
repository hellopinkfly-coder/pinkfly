import { defineField, defineType } from "sanity";
import { visibleField } from "../objects/blocks";

export const knowledgeBasePage = defineType({
  name: "knowledgeBasePage",
  title: "Knowledge Base page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", title: "Page headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "categories",
      title: "Category rails",
      type: "array",
      description:
        "The rails on this page and their headings. The category key must match the code: articles, business-news or government-policies.",
      of: [
        {
          type: "object",
          name: "kbCategoryRail",
          fields: [
            defineField({
              name: "id",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Recent articles", value: "articles" },
                  { title: "Business news", value: "business-news" },
                  { title: "Government policies", value: "government-policies" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({
              name: "hidden",
              title: "Hide this rail",
              type: "boolean",
              initialValue: false,
              description:
                "Takes the rail off the page without deleting it or its articles.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "id", hidden: "hidden" },
            prepare: ({ title, subtitle, hidden }) => ({
              title: hidden ? `${title} — hidden` : title,
              subtitle,
            }),
          },
        },
      ],
    }),
    defineField({
      ...visibleField,
      name: "searchVisible",
      title: "Show the search and filters",
      description:
        "The search box and the category and sort controls above the rails. "
        + "Off, the page is the rails alone.",
    }),
    defineField({
      ...visibleField,
      name: "railsVisible",
      title: "Show the category rails",
      description:
        "Every rail at once. To take a single one down, use its own "
        + "\u201cHide this rail\u201d switch above.",
    }),
    defineField({
      ...visibleField,
      name: "finalCtaVisible",
      title: "Show the closing invitation",
      description: "The join band at the foot of the page.",
    }),
    defineField({
      name: "commentsClosedMessage",
      title: "Message shown where comments are closed",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Knowledge Base page" }) },
});
