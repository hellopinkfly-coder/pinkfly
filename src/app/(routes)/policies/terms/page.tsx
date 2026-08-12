import type { Metadata } from "next";
import { PolicyPage } from "../PolicyPage";
import { policies } from "../policies";

export const metadata: Metadata = {
  title: policies.terms.title,
  description: policies.terms.intro,
};

export default function TermsPage() {
  return <PolicyPage slug="terms" />;
}
