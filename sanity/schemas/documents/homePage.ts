import { defineField, defineType } from "sanity";
import { visibleField } from "../objects/blocks";

/**
 * The homepage, section by section, in the order the wireframe sets out:
 * hero carousel → join CTA → impact → how we gather → testimonials →
 * why Pink Fly exists → join + newsletter.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "impact", title: "Impact" },
    { name: "community", title: "How we gather" },
    { name: "testimonials", title: "Testimonials" },
    { name: "mission", title: "Why Pink Fly exists" },
    { name: "join", title: "Join + newsletter" },
    { name: "social", title: "Social wall" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroSlides",
      title: "Hero carousel",
      type: "array",
      group: "hero",
      description:
        "Each slide carries its own copy, two proof points, a button and a photograph. The carousel advances automatically and can be driven by hand.",
      of: [
        {
          type: "object",
          name: "heroSlide",
          fields: [
            defineField({ name: "eyebrow", type: "string" }),
            defineField({ name: "headline", type: "string", validation: (r) => r.required() }),
            defineField({ name: "subhead", type: "text", rows: 3 }),
            defineField({
              name: "points",
              title: "Proof points",
              type: "array",
              of: [{ type: "iconPoint" }],
              description: "Two reads best. More than two and the panel stops scanning.",
              validation: (r) => r.max(3),
            }),
            defineField({ name: "cta", type: "cta" }),
            defineField({ name: "image", type: "figure" }),
          ],
          preview: { select: { title: "headline", subtitle: "eyebrow", media: "image.asset" } },
        },
      ],
    }),

    defineField({ name: "impactHeading", title: "Heading", type: "sectionHeading", group: "impact" }),
    defineField({
      name: "impactStats",
      title: "Figures",
      type: "array",
      of: [{ type: "statItem" }],
      group: "impact",
    }),
    defineField({ ...visibleField, name: "impactVisible", group: "impact" }),

    defineField({ name: "communityHeading", title: "Heading", type: "sectionHeading", group: "community" }),
    defineField({
      name: "communityCards",
      title: "Cards",
      type: "array",
      of: [{ type: "imageCard" }],
      group: "community",
      description: "Add a card here and it appears on the site using the existing card design.",
    }),
    defineField({ ...visibleField, name: "communityVisible", group: "community" }),

    defineField({ name: "testimonialsHeading", title: "Heading", type: "sectionHeading", group: "testimonials" }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
      group: "testimonials",
    }),
    defineField({
      ...visibleField,
      name: "testimonialsVisible",
      group: "testimonials",
      initialValue: false,
      description: "Off until real founder stories replace the placeholders.",
    }),

    defineField({ name: "missionHeading", title: "Heading", type: "sectionHeading", group: "mission" }),
    defineField({
      name: "missionBody",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      group: "mission",
    }),
    defineField({ name: "missionCta", title: "Button", type: "cta", group: "mission" }),
    defineField({ ...visibleField, name: "missionVisible", group: "mission" }),

    defineField({
      name: "finalCta",
      title: "Your seat is waiting",
      type: "object",
      group: "join",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headline", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "formLabel",
          title: "Button text (form configured)",
          type: "string",
        }),
        defineField({
          name: "label",
          title: "Button text (no form yet)",
          type: "string",
        }),
        defineField({ name: "href", title: "Fallback link", type: "string" }),
        defineField({ name: "note", title: "Supporting text", type: "string" }),
      ],
    }),
    defineField({
      name: "joinCta",
      title: "Join + newsletter",
      type: "object",
      group: "join",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headline", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "placeholder", title: "Email field placeholder", type: "string" }),
        defineField({ name: "cta", title: "Button text", type: "string" }),
        defineField({ name: "success", title: "Success message", type: "string" }),
      ],
    }),

    defineField({
      name: "socialHeading",
      title: "Heading",
      type: "sectionHeading",
      group: "social",
    }),
    defineField({
      name: "socialPosts",
      title: "Posts",
      type: "array",
      of: [{ type: "socialPost" }],
      group: "social",
      description:
        "Paste the link to a post and it appears here, opening that post when clicked. Newest first — the order in this list is the order on the page.",
    }),
    defineField({
      ...visibleField,
      name: "socialVisible",
      group: "social",
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
