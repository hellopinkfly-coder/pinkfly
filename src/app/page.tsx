/**
 * Global homepage (`/`).
 *
 * Regional homepages live at `/india`, `/dubai` and `/usa` and render this
 * same component — see `src/app/[region]/page.tsx`.
 */
import { HomePage } from "@/components/pages/HomePage";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion } from "@/lib/region";
import { buildHomeMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildHomeMetadata(await getRegionContent(getRegion()));
}

export default async function Page() {
  return <HomePage region={await getRegionContent(getRegion())} />;
}
