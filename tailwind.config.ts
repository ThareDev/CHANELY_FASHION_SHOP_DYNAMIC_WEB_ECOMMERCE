import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extracted from image
        cream: {
          DEFAULT: "#F5F0EB",   // page background
          light: "#FAF7F4",     // lighter cream
          dark: "#EDE7DF",      // darker cream / section bg
        },
        sand: {
          DEFAULT: "#D4C5B0",   // product card background
          light: "#E8DDD2",
        },
        charcoal: {
          DEFAULT: "#1A1A1A",   // primary text, nav
          soft: "#2C2C2C",      // body text
        },
        muted: "#6B6360",       // secondary text
        rose: {
          accent: "#C4956A",    // "ELEVATE YOUR EVERYDAY" text, accent
          warm: "#B8845A",
        },
        offwhite: "#FDFAF7",    // hero area
        border: "#E2D9D0",      // dividers
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Cormorant Garamond'", "Garamond", "serif"],
        body: ["'Jost'", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;