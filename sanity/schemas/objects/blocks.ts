import { defineField, defineType } from "sanity";

/**
 * The repeated building blocks that appear across several pages. Each one is
 * a reusable object so the same editing experience shows up wherever the
 * block does, rather than a page-specific field for every occurrence.
 */

/** Title + description pair. Used by guidelines, benefits and card grids. */
export const titledItem = defineType({
  name: "titledItem",
  title: "Item",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "icon", type: "iconPicker" }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

/** Icon + short line. Hero proof points. */
export const iconPoint = defineType({
  name: "iconPoint",
  title: "Point",
  type: "object",
  fields: [
    defineField({ name: "icon", type: "iconPicker", validation: (r) => r.required() }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "icon" } },
});

/** One counted figure in the Impact band. */
export const statItem = defineType({
  name: "statItem",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({ name: "icon", type: "iconPicker", validation: (r) => r.required() }),
    defineField({
      name: "value",
      title: "Number",
      type: "number",
      description: "Counted up when the row scrolls into view.",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "suffix",
      type: "string",
      description: 'Shown straight after the number, e.g. "+".',
    }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});

/** A question and its answer. */
export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

/** An image card with its own copy. "How we gather". */
export const imageCard = defineType({
  name: "imageCard",
  title: "Card",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "image", type: "figure", validation: (r) => r.required() }),
    defineField({
      name: "shape",
      title: "Frame shape",
      type: "string",
      description: "The organic frame this card's photograph sits in.",
      options: {
        list: [
          { title: "Arch", value: "arch" },
          { title: "Blob", value: "blob" },
          { title: "Leaf", value: "leaf" },
          { title: "Rectangle", value: "rect" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "rect",
    }),
    defineField({ name: "cta", type: "cta", title: "Call to action (optional)" }),
  ],
  preview: { select: { title: "title", subtitle: "description", media: "image.asset" } },
});

/** Heading block shared by most sections. */
export const sectionHeading = defineType({
  name: "sectionHeading",
  title: "Heading",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow text", type: "string" }),
    defineField({ name: "headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "Supporting text", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "headline", subtitle: "eyebrow" } },
});

/** The visibility switch every major section carries. */
export const visibleField = defineField({
  name: "visible",
  title: "Show this section",
  type: "boolean",
  description: "Turn a section off without deleting its content.",
  initialValue: true,
});
