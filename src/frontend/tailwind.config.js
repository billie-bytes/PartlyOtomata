/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{tsx,ts,jsx,js}",
  ],
  theme: {
    extend: {
      colors: {
        // Amber/Brown color scheme
        amber: {
          900: '#78350f',
        },
      },
    },
  },
  plugins: [],
};
