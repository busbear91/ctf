import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'monospace'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#0f0f1a',
          card: '#13131f',
          border: '#1e1e2e',
        },
        red: {
          DEFAULT: '#e63946',
          dim: '#4a1018',
          glow: 'rgba(230,57,70,0.15)',
        },
        green: {
          DEFAULT: '#00ff88',
          dim: '#003322',
          glow: 'rgba(0,255,136,0.15)',
        },
        amber: {
          DEFAULT: '#f4a261',
          dim: '#3d2010',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#8888aa',
          muted: '#44445a',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 4s linear infinite',
        'scan': 'scan 8s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.6' },
          '97%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(230,57,70,0.3), 0 0 20px rgba(230,57,70,0.1)' },
          '50%': { boxShadow: '0 0 10px rgba(230,57,70,0.6), 0 0 40px rgba(230,57,70,0.2)' },
        }
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(30,30,46,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,46,0.8) 1px, transparent 1px)`,
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
export default config
