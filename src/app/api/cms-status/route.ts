import { NextResponse } from "next/server";
import { dataset, projectId, cmsEnabled } from "../../../../sanity/env";
import { cmsFetch } from "@/lib/cms/fetch";

/**
 * What this deployment is actually reading from.
 *
 * The dataset can be healthy while a deployment still shows nothing, because
 * the deployment may be pointed at a different project or dataset by its own
 * environment variables. Nothing else on the site reports which one it got,
 * so this does.
 *
 * Everything here is already public: the project id and dataset name ship in
 * the client bundle of any Sanity site, and no token is used or exposed.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const { live, data } = await cmsFetch<{
    kbEntries: number;
    events: number;
    kbCategories: string[] | null;
  }>(`{
    "kbEntries": count(*[_type == "kbEntry"]),
    "events": count(*[_type == "event"]),
    "kbCategories": *[_type == "knowledgeBasePage"][0].categories[].id
  }`);

  return NextResponse.json({
    projectId,
    dataset,
    cmsEnabled,
    // false means Sanity could not be reached and the site is on seed content.
    live,
    counts: data ?? null,
  });
}
