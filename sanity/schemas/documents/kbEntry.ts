import { defineField, defineType } from "sanity";

/** A Knowledge Base entry: article, business news item or policy summary. */
export const kbEntry = defineType({
  name: "kbEntry",
  title: "Knowledge Base entry",
  type: "document",
  groups: [
    { name: "main", title: "Entry", default: true },
    { name: "body", title: "Body" },
    { name: "extra", title: "Category extras" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Recent articles", value: "articles" },
          { title: "Business news", value: "business-news" },
          { title: "Government policies", value: "government-policies" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "main" }),
    defineField({ name: "image", type: "figure", group: "main" }),
    defineField({ name: "tag", title: "Card label", type: "string", group: "main" }),
    defineField({
      name: "author",
      type: "object",
      group: "main",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "role", type: "string" }),
      ],
    }),
    defineField({ name: "publishedAt", type: "date", group: "main", validation: (r) => r.required() }),
    defineField({ name: "readingTime", type: "string", group: "main" }),

    defineField({ name: "body", title: "Paragraphs", type: "array", of: [{ type: "text" }], group: "body" }),

    defineField({
      name: "source",
      title: "Source (business news)",
      type: "object",
      group: "extra",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "url", type: "url" }),
      ],
    }),
    defineField({
      name: "policy",
      title: "Policy at a glance (government policies)",
      type: "object",
      group: "extra",
      fields: [
        defineField({ name: "authority", type: "string" }),
        defineField({
          name: "status",
          type: "string",
          options: { list: ["Active", "Announced", "In consultation"] },
        }),
        defineField({ name: "effectiveFrom", type: "string" }),
        defineField({ name: "appliesTo", type: "string" }),
        defineField({ name: "keyPoints", type: "array", of: [{ type: "string" }] }),
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "category", media: "image.asset" } },
});
