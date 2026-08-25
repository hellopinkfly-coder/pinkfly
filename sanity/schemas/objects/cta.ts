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
        'Site path such as "/join" (region prefixes are added automatically) or a full external URL.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
