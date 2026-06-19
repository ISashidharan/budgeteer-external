/** Shared site metadata and navigation, used across layout + pages. */

export const SITE = {
  name: "Budgeteer",
  domain: "budgeteer.app",
  tagline: "Plan, track, and grow your money.",
  description:
    "Budgeteer brings transactions, budgets, loans, assets and net worth into one calm, beautiful place — so you can plan intentionally and build real wealth.",
  email: "hello@budgeteer.app",
};

/** Base URL of the Budgeteer app (sign in / sign up live there). */
export const APP_URL = import.meta.env.PUBLIC_APP_URL || "http://localhost:3000";
export const SIGN_IN_URL = `${APP_URL}/login`;
export const SIGN_UP_URL = `${APP_URL}/register`;

export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
