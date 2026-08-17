/**
 * Policy page copy.
 *
 * Placeholder wording — replace with legally reviewed text before launch.
 * Kept as data so a lawyer's copy drops straight in without touching a
 * component, and so every region renders the same shared page.
 */
export const policies = {
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    intro:
      "The terms that govern your use of the Pink Fly website, community, and events.",
    sections: [
      {
        heading: "Using Pink Fly",
        body: "By accessing our website or joining the Pink Fly community, you agree to these terms. If you do not agree, please do not use the service.",
      },
      {
        heading: "Membership",
        body: "Membership is personal to you and may not be transferred. We may suspend or end a membership that breaches our Community Guidelines.",
      },
      {
        heading: "Content",
        body: "All Pink Fly content — playbooks, masterclass material, and templates — remains the property of Pink Fly and Noboru World, and is provided for your own use only.",
      },
      {
        heading: "Changes",
        body: "We may update these terms from time to time. Material changes will be shared with members before they take effect.",
      },
    ],
  },
  refund: {
    slug: "refund",
    title: "Refund Policy",
    intro:
      "How refunds work for Pink Fly memberships, events, and paid programmes.",
    sections: [
      {
        heading: "Memberships",
        body: "Membership fees are refundable within the first 7 days of purchase, provided no members-only programme has been attended.",
      },
      {
        heading: "Events and masterclasses",
        body: "Tickets are refundable up to 7 days before the event date. Within 7 days, we are happy to transfer your place to another date or another member.",
      },
      {
        heading: "Cancelled events",
        body: "If Pink Fly cancels an event, you will receive a full refund or the option to move your place to a future date.",
      },
      {
        heading: "Requesting a refund",
        body: "Write to us and we will confirm within 5 working days. Approved refunds are returned via the original payment method.",
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    intro: "What we collect, why we collect it, and the control you have over it.",
    sections: [
      {
        heading: "What we collect",
        body: "The details you give us — name, email, and anything you share when you join, register for an event, or contact us.",
      },
      {
        heading: "How we use it",
        body: "To run the community, deliver events and programmes, respond to you, and send updates you have opted into.",
      },
      {
        heading: "Sharing",
        body: "We do not sell your data. We share it only with the service providers who help us run Pink Fly, and only as needed.",
      },
      {
        heading: "Your choices",
        body: "You can unsubscribe from our emails at any time, and you can ask us to access, correct, or delete your data.",
      },
    ],
  },
  "community-guidelines": {
    slug: "community-guidelines",
    title: "Community Guidelines",
    intro:
      "The behaviour that keeps Pink Fly a room worth walking into.",
    sections: [
      {
        heading: "Show up for each other",
        body: "Celebrate wins, hold the dips, and offer help before you ask for it. This community works because people give first.",
      },
      {
        heading: "Keep it confidential",
        body: "What is shared in a circle stays in the circle. Never repeat another founder's numbers, plans, or struggles outside the room.",
      },
      {
        heading: "No selling into the community",
        body: "Pitching, cold outreach, and spam are not welcome. Build the relationship, and business follows naturally.",
      },
      {
        heading: "Zero tolerance for harm",
        body: "Harassment, discrimination, and abuse of any kind end a membership immediately. Tell us if you see it — we will act.",
      },
    ],
  },
} as const;

export type PolicySlug = keyof typeof policies;
