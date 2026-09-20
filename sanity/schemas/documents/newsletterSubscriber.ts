import { defineField, defineType } from "sanity";

/**
 * One newsletter subscriber, mirrored from Supabase.
 *
 * Supabase remains the list — it is what a send would read, and it holds the
 * unique constraint that stops the same address appearing twice. This is a
 * copy, kept so the list can be read, searched and exported by anyone with a
 * Studio login instead of a database seat.
 *
 * Because it is a copy, it can drift: an address added straight to Supabase,
 * or a row deleted there, is not reflected here. The Subscribers tool says as
 * much rather than implying this is the authority.
 *
 * Nothing here is published — the website never queries this type.
 */
export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      description: "As they typed it, lowercased.",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "source",
      title: "Signed up from",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Welcome popup", value: "popup" },
          { title: "Page form", value: "form" },
        ],
      },
      description: "Which form they used — worth knowing which one works.",
    }),

    defineField({
      name: "subscribedAt",
      title: "Subscribed",
      type: "datetime",
      readOnly: true,
    }),

    defineField({
      name: "welcomeEmailed",
      title: "Welcome email sent",
      type: "boolean",
      readOnly: true,
      description:
        "Off means they are on the list but no welcome email went out — " +
        "usually because Resend is not configured yet.",
    }),

    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
      description: "For your own use. Never shown anywhere.",
    }),
  ],

  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
    {
      title: "Email A–Z",
      name: "email",
      by: [{ field: "email", direction: "asc" }],
    },
  ],

  preview: {
    select: { email: "email", subscribedAt: "subscribedAt", source: "source" },
    prepare: ({ email, subscribedAt, source }) => ({
      title: email ?? "(no address)",
      subtitle: [
        subscribedAt ? new Date(subscribedAt).toLocaleDateString("en-GB") : null,
        source === "popup" ? "popup" : source === "form" ? "page form" : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
