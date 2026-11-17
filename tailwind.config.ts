import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        night: "#030303",
        coal: "#101113",
        paper: "#FAFAF8",
        mist: "#E8E8E3",
        forest: "#245A45",
        "forest-soft": "#2F6B54",
        "forest-bright": "#3E9B72",
        warm: {
          50: "#F5F4F0",
          100: "#EBE9E3",
          200: "#DCD9CF",
          300: "#BDB9AC",
          400: "#98938420",
          500: "#78736A",
          600: "#57534B",
          700: "#3D3A34",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.03em",
      },
      maxWidth: {
        editorial: "1440px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
