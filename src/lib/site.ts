/** Shared site metadata and navigation, used across layout + pages. */

export const SITE = {
  name: "AtlasIQ",
  domain: "atlasiq.app",
  tagline: "See where your money is headed.",
  description:
    "AtlasIQ turns your transactions into intelligent forecasts — automatically categorizing spending, predicting cash flow, and projecting your net worth so you always know what's next.",
  email: "hello@atlasiq.app",
};

/** Base URL of the AtlasIQ app (sign in / sign up live there). */
export const APP_URL = import.meta.env.PUBLIC_APP_URL || "http://localhost:3000";
export const SIGN_IN_URL = `${APP_URL}/login`;
export const SIGN_UP_URL = `${APP_URL}/register`;

export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
