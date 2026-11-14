import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
        display: ['"Fraunces Variable"', 'Georgia', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        // Brand palette: orange (primary, from the logo), clay (warm terracotta accent),
        // leaf (deep green, echoing the children's uniforms). Neutrals are warm stone.
        gray: colors.stone,
        clay: {
          50: '#fdf4f1', 100: '#fbe6df', 200: '#f6cbbd', 300: '#eea590', 400: '#e2775c',
          500: '#cf553a', 600: '#b2432d', 700: '#923727', 800: '#772f25', 900: '#632a23', 950: '#36130f',
        },
        leaf: {
          50: '#f1f8f3', 100: '#dcefe1', 200: '#bbdec6', 300: '#8ec5a2', 400: '#5ea57b',
          500: '#3d885e', 600: '#2c6c4a', 700: '#24573d', 800: '#1f4632', 900: '#1a3a2b', 950: '#0d2018',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
