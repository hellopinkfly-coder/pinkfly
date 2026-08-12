/**
 * Global privacy policy (`/privacy`).
 */
import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";

const region = getRegion();

export const metadata = buildMetadata({
  region,
  path: "/privacy",
  ...pageSeo.privacy,
});

export default function Page() {
  return <PrivacyPage region={region} />;
}
