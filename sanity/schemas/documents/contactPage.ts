import { defineField, defineType } from "sanity";

/**
 * The Contact page.
 *
 * Its own document, not a section of About: one page says who Pinkfly is,
 * the other says how to reach it. The address, phone and inbox are not here —
 * they belong to each region and are edited under Regions, so switching
 * region on the site changes them.
 */
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "body", title: "Page" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", type: "string", group: "hero" }),
    defineField({ name: "title", type: "string", group: "hero" }),
    defineField({ name: "intro", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "heading",
      title: "Above the form",
      type: "sectionHeading",
      group: "body",
    }),
    defineField({
      name: "responseNote",
      title: "Reply time",
      type: "string",
      group: "body",
      description:
        "Sets expectations before someone writes, e.g. \"We reply within two working days.\" Leave empty to show nothing.",
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact" }) },
});
