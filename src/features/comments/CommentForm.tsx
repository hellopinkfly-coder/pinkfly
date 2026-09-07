"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { commentSchema } from "@/lib/validations";

type Status = "idle" | "loading" | "success" | "error";

/**
 * The form for leaving a comment.
 *
 * A comment does not appear when it is sent: it waits to be approved in the
 * Studio. The success message says so, because a visitor who sees nothing
 * appear assumes the form is broken and writes it again.
 */
export function CommentForm({ entryId }: { entryId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = commentSchema.safeParse({ entryId, name, email, body });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error);
      setStatus("success");
      setName("");
      setEmail("");
      setBody("");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-[var(--pf-radius-lg)] border border-[var(--pf-border)] bg-[var(--pf-surface-muted)] p-5">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--pf-accent)]" aria-hidden />
        <p className="text-sm leading-relaxed text-[var(--pf-text)]">
          Thank you — your comment has been sent. It will appear here once we
          have read it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Your name"
          autoComplete="name"
          required
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Your email"
          autoComplete="email"
          required
        />
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your comment"
        aria-label="Write your comment"
        rows={4}
        required
        maxLength={2000}
        className="w-full rounded-[var(--pf-radius-lg)] border border-[var(--pf-border-strong)] bg-[var(--pf-surface)] px-4 py-3 text-base leading-relaxed text-[var(--pf-heading)] transition-colors duration-200 placeholder:text-[var(--pf-muted)] focus:border-[var(--pf-accent)] focus:outline-none"
      />

      <p className="text-xs leading-relaxed text-[var(--pf-muted)]">
        Your email is not published — it is only so we can reach you. Comments
        appear once they have been read.
      </p>

      {error && (
        <p role="alert" className="text-sm text-[var(--pf-accent)]">
          {error}
        </p>
      )}

      <div>
        <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? "Sending…" : "Post comment"}
          <Send size={16} aria-hidden />
        </Button>
      </div>
    </form>
  );
}
