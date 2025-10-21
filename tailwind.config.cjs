/** tailwind.config.cjs */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  // Safelist makes sure Tailwind generates these utility classes for @apply usage
  safelist: [
    'bg-surface',
    'bg-background',
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'text-neutral',
    'rounded-2xl',
    'shadow-lg'
  ],
  theme: {
    extend: {
      colors: {
        background: '#121112',
        surface: '#1d1a1c',
        primary: '#32374d',
        secondary: '#665a67',
        accent: '#d4cdba',
        neutral: '#cfcfc7'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
