"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

/**
 * The Studio configuration — schema, desk structure and Vision.
 *
 * It is used two ways, from this one file:
 *   • embedded, mounted at /studio by `src/app/studio/[[...tool]]/page.tsx`,
 *     so editors need no separate deployment;
 *   • standalone, via `npm run studio`, which runs the Sanity CLI with this
 *     folder as its root (see `sanity.cli.ts` beside this file).
 *
 * `projectId` and `dataset` come from `./env`, which reads them from the
 * environment. No token is ever referenced here — the Studio authenticates
 * the logged-in user through Sanity itself.
 */
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
