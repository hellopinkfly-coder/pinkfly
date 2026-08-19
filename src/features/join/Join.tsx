"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { joinCta } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema } from "@/lib/validations";
import { regionPath, type Region } from "@/lib/region";

type Status = "idle" | "loading" | "success" | "error";

/**
 * One closing section. The old site had a "final CTA" and a newsletter block
 * back to back asking for the same thing twice — this is the merge.
 */
export function Join({ region }: { region: Region }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <Section id="join" bleed className="relative overflow-hidden">
      <GradientBackdrop />
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="pf-eyebrow">{joinCta.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{joinCta.headline}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--pf-text)]">
            {joinCta.body}
          </p>

          {status === "success" ? (
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--pf-accent-soft)] px-5 py-3 text-sm font-bold text-[var(--pf-accent-hover)]">
              <CheckCircle2 size={18} />
              {joinCta.success}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1 text-left">
                <label htmlFor="join-email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="join-email"
                  type="email"
                  autoComplete="email"
                  placeholder={joinCta.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? "join-error" : undefined}
                />
              </div>
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "…" : joinCta.cta}
                {status !== "loading" && <ArrowRight size={16} />}
              </Button>
            </form>
          )}

          {error && (
            <p
              id="join-error"
              className="mt-3 text-sm text-[var(--pf-accent-hover)]"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* The form is the low-commitment door; this is the full one. */}
          <p className="mt-6 text-sm text-[var(--pf-muted)]">
            Want the whole picture?{" "}
            <Link href={regionPath(region, "/join")} className="pf-link">
              See what membership includes
            </Link>
            .
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
