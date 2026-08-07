"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof FieldErrors] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--pf-radius-xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-10 text-center shadow-[var(--pf-shadow-sm)]">
        <CheckCircle2 size={32} className="text-[var(--pf-accent)]" />
        <h3 className="text-xl">Thank you — we&apos;ll be in touch.</h3>
        <p className="text-sm text-[var(--pf-text)]">
          We read every message and reply as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Name" error={errors.name} htmlFor="contact-name">
        <Input
          id="contact-name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          autoComplete="name"
          aria-invalid={!!errors.name}
        />
      </Field>

      <Field label="Email" error={errors.email} htmlFor="contact-email">
        <Input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email"
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field label="Message" error={errors.message} htmlFor="contact-message">
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          aria-invalid={!!errors.message}
          className={cn(
            "w-full rounded-[var(--pf-radius-lg)] border border-[var(--pf-border-strong)] bg-[var(--pf-surface)] px-5 py-3.5 text-[var(--pf-heading)] placeholder:text-[var(--pf-muted)] transition-colors focus:border-[var(--pf-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--pf-accent)]/20"
          )}
          placeholder="Tell us a little about you and how we can help…"
        />
      </Field>

      {status === "error" && (
        <p className="text-sm text-[var(--pf-accent-hover)]" role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Sending…" : "Send message"}
        {status !== "loading" && <Send size={16} />}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--pf-heading)]">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-xs text-[var(--pf-accent-hover)]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
