// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        academic: {
          950: '#0c0b0a', // Deep Obsidian Base
          900: '#141210', // Dark Card Surface
          800: '#26221d', // Borders & Elevated Surfaces
          700: '#3b352e', // Hover States
          burgundy: '#5c1d24', // Accent Red/Alerts
          gold: '#c49a45',     // Primary Metallic Accent
          forest: '#1f3a2b',   // Success/Active States
          parchment: '#e6ded1' // Text Base
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}
