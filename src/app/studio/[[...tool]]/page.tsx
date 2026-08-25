/**
 * The Sanity Studio, served from this app at /studio.
 *
 * `dynamic` because the Studio is a client application that must not be
 * statically rendered, and `maxDuration` for the long-running Studio routes.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity/sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
