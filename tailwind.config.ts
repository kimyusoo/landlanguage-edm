import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — premium financial research report feel.
        navy: {
          DEFAULT: "#10243E", // Deep Navy
          deep: "#10243E",
          premium: "#17385E", // Premium Navy
          700: "#17385E",
          800: "#132F4C",
          900: "#10243E",
        },
        gold: {
          DEFAULT: "#C7A15A",
          soft: "#D8BE8B",
          dark: "#A9863F",
        },
        ivory: "#F7F5F0",
        cloud: "#F2F4F7", // Light Gray
        ink: "#222222", // Text
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,36,62,0.04), 0 8px 24px rgba(16,36,62,0.06)",
        panel: "0 1px 3px rgba(16,36,62,0.08)",
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
