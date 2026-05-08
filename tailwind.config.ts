import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        toj: {
          jade: '#009B8D',
          'jade-light': '#E6F7F5',
          'jade-dark': '#007B70',
          navy: '#0D1B2A',
          'navy-soft': '#1B2F46',
          terracotta: '#E26D4A',
          'terracotta-light': '#FCEBE6',
          background: '#F8FAFA',
          text: '#111827',
          'text-secondary': '#6B7280'
        },
        primary: '#009B8D',
        'primary-container': '#E6F7F5',
        'primary-fixed': '#E6F7F5',
        'on-primary': '#FFFFFF',
        secondary: '#E26D4A',
        'secondary-container': '#FCEBE6',
        'on-secondary': '#FFFFFF',
        error: '#E85D4A',
        surface: '#F8FAFA',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F3F7F6',
        'surface-container': '#EDF4F3',
        'on-surface': '#0D1B2A',
        'on-surface-variant': '#6B7280',
        outline: '#A9B8B5',
        'outline-variant': '#D9E3E1'
      },
      boxShadow: {
        soft: '0 24px 60px rgba(13, 27, 42, 0.12)',
        card: '0 8px 24px rgba(13, 27, 42, 0.08)',
        wallet: '0 18px 42px rgba(0, 155, 141, 0.22)'
      },
      backgroundImage: {
        'toj-hero': 'radial-gradient(circle at top left, rgba(0, 155, 141, 0.18), transparent 42%), radial-gradient(circle at right, rgba(226, 109, 74, 0.12), transparent 35%), linear-gradient(180deg, #f8fafa 0%, #eef7f5 100%)',
        'wallet-gradient': 'linear-gradient(135deg, #009B8D 0%, #007B70 100%)'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
};

export default config;
