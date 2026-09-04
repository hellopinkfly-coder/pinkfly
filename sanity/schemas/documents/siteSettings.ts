import { defineField, defineType } from "sanity";

/**
 * Everything true of Pinkfly globally: identity, contact, navigation,
 * social links and the registration form destination. Region-specific
 * details live on the `region` documents instead.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "navigation", title: "Navigation" },
    { name: "integrations", title: "Integrations" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "identity", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", group: "identity" }),
    defineField({ name: "description", type: "text", rows: 3, group: "identity" }),
    defineField({ name: "parent", title: "Parent company", type: "string", group: "identity" }),
    defineField({ name: "parentUrl", title: "Parent company URL", type: "url", group: "identity" }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "figure",
      group: "identity",
      description:
        "Optional. Leave empty to keep the type-set Pinkfly wordmark.",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default social share image",
      type: "figure",
      group: "identity",
    }),
    defineField({
      name: "placeholderImage",
      title: "Placeholder image",
      type: "figure",
      group: "identity",
      description:
        "Stands in wherever an article, event, card or team member has no image of its own. Change it here and it changes everywhere.",
    }),

    defineField({ name: "contactEmail", type: "string", group: "contact" }),
    defineField({
      name: "address",
      title: "Address lines",
      type: "array",
      of: [{ type: "string" }],
      group: "contact",
    }),
    defineField({ name: "phone", type: "string", group: "contact" }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "instagram", type: "url" }),
        defineField({ name: "youtube", type: "url" }),
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "twitter", title: "X / Twitter", type: "url" }),
      ],
    }),

    defineField({
      name: "mainNav",
      title: "Main navigation",
      type: "array",
      of: [{ type: "navLink" }],
      group: "navigation",
    }),
    defineField({
      name: "knowledgeBaseNav",
      title: "Knowledge Base navigation",
      type: "array",
      of: [{ type: "navLink" }],
      group: "navigation",
    }),
    defineField({
      name: "footerCommunity",
      title: "Footer — Community column",
      type: "object",
      group: "navigation",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "links", type: "array", of: [{ type: "navLink" }] }),
      ],
    }),
    defineField({
      name: "footerCompany",
      title: "Footer — Company column",
      type: "object",
      group: "navigation",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "links", type: "array", of: [{ type: "navLink" }] }),
      ],
    }),
    defineField({
      name: "navCta",
      title: "Header button",
      type: "object",
      group: "navigation",
      description: "The button in the site header.",
      fields: [
        defineField({ name: "label", title: "Button text", type: "string" }),
        defineField({
          name: "knowledgeLabel",
          title: "Button text on Knowledge Base pages",
          type: "string",
        }),
        defineField({ name: "href", title: "Link", type: "string" }),
      ],
    }),
    defineField({
      name: "policyNav",
      title: "Footer — legal links",
      type: "array",
      of: [{ type: "navLink" }],
      group: "navigation",
    }),

    defineField({
      name: "joinFormUrl",
      title: "Registration form URL",
      type: "url",
      group: "integrations",
      description:
        "The Google Form every Register CTA opens. A region may override this on its own document. Leave empty and the site says registration opens shortly rather than showing a dead button.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
