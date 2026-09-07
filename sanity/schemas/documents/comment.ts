import { defineField, defineType } from "sanity";

/**
 * A comment left on an article, and the reply to it.
 *
 * Comments arrive from the public form and are created **unapproved**, so
 * nothing a stranger writes reaches the site until someone here has read it.
 * The whole of moderation is this document: tick Approved to publish it, write
 * in Reply to answer it, delete the document to remove it.
 *
 * The email address is collected so a commenter can be contacted, and is never
 * queried by the site — the public GROQ selects the name, the body, the reply
 * and the date, and nothing else.
 */
export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      initialValue: false,
      description:
        "Off until you have read it. The comment appears on the article only when this is on.",
    }),

    defineField({
      name: "entry",
      title: "Article",
      type: "reference",
      to: [{ type: "kbEntry" }],
      readOnly: true,
      description: "The article this was left on. Set by the form.",
    }),

    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
      validation: (r) => r.required().max(80),
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      description: "Never shown on the site. For contacting the commenter.",
    }),

    defineField({
      name: "body",
      title: "Comment",
      type: "text",
      rows: 5,
      readOnly: true,
      description: "What the visitor wrote. Read-only — edit your reply instead.",
      validation: (r) => r.required().max(2000),
    }),

    defineField({
      name: "reply",
      title: "Reply from Pinkfly",
      type: "text",
      rows: 4,
      description:
        "Shown beneath the comment, credited to Pinkfly. Leave empty for no reply.",
      validation: (r) => r.max(2000),
    }),

    defineField({
      name: "createdAt",
      title: "Received",
      type: "datetime",
      readOnly: true,
    }),
  ],

  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      name: "name",
      body: "body",
      approved: "approved",
      article: "entry.title",
    },
    prepare: ({ name, body, approved, article }) => ({
      title: `${approved ? "" : "● "}${name ?? "Someone"}`,
      subtitle: [article, body].filter(Boolean).join(" — ").slice(0, 120),
    }),
  },
});
