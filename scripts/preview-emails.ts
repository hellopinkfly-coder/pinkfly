/**
 * Writes each email to an HTML file so it can be looked at.
 *
 * An email is the one thing in this codebase that cannot be checked by
 * loading the site: it only exists once it has been sent, and sending one to
 * look at it means sending it to somebody. This renders the same content the
 * routes send and leaves the files next to each other, so a change to the
 * template is a change you can see before anyone receives it.
 *
 *   npm run preview:emails            → .emails/*.html
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { renderEmail, renderText, type EmailContent } from "../src/lib/email-template";
import { siteConfig, integrations } from "../src/config/site";

const join = integrations.whatsappCommunityUrl || `${siteConfig.url}/join`;

const EMAILS: { file: string; subject: string; content: EmailContent }[] = [
  {
    file: "newsletter-welcome",
    subject: `Welcome to the ${siteConfig.name} newsletter`,
    content: {
      eyebrow: "You're on the list",
      headline: "Welcome to Pinkfly.",
      paragraphs: [
        "Every issue carries the new playbooks, the policy changes worth knowing, and the events near you. Nothing else.",
        "The newsletter is the smaller door. The community itself is where the introductions happen — it is free, and you can be in it in a minute.",
      ],
      button: { label: "Join the community", href: join },
      footnote: `You received this because you subscribed at ${siteConfig.url}. To stop receiving it, reply to this email and we will take you off the list.`,
    },
  },
  {
    file: "contact-notification",
    subject: "Pinkfly contact form — Asha Menon",
    content: {
      eyebrow: "Contact form",
      headline: "Asha Menon wrote in.",
      paragraphs: [],
      details: [
        { label: "From", value: "Asha Menon <asha@example.com>" },
        {
          label: "Message",
          value:
            "Hello — I run a small skincare brand in Pune and I would like to know whether the October meetup is open to people who have not joined yet.\n\nThank you,\nAsha",
        },
      ],
      footnote: "Reply to this email and your answer goes straight to them.",
    },
  },
  {
    file: "contact-receipt",
    subject: "We have your message, Asha",
    content: {
      eyebrow: "Message received",
      headline: "Thanks, Asha.",
      paragraphs: [
        "Your message is with us and a person will read it — usually within two working days.",
        "In the meantime, the community is where most questions get answered fastest.",
      ],
      details: [
        {
          label: "What you sent",
          value:
            "Hello — I run a small skincare brand in Pune and I would like to know whether the October meetup is open to people who have not joined yet.",
        },
      ],
      button: { label: "Join the community", href: join },
      footnote: `You received this because you used the contact form at ${siteConfig.url}. Replying to it reaches us.`,
    },
  },
];

mkdirSync(".emails", { recursive: true });
for (const email of EMAILS) {
  writeFileSync(`.emails/${email.file}.html`, renderEmail(email.content));
  writeFileSync(`.emails/${email.file}.txt`, `Subject: ${email.subject}\n\n${renderText(email.content)}`);
  console.log(`.emails/${email.file}.html`);
}
