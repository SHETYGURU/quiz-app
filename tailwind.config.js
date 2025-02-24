/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
 
  plugins: [],

    theme: {
      extend: {
        animation: {
          wiggle: "wiggle 1s ease-in-out infinite",
        },
        keyframes: {
          wiggle: {
            "0%, 100%": { transform: "rotate(-5deg)" },
            "50%": { transform: "rotate(5deg)" },
          },
        },
      },
    },
  
  
};
