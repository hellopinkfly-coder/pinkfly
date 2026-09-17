import { defineField, defineType } from "sanity";

/**
 * A message left on the contact form.
 *
 * The form used to validate a message and then drop it: the visitor was told
 * it had been sent and nobody ever received it. Every message now lands here,
 * so there is a record that survives a lost email, and is emailed on as well
 * for anyone who would rather work from an inbox.
 *
 * Nothing here is published — this type is never queried by the website. It
 * is a log to read and mark off, which is what `handled` is for.
 */
export const contactMessage = defineType({
  name: "contactMessage",
  title: "Message",
  type: "document",
  fields: [
    defineField({
      name: "handled",
      title: "Dealt with",
      type: "boolean",
      initialValue: false,
      description: "Tick once it has been answered. New messages sit above.",
    }),

    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
      validation: (r) => r.required().max(120),
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      description: "Reply to this address.",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 8,
      readOnly: true,
      description: "What the visitor wrote. Read-only — it is their words.",
      validation: (r) => r.required().max(5000),
    }),

    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
      description: "For your own use. Never shown anywhere.",
    }),

    defineField({
      name: "emailed",
      title: "Email delivered",
      type: "boolean",
      readOnly: true,
      description:
        "Whether the copy sent to the inbox went out. Off means the message " +
        "is safe here but no email arrived.",
    }),

    defineField({
      name: "receivedAt",
      title: "Received",
      type: "datetime",
      readOnly: true,
    }),
  ],

  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      name: "name",
      email: "email",
      message: "message",
      handled: "handled",
    },
    prepare: ({ name, email, message, handled }) => ({
      title: `${handled ? "" : "● "}${name ?? "Someone"}`,
      subtitle: [email, message].filter(Boolean).join(" — ").slice(0, 120),
    }),
  },
});
