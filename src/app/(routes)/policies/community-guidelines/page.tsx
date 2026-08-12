import type { Metadata } from "next";
import { PolicyPage } from "../PolicyPage";
import { policies } from "../policies";

export const metadata: Metadata = {
  title: policies["community-guidelines"].title,
  description: policies["community-guidelines"].intro,
};

export default function CommunityGuidelinesPage() {
  return <PolicyPage slug="community-guidelines" />;
}
