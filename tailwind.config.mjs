/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#f4f2ee",
        "ink-soft": "#c9c2bb",
        "ink-faint": "#78716a",
        surface: "#0e0e0e",
        "surface-2": "#161616",
        border: "#232323",
        accent: {
          DEFAULT: "#ff6a2e",
          dim: "#a34a20",
          bg: "rgba(255,106,46,.10)",
        },
      },
      fontFamily: {
        display: ["Archivo", "ui-sans-serif", "sans-serif"],
        body: ["Manrope", "ui-sans-serif", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
