import { defineField, defineType } from "sanity";
import { visibleField } from "../objects/blocks";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups: [
    { name: "hero", title: "Header", default: true },
    { name: "mission", title: "Why Pink Fly exists" },
    { name: "banner", title: "Banner" },
    { name: "founder", title: "Founder story" },
    { name: "guidelines", title: "Community guidelines" },
    { name: "initiatives", title: "Initiatives" },
    { name: "team", title: "Executive team" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", type: "string", group: "hero" }),
    defineField({ name: "title", title: "Page headline", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 3, group: "hero" }),

    defineField({ name: "missionHeading", title: "Heading", type: "sectionHeading", group: "mission" }),
    defineField({ name: "missionBody", title: "Paragraphs", type: "array", of: [{ type: "text" }], group: "mission" }),
    defineField({ name: "missionCta", title: "Button", type: "cta", group: "mission" }),
    defineField({ ...visibleField, name: "missionVisible", group: "mission" }),

    defineField({ name: "bannerImage", title: "Banner image", type: "figure", group: "banner" }),
    defineField({ ...visibleField, name: "bannerVisible", group: "banner" }),

    defineField({
      name: "founder",
      title: "Founder story",
      type: "object",
      group: "founder",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "name", type: "string" }),
        defineField({ name: "role", type: "string" }),
        defineField({ name: "image", type: "figure" }),
        defineField({ name: "body", title: "Paragraphs", type: "array", of: [{ type: "text" }] }),
      ],
    }),
    defineField({ ...visibleField, name: "founderVisible", group: "founder" }),

    defineField({ name: "guidelinesHeading", title: "Heading", type: "sectionHeading", group: "guidelines" }),
    defineField({ name: "guidelinesImage", title: "Image", type: "figure", group: "guidelines" }),
    defineField({
      name: "guidelines",
      title: "Guidelines",
      type: "array",
      of: [{ type: "titledItem" }],
      group: "guidelines",
    }),
    defineField({ ...visibleField, name: "guidelinesVisible", group: "guidelines" }),

    defineField({ name: "initiativesHeading", title: "Heading", type: "sectionHeading", group: "initiatives" }),
    defineField({
      name: "initiatives",
      type: "array",
      of: [{ type: "reference", to: [{ type: "initiative" }] }],
      group: "initiatives",
    }),
    defineField({
      ...visibleField,
      name: "initiativesVisible",
      group: "initiatives",
      initialValue: false,
      description: "Off until real initiative content replaces the placeholders.",
    }),

    defineField({ name: "teamHeading", title: "Heading", type: "sectionHeading", group: "team" }),
    defineField({
      name: "team",
      title: "Team members",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
      group: "team",
    }),
    defineField({ ...visibleField, name: "teamVisible", group: "team" }),

    defineField({ name: "contactHeading", title: "Heading", type: "sectionHeading", group: "contact" }),
    defineField({
      name: "contactForm",
      title: "Form copy",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "submit", title: "Submit button", type: "string" }),
        defineField({ name: "successTitle", type: "string" }),
        defineField({ name: "successBody", type: "text", rows: 3 }),
      ],
    }),
    defineField({ ...visibleField, name: "contactVisible", group: "contact" }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
