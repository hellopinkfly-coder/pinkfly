import type { Metadata } from "next";
import { PolicyPage } from "../PolicyPage";
import { policies } from "../policies";

export const metadata: Metadata = {
  title: policies.refund.title,
  description: policies.refund.intro,
};

export default function RefundPage() {
  return <PolicyPage slug="refund" />;
}
