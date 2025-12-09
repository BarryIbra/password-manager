/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",   // indigo moderne
        accent: "#0ea5e9",   // bleu clair
        soft: "#f1f5f9"    // gris très clair
      },
      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: [],
}

