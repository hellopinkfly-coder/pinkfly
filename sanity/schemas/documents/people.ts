import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Portrait", type: "figure" }),
    defineField({ name: "bio", type: "text", rows: 4 }),
    defineField({ name: "linkedin", type: "url" }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image.asset" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "image", title: "Portrait", type: "figure" }),
  ],
  preview: { select: { title: "name", subtitle: "company", media: "image.asset" } },
});

export const initiative = defineType({
  name: "initiative",
  title: "Initiative",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "period", type: "string", description: 'Year or range, e.g. "2024 – 2025".' }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "image", type: "figure" }),
    defineField({ name: "highlights", type: "array", of: [{ type: "string" }] }),
  ],
  preview: { select: { title: "title", subtitle: "period", media: "image.asset" } },
});

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  description: "Logos shown in the credibility strip.",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", type: "figure" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "name", media: "logo.asset" } },
});
