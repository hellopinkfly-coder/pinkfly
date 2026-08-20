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
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "main" }),
    defineField({ name: "image", type: "figure", group: "main" }),
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
    defineField({ name: "description", title: "Paragraphs", type: "array", of: [{ type: "text" }], group: "content" }),
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
  preview: { select: { title: "title", subtitle: "startsAt", media: "image.asset" } },
});
