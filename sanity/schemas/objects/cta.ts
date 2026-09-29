import { defineField, defineType } from "sanity";

/** A button: what it says and where it goes. */
export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button text",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description:
        'A path on this site such as "/join" — the region prefix is added for ' +
        'you — or a full external address such as "https://forms.gle/…", which ' +
        "opens in a new tab.",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
