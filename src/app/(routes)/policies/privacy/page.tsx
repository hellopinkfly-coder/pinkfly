import type { Metadata } from "next";
import { PolicyPage } from "../PolicyPage";
import { policies } from "../policies";

export const metadata: Metadata = {
  title: policies.privacy.title,
  description: policies.privacy.intro,
};

export default function PrivacyPage() {
  return <PolicyPage slug="privacy" />;
}
