import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import type { ArticleComment } from "@/lib/cms/collections";
import { CommentForm } from "./CommentForm";

/**
 * Comments on an article: the approved ones, then the form.
 *
 * Everything here is moderated in the Studio — approving a comment publishes
 * it, writing in its Reply field answers it, deleting the document removes it.
 * The site has no moderation UI of its own on purpose: one place to look.
 */
export function Comments({
  entryId,
  comments,
}: {
  /** The article's Sanity document id. Absent for seeded articles. */
  entryId?: string;
  comments: ArticleComment[];
}) {
  // A seeded article has no document to attach a comment to, so the section
  // is not shown at all rather than shown broken.
  if (!entryId) return null;

  return (
    <Section id="comments">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="pf-h2">
            {comments.length === 0
              ? "Join the conversation"
              : `Comments (${comments.length})`}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--pf-text)]">
            {comments.length === 0
              ? "Be the first to share what this brought up for you."
              : "What other founders took from this piece."}
          </p>
        </Reveal>

        {comments.length > 0 && (
          <ul className="mt-8 flex flex-col gap-5">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-[var(--pf-radius-lg)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-bold text-[var(--pf-heading)]">{comment.name}</p>
                  <time
                    dateTime={comment.createdAt}
                    className="text-xs text-[var(--pf-muted)]"
                  >
                    {formatDate(comment.createdAt)}
                  </time>
                </div>

                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--pf-text)] sm:text-base">
                  {comment.body}
                </p>

                {comment.reply && (
                  <div className="mt-4 border-l-2 border-[var(--pf-accent)] pl-4">
                    <p className="pf-eyebrow">Pinkfly</p>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[var(--pf-text)]">
                      {comment.reply}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <CommentForm entryId={entryId} />
      </div>
    </Section>
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
