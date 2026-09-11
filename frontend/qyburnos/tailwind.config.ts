const config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101416',
        surface: '#171c1f',
        line: '#2a3336',
        signal: '#c4f060',
        aqua: '#55d6ca',
        warning: '#f0af5b',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
