/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{html,js}"],  // Adjust this path to match your file structure
    theme: {
      extend: {
        colors: {
          terracotta: "#E07A5F",
          "terracotta-dark": "#C45D41",
          "terracotta-light": "#FF8A70",
          green: "#57CC99",
          "green-light": "#80ED99",
          "green-dark": "#38A169",
          yellow: "#F9C846",
          "yellow-light": "#FFE066",
          dark: "#403D39",
          light: "#FFF1E6",
          gray: "#A7B39A",
        },
        fontFamily: {
          sans: ["Poppins", "sans-serif"],
        },
      },
    },
    plugins: [],
  }