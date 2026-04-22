/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CRT amber/phosphor palette for retro-futuristic aesthetic
        terminal: {
          bg: "#0a0805",
          panel: "#12100a",
          border: "#3d2f15",
          amber: "#ffb000",
          "amber-dim": "#b37a00",
          "amber-bright": "#ffd666",
          green: "#33ff66",
          "green-dim": "#1a9933",
          red: "#ff4d3d",
          blue: "#5ab3ff",
        },
      },
      fontFamily: {
        mono: ["var(--font-vt323)", "monospace"],
        display: ["var(--font-major-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
