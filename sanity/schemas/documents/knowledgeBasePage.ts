import { defineField, defineType } from "sanity";

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
          ],
          preview: { select: { title: "title", subtitle: "id" } },
        },
      ],
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
