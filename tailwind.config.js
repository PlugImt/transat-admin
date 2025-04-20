/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark background colors from the email template
        'dark-bg': '#0D0505',
        'card-bg': '#181010',
        // Text colors from the email template
        'text-primary': '#ffe6cc',
        // Accent colors from the email template
        'accent': '#ec7f32',
        'accent-hover': '#813e17',
      },
      fontFamily: {
        'roboto': ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 