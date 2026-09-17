import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./sanity/env";

/**
 * Configuration for the Sanity CLI — `sanity deploy` in particular.
 *
 * The Studio the team edits in lives at /studio on the website and updates
 * with every deploy. Sanity also hosts a copy of the Studio on its own
 * servers, and that copy only changes when `sanity deploy` is run: ours had
 * been left behind at an older schema, showing fields that no longer exist
 * and missing the ones that do.
 *
 * The workflow in .github/workflows/deploy-studio.yml runs that command on
 * every push to main, so the hosted Studio stops drifting. It needs a token
 * with permission to deploy, as the SANITY_AUTH_TOKEN repository secret.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  // Which hosted Studio to upload to. Without it the command asks
  // interactively, which a CI runner cannot answer: the first attempt sat at
  // the prompt and uploaded nothing while reporting success. This names the
  // Studio that already exists, so a deploy replaces it rather than creating
  // a second one beside it.
  studioHost: "pinkfly-cms-studio",
  autoUpdates: true,
});
