import type { Config } from "tailwindcss";

// Brand tokens below mirror the CSS variables defined in app/globals.css,
// which were ported directly from the live landing page (joinverbatim.com).
// Changing these in two places is intentional: globals.css is the runtime
// source of truth (for CSS-only consumers), this config is for class-based
// consumers and IDE autocomplete.

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0E0F11",
          elevated: "#17181B",
          hover: "#1E1F23",
        },
        border: {
          DEFAULT: "#26272B",
          strong: "#35373C",
        },
        fg: {
          DEFAULT: "#F4F4F5",
          soft: "#A8A9AD",
          faint: "#6A6B70",
        },
        brand: {
          blue: "#4A9EFF",
          "blue-soft": "rgba(74, 158, 255, 0.12)",
          orange: "#FF7849",
          "orange-soft": "rgba(255, 120, 73, 0.12)",
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Geist"', "-apple-system", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', '"SF Mono"', "Menlo", "monospace"],
      },
      maxWidth: {
        page: "1140px",
      },
    },
  },
  plugins: [],
};

export default config;
