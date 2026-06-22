/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  // Dark mode is opt-in via a `.dark` class on <html>, set by the inline theme
  // script in BaseLayout (system preference by default, with a manual toggle).
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand indigo ramp — AtlasIQ's primary, intelligent/predictive hue.
        // The `teal` key is retained as the internal token name so existing
        // utility classes keep working; the values are the new indigo palette.
        // `50`/`100` are soft tint surfaces and flip in dark mode, so they are
        // driven by CSS variables (see global.css); the rest are fixed brand hues.
        teal: {
          50: "rgb(var(--c-teal-50) / <alpha-value>)",
          100: "rgb(var(--c-teal-100) / <alpha-value>)",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        // Brand cyan accent ramp (retains the `coin` token name).
        coin: {
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
        },
        // Cool surfaces — variable-driven so they flip from clean light slate
        // to deep navy (#0B1020) in dark mode without touching markup.
        cream: {
          DEFAULT: "rgb(var(--c-surface) / <alpha-value>)",
          paper: "rgb(var(--c-surface-paper) / <alpha-value>)",
          deep: "rgb(var(--c-surface-deep) / <alpha-value>)",
        },
        // Foreground ink — flips to near-white in dark mode.
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          soft: "rgb(var(--c-ink-soft) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        // Space Grotesk gives headings + wordmark a precise, technical feel.
        serif: ["Space Grotesk", "Inter", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "18px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 14px 30px rgba(15, 23, 42, 0.07)",
        paper: "0 16px 30px rgba(15, 23, 42, 0.08)",
        float: "0 24px 60px rgba(15, 23, 42, 0.16)",
        glow: "0 10px 30px rgba(34, 211, 238, 0.30)",
      },
      backgroundImage: {
        "brand-teal":
          "linear-gradient(120deg, #4F46E5 0%, #6366F1 50%, #22D3EE 100%)",
        "brand-orange":
          "linear-gradient(120deg, #0891B2 0%, #06B6D4 60%, #22D3EE 100%)",
        "hero-glow":
          "radial-gradient(1200px 800px at 8% 0%, rgba(79, 70, 229, 0.18), transparent 60%), radial-gradient(900px 700px at 95% 0%, rgba(34, 211, 238, 0.14), transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "grow-bar": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        // Slow drift for the hero aurora blobs.
        aurora: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(3%, -4%, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-3%, 3%, 0) scale(0.96)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 6s ease-in-out infinite",
        aurora: "aurora 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
