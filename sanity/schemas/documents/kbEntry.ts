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
    /**
     * Two images, because the two places crop differently.
     *
     * The card sits in a grid where every tile is the same 4:3. The whole
     * picture is shown inside it — nothing is trimmed — so a banner uploaded
     * there lands as a letterboxed strip with blurred bands above and below
     * it. Only a 4:3 file fills the tile edge to edge. The article header
     * shows the picture whole at its own proportions, where a banner is
     * exactly right. One file cannot be right for both, so each has its own
     * field and its own stated size.
     */
    defineField({
      name: "image",
      title: "Card image — Knowledge Base grid (1200 × 900)",
      type: "figure",
      group: "main",
      description:
        "Shown on the article's card in the Knowledge Base grid, and on the homepage. " +
        "Upload 1200 × 900 (4:3) — that fills the tile edge to edge. Any other shape is " +
        "shown whole and centred, with blurred bands filling the rest of the tile, so a wide " +
        "banner here becomes a thin strip. Use the header image field below for banners.",
    }),

    defineField({
      name: "articleImage",
      title: "Header image — the article page (1600 × 900)",
      type: "figure",
      group: "main",
      description:
        "The banner at the top of the article itself. Shown whole, at its own proportions — " +
        "nothing is cropped. Upload 1600 × 900 (16:9) for a standard banner; a wider banner " +
        "such as 1600 × 600 works here too. Leave empty to use the card image here instead.",
    }),
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
      title: "Article — before the image",
      type: "richText",
      group: "body",
      description:
        "The opening of the article. Highlight text and use the link button to turn it into a link.",
    }),
    defineField({
      name: "inlineImage",
      title: "Image — between the paragraphs (1600 × 1050)",
      type: "figure",
      group: "body",
      description:
        "Landscape, 3:2. Sits between the paragraphs above and those below. Leave empty for an article with no picture in the middle.",
    }),
    defineField({
      name: "bodyAfterImage",
      title: "Article — after the image",
      type: "richText",
      group: "body",
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
