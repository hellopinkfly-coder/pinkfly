/**
 * Sanity CLI configuration, used when the Studio runs standalone
 * (`npm run studio`, which invokes the CLI with this folder as its root).
 *
 * The embedded Studio at /studio does not read this file — it only needs
 * `sanity.config.ts`. Both share the same project and dataset.
 */
import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./env";

export default defineCliConfig({
  api: { projectId, dataset },
});
