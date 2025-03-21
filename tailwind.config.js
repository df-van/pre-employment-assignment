/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        default: "#060B11",
        secondary: "#E9ECEF",
        hover: "#f5f5f5",
      },
    },
  },
  plugins: [],
};
