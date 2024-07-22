/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}', // Vos fichiers Angular
  ],
  theme: {
    extend: {
      colors:{
        'thead-color': '#F4F2FF',
        'secondary-color': '#F4F2FF',
        'primary-color':"#F2F0F9",
        'tbody-color':"#F2F0F9"
      }
    },
  },
  plugins: [],
}

