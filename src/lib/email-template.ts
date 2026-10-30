import { siteConfig } from "@/config/site";

/**
 * The shape every Pinkfly email arrives in.
 *
 * Three emails go out — a newsletter welcome, the note that reaches the
 * inbox when someone writes in, and the reply that goes back to them — and
 * until now all three were plain text. Plain text is honest and it always
 * renders, but an email is the first thing a new member sees after the site,
 * and three unformatted paragraphs are not what the site promised.
 *
 * What an email client will honour is narrower than a web page: no external
 * stylesheet, no custom font (the one in the mail is whatever the device has,
 * so the stack ends at `monospace` to keep the site's voice where it can),
 * no flexbox or grid worth relying on, and widths that have to survive
 * Outlook. So this is tables and inline styles on purpose — the one place in
 * this codebase where that is the right answer rather than a shortcut.
 *
 * Every message still carries its plain-text version, which is what a text
 * client, a screen reader in text mode and a spam filter all read.
 */

const ACCENT = "#d8037d";
const INK = "#2e2a28";
const BODY = "#4a4340";
const PAPER = "#fdf9f7";
const CARD = "#ffffff";
const RULE = "#ece4df";

const FONT =
  "'SF Mono', 'Space Mono', Menlo, Consolas, 'Liberation Mono', monospace";

export type EmailButton = { label: string; href: string };

export type EmailContent = {
  /** The line above the headline, in the brand's small caps. */
  eyebrow?: string;
  headline: string;
  /** Each string is a paragraph. */
  paragraphs: string[];
  button?: EmailButton;
  /** Label / value rows, drawn as a bordered block — used by the contact note. */
  details?: { label: string; value: string }[];
  /** The small print under the rule. */
  footnote?: string;
};

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Keeps the line breaks someone typed into a textarea. */
function withBreaks(value: string): string {
  return escape(value).replace(/\r?\n/g, "<br />");
}

/**
 * The wordmark, set rather than pictured.
 *
 * An image would be the obvious way to put the logo at the top, and the
 * obvious way to have it blocked: most clients hide remote images until the
 * reader asks for them, so the masthead would be missing exactly once — the
 * first time anyone sees it. Type always arrives.
 */
function masthead(): string {
  return `
    <tr>
      <td style="padding:32px 32px 0 32px;">
        <span style="font-family:${FONT};font-size:20px;font-weight:700;letter-spacing:-0.01em;color:${INK};">Pink<span style="color:${ACCENT};">fly</span></span>
        <div style="font-family:${FONT};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BODY};padding-top:6px;">Building Dreams</div>
      </td>
    </tr>`;
}

export function renderEmail(content: EmailContent): string {
  const { eyebrow, headline, paragraphs, button, details, footnote } = content;

  const eyebrowRow = eyebrow
    ? `<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${ACCENT};padding-bottom:12px;">${escape(eyebrow)}</div>`
    : "";

  const body = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px 0;font-family:${FONT};font-size:14px;line-height:1.65;color:${BODY};">${withBreaks(p)}</p>`
    )
    .join("");

  const detailRows = details?.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid ${RULE};border-radius:12px;margin:0 0 20px 0;">
         ${details
           .map(
             (row, i) => `
         <tr>
           <td style="padding:14px 16px;${i > 0 ? `border-top:1px solid ${RULE};` : ""}">
             <div style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${ACCENT};padding-bottom:6px;">${escape(row.label)}</div>
             <div style="font-family:${FONT};font-size:14px;line-height:1.6;color:${INK};">${withBreaks(row.value)}</div>
           </td>
         </tr>`
           )
           .join("")}
       </table>`
    : "";

  // A table-wrapped anchor: a bare padded link loses its shape in Outlook,
  // which ignores padding on an inline element.
  const cta = button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px 0;">
         <tr>
           <td style="background:${ACCENT};border-radius:999px;">
             <a href="${escape(button.href)}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${escape(button.label)}</a>
           </td>
         </tr>
       </table>`
    : "";

  const small = footnote
    ? `<tr>
         <td style="padding:0 32px 32px 32px;">
           <div style="border-top:1px solid ${RULE};padding-top:16px;font-family:${FONT};font-size:11px;line-height:1.6;color:#8a807b;">${withBreaks(footnote)}</div>
         </td>
       </tr>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escape(headline)}</title>
  </head>
  <body style="margin:0;padding:0;background:${PAPER};">
    <!-- The preview line most clients show beside the subject. -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(paragraphs[0] ?? headline)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${PAPER};">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:${CARD};border:1px solid ${RULE};border-radius:18px;">
            ${masthead()}
            <tr>
              <td style="padding:26px 32px 8px 32px;">
                ${eyebrowRow}
                <h1 style="margin:0 0 18px 0;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:700;color:${INK};">${escape(headline)}</h1>
                ${body}
                ${detailRows}
                ${cta}
              </td>
            </tr>
            ${small}
          </table>
          <div style="font-family:${FONT};font-size:11px;color:#8a807b;padding-top:14px;">${escape(siteConfig.name)} · <a href="${escape(siteConfig.url)}" style="color:#8a807b;">${escape(siteConfig.url.replace(/^https?:\/\//, ""))}</a></div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** The same content as text, for clients and filters that read that instead. */
export function renderText(content: EmailContent): string {
  const lines: string[] = [];
  if (content.eyebrow) lines.push(content.eyebrow.toUpperCase(), "");
  lines.push(content.headline, "");
  content.paragraphs.forEach((p) => lines.push(p, ""));
  content.details?.forEach((row) => lines.push(`${row.label}: ${row.value}`, ""));
  if (content.button) lines.push(`${content.button.label}: ${content.button.href}`, "");
  lines.push(`— The ${siteConfig.name} team`);
  if (content.footnote) lines.push("", content.footnote);
  return lines.join("\n");
}
