import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { commentSchema } from "@/lib/validations";
import { apiVersion, dataset, projectId, cmsEnabled } from "../../../../sanity/env";

/**
 * Leaving a comment.
 *
 * The write runs here rather than in the browser, because creating a document
 * in Sanity needs a token with write access and a token in a browser bundle is
 * a token anyone can take. It is read from `SANITY_API_WRITE_TOKEN`, which is
 * set in the hosting environment and never committed — with no token the route
 * says comments are closed rather than failing obscurely.
 *
 * Every comment is created unapproved. Nothing a stranger writes reaches the
 * site until someone approves it in the Studio, so the form cannot be used to
 * publish anything.
 *
 * A name and the comment is all that is asked for. An email address the site
 * has no use for is one more thing to collect, store and be responsible for.
 */
export async function POST(request: Request) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !cmsEnabled) {
    return NextResponse.json(
      { error: "Comments are not open yet. Please try again later." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { entryId, name, body: text } = parsed.data;

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });

    await client.create({
      _type: "comment",
      approved: false,
      entry: { _type: "reference", _ref: entryId },
      name,
      body: text,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[comments] could not save comment:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
