/**
 * Sanity CLI configuration, used when the Studio runs standalone
 * (`npm run studio`, which invokes the CLI with this folder as its root).
 *
 * The embedded Studio at /studio does not read this file — it only needs
 * `sanity.config.ts`. Both share the same project and dataset.
 */
import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./env";

/**
 * `studioHost` is what makes `sanity deploy` non-interactive.
 *
 * Without it the CLI asks which hostname to deploy to:
 *
 *     ? Select existing studio hostname (Use arrow keys)
 *     ❯ Create new studio hostname
 *       pinkfly-cms-studio
 *
 * On a CI runner there is no terminal to answer with, so the prompt got
 * nothing, the process ended, and the step exited 0 — a green run that had
 * deployed absolutely nothing, which is worse than the red one before it.
 * Naming the host here answers the question up front.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "pinkfly-cms-studio",
});
