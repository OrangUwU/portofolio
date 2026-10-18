import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        brutal: {
          bg: "#09090B",
          surface: "#141416",
          surfaceHover: "#1A1A1E",
          border: "#27272A",
          borderHover: "#3F3F46",
          muted: "#71717A",
          text: "#FAFAFA",
          accent: "#FF3B30",
        },
      },
      maxWidth: {
        brutal: "1280px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
