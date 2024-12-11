/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        foreground: "hsl(var(--foreground))",
        muted: {
          foreground: "hsl(var(--muted-foreground))",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
