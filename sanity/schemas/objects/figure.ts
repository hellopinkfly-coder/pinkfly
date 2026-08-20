import { defineField, defineType } from "sanity";

/**
 * Every image on the site.
 *
 * Two sources, one shape: an uploaded asset (what editors will use) or an
 * external URL (what the seeded stock photography still is). `resolveImage`
 * in `src/lib/cms/resolve.ts` prefers the upload, so replacing a stock URL
 * with a real photograph is a drag-and-drop in the Studio — no code change,
 * and the frame, crop and dimensions are untouched.
 */
export const figure = defineType({
  name: "figure",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Upload",
      type: "image",
      options: { hotspot: true },
      description: "Preferred. Overrides the external URL below.",
    }),
    defineField({
      name: "url",
      title: "External image URL",
      type: "url",
      description: "Used only when no image is uploaded.",
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe what is actually in the frame — this is read aloud by screen readers.",
      validation: (r) => r.required().max(180),
    }),
    defineField({
      name: "label",
      title: "Caption chip",
      type: "string",
      description: "Short label shown in the corner of the frame. Optional.",
    }),
    defineField({
      name: "focal",
      title: "Focal point",
      type: "string",
      description:
        'CSS object-position keeping the subject in frame, e.g. "50% 35%". Optional.',
    }),
  ],
  preview: {
    select: { title: "alt", subtitle: "label", media: "asset" },
  },
});
