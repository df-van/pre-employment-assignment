/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        default: "#060B11",
        secondary: "#E9ECEF",
        alert: "#FF3C3C",
        hover: "#f5f5f5",
      },
    },
  },
  plugins: [],
};
