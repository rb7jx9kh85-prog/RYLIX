/** Les tokens sont définis en canaux RGB dans src/index.css. */
const token = (name) => `rgb(var(--rylix-${name}-rgb) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // `<alpha-value>` permet les modificateurs d'opacité (text-cream/80).
        navy: token('navy'),
        'navy-alt': token('navy-alt'),
        slate: token('slate'),
        green: token('green'),
        pale: token('pale'),
        cream: token('cream'),
        // Alias sémantiques
        bg: token('navy'),
        'bg-alt': token('navy-alt'),
        fg: token('cream'),
        'fg-muted': token('pale'),
        accent: token('green'),
        line: token('slate'),
      },
      // Une seule famille sur tout le site : Archivo, du corps de texte au logotype.
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.75rem, 11vw, 9rem)', { lineHeight: '1', letterSpacing: '0.02em' }],
        h1: ['clamp(2rem, 5vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.15' }],
        h3: ['clamp(1.125rem, 2vw, 1.375rem)', { lineHeight: '1.25' }],
        label: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.14em' }],
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '2rem',
        lg: '4rem',
        xl: '8rem',
      },
      maxWidth: {
        content: '1200px',
        prose: '58ch',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
      },
      transitionTimingFunction: {
        rylix: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
