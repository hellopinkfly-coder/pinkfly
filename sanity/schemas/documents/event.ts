import { defineField, defineType } from "sanity";

/** One event. Powers the events list, its filters and the detail page. */
export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    { name: "main", title: "Details", default: true },
    { name: "when", title: "When & where" },
    { name: "content", title: "Content" },
  ],
  fields: [
    defineField({
      name: "hidden",
      title: "Hide from the website",
      type: "boolean",
      group: "main",
      initialValue: false,
      description:
        "Keeps the event here but takes it off the site — it disappears from the events list and its page stops resolving. Uncheck to put it back.",
    }),
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "main" }),
    /**
     * As with articles: the listing card crops to a fixed shape, the event's
     * own page shows the picture whole, so each gets its own file.
     */
    defineField({
      name: "image",
      title: "Card image — Events listing (1600 × 1000)",
      type: "figure",
      group: "main",
      description:
        "Shown on the event's card in the Events listing. Upload 1600 × 1000 (16:10). The card " +
        "fills this shape and trims anything outside it, so keep the subject centred and keep " +
        "text out of the picture.",
    }),

    defineField({
      name: "detailImage",
      title: "Header image — the event page (1600 × 900)",
      type: "figure",
      group: "main",
      description:
        "The banner at the top of the event's own page. Shown whole, at its own proportions — " +
        "nothing is cropped. Upload 1600 × 900 (16:9), or any shape you prefer at about 1600px " +
        "wide. Leave empty to use the card image here too.",
    }),
    defineField({
      name: "regions",
      title: "Show in regions",
      type: "array",
      group: "main",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Global", value: "global" },
          { title: "India", value: "india" },
          { title: "Dubai (UAE)", value: "dubai" },
          { title: "United States", value: "usa" },
        ],
      },
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "type",
      type: "string",
      group: "main",
      options: {
        list: ["Meetup", "Webinar", "Masterclass", "Coffee Chat", "Launch"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "registrationUrl",
      title: "Registration link",
      type: "url",
      group: "main",
      description: "Leave empty to send people to the Join Community page.",
    }),

    defineField({ name: "startsAt", title: "Starts at (UTC)", type: "datetime", group: "when", validation: (r) => r.required() }),
    defineField({ name: "durationMinutes", type: "number", group: "when" }),
    defineField({
      name: "format",
      type: "string",
      group: "when",
      options: { list: ["In person", "Online"], layout: "radio" },
    }),
    defineField({ name: "city", type: "string", group: "when" }),
    defineField({ name: "venue", type: "string", group: "when", description: "Leave empty until confirmed." }),
    defineField({
      name: "price",
      type: "number",
      group: "when",
      description: "In the region's currency. 0 is free. Leave empty for TBC.",
    }),

    defineField({ name: "whoShouldJoin", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "whyJoin", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({
      name: "description",
      title: "About this event",
      type: "richText",
      group: "content",
      description:
        "Highlight text and use the link button to turn it into a link.",
    }),
    defineField({
      name: "speakers",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          name: "speaker",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "designation", type: "string" }),
            defineField({ name: "image", type: "figure" }),
          ],
          preview: { select: { title: "name", subtitle: "designation", media: "image.asset" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "startsAt", media: "image.asset", hidden: "hidden" },
    prepare: ({ title, subtitle, media, hidden }) => ({
      title: hidden ? `${title} — hidden` : title,
      subtitle,
      media,
    }),
  },
});
