const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, './src/pages/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/app/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, '../../packages/ui-web/src/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C62828',
          redHover: '#A91F1F',
          orange: '#F57C00',
          green: '#2E7D32',
          darkGray: '#2B2B2B',
        },
        warm: {
          beige: '#F3E5AB',
          lightYellow: '#FFF3C4',
          yellowOrange: '#FFC857',
        },
        natural: {
          lightGreen: '#A1C181',
          teal: '#619B8A',
          darkBlue: '#233D4D',
        },
        deep: {
          darkGreen: '#203C3B',
          slateGreen: '#447270',
          lightSlate: '#6B9493',
          yellow: '#F6E271',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
