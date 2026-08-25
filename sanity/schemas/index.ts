import type { SchemaTypeDefinition } from "sanity";

import { figure } from "./objects/figure";
import { cta } from "./objects/cta";
import { navLink } from "./objects/navLink";
import { seo } from "./objects/seo";
import { iconPicker } from "./objects/iconPicker";
import {
  titledItem,
  iconPoint,
  statItem,
  faqItem,
  imageCard,
  sectionHeading,
} from "./objects/blocks";

import { siteSettings } from "./documents/siteSettings";
import { region } from "./documents/region";
import { homePage } from "./documents/homePage";
import { aboutPage } from "./documents/aboutPage";
import { joinPage } from "./documents/joinPage";
import { eventsPage } from "./documents/eventsPage";
import { knowledgeBasePage } from "./documents/knowledgeBasePage";
import { policyPage } from "./documents/policyPage";
import { event } from "./documents/event";
import { kbEntry } from "./documents/kbEntry";
import { teamMember, testimonial, initiative, partner } from "./documents/people";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects — the reusable blocks every page is built from.
  figure,
  cta,
  navLink,
  seo,
  iconPicker,
  sectionHeading,
  titledItem,
  iconPoint,
  statItem,
  faqItem,
  imageCard,

  // Pages.
  homePage,
  aboutPage,
  joinPage,
  eventsPage,
  knowledgeBasePage,
  policyPage,

  // Collections.
  event,
  kbEntry,
  teamMember,
  testimonial,
  initiative,
  partner,

  // Global.
  siteSettings,
  region,
];
