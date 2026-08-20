import { defineField, defineType } from "sanity";

/** Terms, Refund, Privacy and Community Guidelines. */
export const policyPage = defineType({
  name: "policyPage",
  title: "Policy page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Page key",
      type: "string",
      options: {
        list: [
          { title: "Terms & Conditions", value: "terms" },
          { title: "Refund Policy", value: "refund" },
          { title: "Privacy Policy", value: "privacy" },
          { title: "Community Guidelines", value: "community-guidelines" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "policySection",
          fields: [
            defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 5, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "heading", subtitle: "body" } },
        },
      ],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug" } },
});
