/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  // Dark mode is opt-in via a `.dark` class on <html>, set by the inline theme
  // script in BaseLayout (system preference by default, with a manual toggle).
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand teal ramp (mirrors budgeteer/client/src/theme.js).
        // `50`/`100` are soft tint surfaces and flip in dark mode, so they are
        // driven by CSS variables (see global.css); the rest are fixed brand hues.
        teal: {
          50: "rgb(var(--c-teal-50) / <alpha-value>)",
          100: "rgb(var(--c-teal-100) / <alpha-value>)",
          200: "#99F6E0",
          300: "#5EEAD4",
          400: "#14B8A6",
          500: "#0D9488",
          600: "#0F766E",
          700: "#115E59",
          800: "#0C4A45",
          900: "#04201C",
        },
        // Brand orange / "coin" accent ramp
        coin: {
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
        },
        // Warm surfaces — variable-driven so they invert to deep teal-charcoal
        // tones in dark mode without touching markup.
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
        serif: ["IBM Plex Serif", "Segoe UI", "serif"],
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
        glow: "0 10px 30px rgba(13, 148, 136, 0.30)",
      },
      backgroundImage: {
        "brand-teal":
          "linear-gradient(120deg, #0F766E 0%, #0D9488 55%, #14B8A6 100%)",
        "brand-orange":
          "linear-gradient(120deg, #EA580C 0%, #F97316 60%, #FDBA74 100%)",
        "hero-glow":
          "radial-gradient(1200px 800px at 8% 0%, rgba(20, 184, 166, 0.18), transparent 60%), radial-gradient(900px 700px at 95% 0%, rgba(249, 115, 22, 0.16), transparent 55%)",
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
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
