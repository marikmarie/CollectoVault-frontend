/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // use `<html class="dark">` to toggle dark mode
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1b1f23", // dark background from video palette
        surface: "#18171a",
        primary: "#384469", // deep blue/indigo accent
        secondary: "#c9bfa9", // taupe accent
        accent: "#679ab8", // teal-blue accent
        neutral: "#d1d1c5", // light gray for text/foreground
        success: "#4ade80",
        warning: "#facc15",
        danger: "#ef4444",
      },
      borderRadius: {
        lg: "0.75rem", // more rounded corners
      },
    },
  },
  plugins: [],
};
