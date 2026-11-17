import { defineField, defineType } from "sanity";
import { visibleField } from "../objects/blocks";

/**
 * The homepage, section by section, in the order the wireframe sets out:
 * hero carousel → join CTA → impact → how we gather → testimonials →
 * why Pinkfly exists → join + newsletter.
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
    { name: "mission", title: "Why Pinkfly exists" },
    { name: "join", title: "Join + newsletter" },
    { name: "social", title: "Social wall" },
    { name: "featured", title: "Events + articles" },
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
            defineField({
              name: "image",
              title: "Slide photograph (2400 × 1600)",
              type: "figure",
              description:
                "Sits beside the copy on a desktop and above it on a phone, in a frame of its " +
                "own — it is no longer behind the words, so nothing is written over it and no " +
                "part of it is darkened. Upload 2400 × 1600 (3:2); it is shown at 16:10 on a " +
                "phone and fills its half of the screen on a desktop, so keep the subject " +
                "near the centre.",
            }),
            defineField({
              name: "imageHasText",
              title: "This image already has its own text",
              type: "boolean",
              initialValue: false,
              description:
                "For a banner designed elsewhere — in Canva, say — with the words already in " +
                "the picture. The slide then shows the banner across the full width and draws " +
                "none of the copy below over it; only the button follows. Write the banner's " +
                "words into the image's Alt text so that a screen reader, and Google, still " +
                "read them. The headline above is still required and is used as the page's " +
                "heading, which a search engine reads and a sighted visitor does not see.",
            }),
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
      ...visibleField,
      name: "finalCtaVisible",
      title: "Show the CTA band below the hero",
      group: "hero",
    }),
    defineField({
      ...visibleField,
      name: "joinCtaVisible",
      title: "Show the join block at the foot of the page",
      group: "hero",
    }),
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
        defineField({
          name: "href",
          title: "Fallback link",
          type: "string",
          description:
            'Where the button goes. A path on this site such as "/join" — the ' +
            "region prefix is added for you — or a full external address such as " +
            '"https://forms.gle/…", which opens in a new tab.',
        }),
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

    defineField({
      name: "featuredEvents",
      title: "Events shown on the homepage",
      type: "array",
      group: "featured",
      of: [{ type: "reference", to: [{ type: "event" }] }],
      validation: (r) => r.max(3).unique(),
      description:
        "Leave this empty and the homepage shows the next three events for " +
        "the region being viewed, soonest first. Pick events here to show " +
        "those instead, in the order you put them in. One that has already " +
        "happened, or that does not run in the region being viewed, is " +
        "skipped rather than shown.",
    }),
    defineField({
      name: "featuredEntries",
      title: "Articles shown on the homepage",
      type: "array",
      group: "featured",
      of: [{ type: "reference", to: [{ type: "kbEntry" }] }],
      validation: (r) => r.max(3).unique(),
      description:
        "Leave this empty and the homepage shows the three most recently " +
        "published articles, whichever categories they come from. Pick " +
        "articles here to show those instead, in the order you put them in.",
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
