import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f3ec",
        "paper-dark": "#171410",
        ink: "#2a2420",
        "ink-dark": "#ece3d6",
        clay: "#9a5b3a",
        "clay-dark": "#e08f63",
        moss: "#5a6b4f",
        "moss-dark": "#9fb38e",
        line: "#e3d9c8",
        "line-dark": "#3a3327",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: ["class"],
  plugins: [],
};

export default config;
