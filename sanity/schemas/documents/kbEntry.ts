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
    defineField({
      name: "hidden",
      title: "Hide from the website",
      type: "boolean",
      group: "main",
      initialValue: false,
      description:
        "Keeps the entry here but takes it off the site — it disappears from its category rail and its page stops resolving. Uncheck to put it back.",
    }),
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

    /*
     * The article reads in the order these fields appear: the opening
     * paragraphs, then the image, then the paragraphs after it, then any video
     * and downloads. Separate fields rather than one mixed list, because
     * Sanity cannot mix plain text with objects in a single array — the
     * attempt to do so left the editor unable to add anything at all.
     */
    defineField({
      name: "body",
      title: "Paragraphs — before the image",
      type: "array",
      group: "body",
      of: [{ type: "text" }],
      description: "The opening of the article. One paragraph per item.",
    }),
    defineField({
      name: "inlineImage",
      title: "Image — between the paragraphs",
      type: "figure",
      group: "body",
      description:
        "Sits between the paragraphs above and those below. Leave empty for an article with no picture in the middle.",
    }),
    defineField({
      name: "bodyAfterImage",
      title: "Paragraphs — after the image",
      type: "array",
      group: "body",
      of: [{ type: "text" }],
      description: "The rest of the article, below the image.",
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "videoEmbed",
      group: "body",
      description: "Plays below the article. Leave empty for no video.",
    }),
    defineField({
      name: "attachments",
      title: "Files to download",
      type: "array",
      group: "body",
      of: [{ type: "fileAttachment" }],
      description: "PDFs or other documents, offered at the end of the article.",
    }),

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
  preview: {
    select: { title: "title", subtitle: "category", media: "image.asset", hidden: "hidden" },
    prepare: ({ title, subtitle, media, hidden }) => ({
      title: hidden ? `${title} — hidden` : title,
      subtitle,
      media,
    }),
  },
});
