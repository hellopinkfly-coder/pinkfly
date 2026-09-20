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
    { name: "popup", title: "Newsletter popup" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "identity", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", group: "identity" }),
    defineField({ name: "description", type: "text", rows: 3, group: "identity" }),
    defineField({ name: "parent", title: "Parent company", type: "string", group: "identity" }),
    defineField({ name: "parentUrl", title: "Parent company URL", type: "url", group: "identity" }),
    defineField({
      name: "logo",
      title: "Logo — for the light theme (about 1400 × 400)",
      type: "figure",
      group: "identity",
      description:
        "Shown in the header and the footer. Upload a transparent PNG about " +
        "1400px wide. If the file has empty space around the lockup, open " +
        "Crop and drag the box tight to the artwork — the page takes its " +
        "proportions from the crop, so an uncropped square canvas would be " +
        "drawn as a square. Leave empty to keep the logo shipped with the site.",
    }),

    defineField({
      name: "logoDark",
      title: "Logo — for the dark theme (about 1400 × 400)",
      type: "figure",
      group: "identity",
      description:
        "The same lockup with its neutrals lightened, for the dark theme. " +
        "Leave empty to use the light-theme logo on both.",
    }),
    defineField({
      name: "logoHeight",
      title: "Logo height in the header (pixels)",
      type: "number",
      group: "identity",
      initialValue: 48,
      description:
        "48 by default. A file with empty space around the lockup draws the " +
        "artwork smaller than this, because the height is the file's, not the " +
        "lockup's — raise it until the logo looks right, or crop the upload " +
        "tight to the artwork above. The footer and the phone header follow " +
        "this proportionally.",
      validation: (r) => r.min(24).max(96),
    }),

    defineField({
      name: "defaultOgImage",
      title: "Default social share image (1200 × 630)",
      type: "figure",
      group: "identity",
      description:
        "What WhatsApp, LinkedIn and X show when a link to the site is shared, " +
        "for any page without one of its own. Anything other than 1200 × 630 " +
        "is cropped to it.",
    }),
    defineField({
      name: "placeholderImage",
      title: "Placeholder image (1600 × 1200)",
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

    defineField({
      name: "newsletterPopup",
      title: "Newsletter popup",
      type: "object",
      group: "popup",
      description:
        "The invitation that appears a few seconds after someone arrives. " +
        "It is shown on every visit, except to people who have already " +
        "subscribed, and never on the Join page.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "enabled",
          title: "Show the popup",
          type: "boolean",
          initialValue: true,
          description: "Turn this off and it never appears, on any page.",
        }),
        defineField({
          name: "delaySeconds",
          title: "Appears after (seconds)",
          type: "number",
          initialValue: 3,
          description:
            "How long after someone arrives. Below about two seconds it " +
            "lands before the page has drawn and reads as an advert.",
          validation: (r) => r.min(0).max(60),
        }),
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headline", type: "string" }),
        defineField({
          name: "body",
          type: "text",
          rows: 3,
          description: "What they get. One or two sentences.",
        }),
        defineField({
          name: "placeholder",
          title: "Email field placeholder",
          type: "string",
        }),
        defineField({ name: "cta", title: "Button label", type: "string" }),
        defineField({
          name: "joinPrompt",
          title: "Join line",
          type: "string",
          description:
            'The sentence offering membership, e.g. "Ready for the whole thing?"',
        }),
        defineField({ name: "joinLabel", title: "Join link text", type: "string" }),
        defineField({
          name: "joinNote",
          title: "Join note",
          type: "string",
          description: 'The grey text after the link, e.g. "takes about a minute".',
        }),
        defineField({
          name: "successTitle",
          title: "After subscribing — heading",
          type: "string",
        }),
        defineField({
          name: "successBody",
          title: "After subscribing — message",
          type: "text",
          rows: 2,
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
