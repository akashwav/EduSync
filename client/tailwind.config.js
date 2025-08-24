/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // This line tells Tailwind to scan all JS/JSX files in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}