/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './lib/**/*.{js,ts,tsx}',
    './store/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        background: '#F5EFE6',
        surface: '#FFFFFF',
        'surface-warm': '#FDF8EC',

        primary: '#F0C040',
        'primary-light': '#F8E08A',
        'primary-dark': '#C89A20',

        secondary: '#E07058',
        'secondary-light': '#ECA090',
        'secondary-dark': '#B84A38',

        tertiary: '#A8C8C4',
        'tertiary-light': '#C8E0DC',
        'tertiary-dark': '#709898',

        'text-primary': '#1C1917',
        'text-secondary': '#57534E',
        'text-muted': '#A8A29E',
        'text-on-dark': '#FFFFFF',
        'text-on-primary': '#1C1917',

        border: '#E8E0D8',
        'border-light': '#F0EAE2',
        'icon-inactive': '#A8A29E',
        'icon-active': '#E07058',

        'path-mind': '#F0C040',
        'path-body': '#E07058',
        'path-soul': '#A8C8C4',

        success: '#6BAF7A',
        error: '#D05050',
        warning: '#E8A040',
        offline: '#A8A29E',
      },
      borderRadius: {
        card: '20px',
        pill: '9999px',
        modal: '28px',
      },
      spacing: {
        screen: '20px',
        card: '16px',
        'card-lg': '24px',
      },
    },
  },

  plugins: [],
};
