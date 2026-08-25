import { defineField, defineType } from "sanity";

/**
 * One regional site. The global site and every regional variant render from
 * the same components; this document is the only thing that differs.
 */
export const region = defineType({
  name: "region",
  title: "Region",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "copy", title: "Copy" },
    { name: "contact", title: "Contact" },
    { name: "form", title: "Registration" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Region key",
      type: "string",
      group: "identity",
      description: 'Must match a region in the code: global, india, dubai or usa.',
      options: {
        list: [
          { title: "Global", value: "global" },
          { title: "India", value: "india" },
          { title: "Dubai (UAE)", value: "dubai" },
          { title: "United States", value: "usa" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", type: "string", group: "identity" }),
    defineField({ name: "shortName", type: "string", group: "identity" }),
    defineField({ name: "location", type: "string", group: "identity" }),

    defineField({ name: "heroEyebrow", type: "string", group: "copy" }),
    defineField({ name: "heroHeadline", type: "string", group: "copy" }),
    defineField({ name: "joinIntro", type: "text", rows: 2, group: "copy" }),
    defineField({ name: "eventsIntro", type: "text", rows: 2, group: "copy" }),

    defineField({
      name: "address",
      title: "Address lines",
      type: "array",
      of: [{ type: "string" }],
      group: "contact",
      description: "Leave empty when this region has no office.",
    }),
    defineField({ name: "phone", type: "string", group: "contact" }),
    defineField({
      name: "email",
      type: "string",
      group: "contact",
      description: "Leave empty to use the global inbox.",
    }),

    defineField({
      name: "googleFormUrl",
      title: "Registration form URL",
      type: "url",
      group: "form",
      description: "Overrides the site-wide form for this region.",
    }),
    defineField({
      name: "crmSegment",
      type: "string",
      group: "form",
      description: "Tag written to the lead record so it routes to the right team.",
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "name", subtitle: "slug" } },
});
