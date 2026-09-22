/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        nguhanh: {
          kim: "#708090",
          moc: "#28a745",
          thuy: "#007bff",
          hoa: "#dc3545",
          tho: "#856404",
          gold: "#c8860a",
          dark: "#27303f",
          header: "#222222",
          nav: "#1f2937",
          border: "#e2e8f0",
          bg: "#f9f5ec",
        }
      },
      maxWidth: {
        "site": "1140px",
      }
    },
  },
  plugins: [],
}
