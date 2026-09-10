/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#f6f4f1",
        "ink-soft": "#c9c2bb",
        "ink-faint": "#837c74",
        surface: "#0e0e10",
        "surface-2": "#16161a",
        border: "#26262c",
        accent: {
          DEFAULT: "#ff6a2e",
          dim: "#a34a20",
          bg: "rgba(255,106,46,.10)",
        },
        // Secondary hue, used only in gradients and ambient light so it
        // never competes with orange for "this is the button".
        violet: {
          DEFAULT: "#7c5cff",
          deep: "#3d2a8c",
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
