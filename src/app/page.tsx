/**
 * Global homepage (`/`).
 *
 * Regional homepages live at `/india`, `/dubai` and `/usa` and render this
 * same component — see `src/app/[region]/page.tsx`.
 */
import { HomePage } from "@/components/pages/HomePage";
import { getRegion } from "@/lib/region";
import { buildHomeMetadata } from "@/lib/seo";

const region = getRegion();

export const metadata = buildHomeMetadata(region);

export default function Page() {
  return <HomePage region={region} />;
}
