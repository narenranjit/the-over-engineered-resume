/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        muted: {
          foreground: "var(--muted-foreground)",
        },
      },
    },
  },
};
