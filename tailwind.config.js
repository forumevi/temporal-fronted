/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./app/**/*.{js,jsx,ts,tsx}",   // ← app klasöründeki tüm JS/JSX dosyalarını tarar
  "./components/**/*.{js,jsx,ts,tsx}", // ← components klasöründeki tüm JS/JSX dosyalarını tarar
],
  theme: {
    extend: {},
  },
  plugins: [],
};
