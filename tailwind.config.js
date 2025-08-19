/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // SushiSwap inspired colors
        sushi: {
          pink: "#ff0080",
          blue: "#00d4ff",
          orange: "#ff8c00",
          purple: "#8338ec",
          neon: "#ff4081",
        },
      },
      backgroundImage: {
        'gradient-sushi': 'linear-gradient(135deg, #ff0080 0%, #ff8c00 50%, #00d4ff 100%)',
        'gradient-sushi-secondary': 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
        'gradient-sushi-accent': 'linear-gradient(135deg, #ff4081 0%, #7c4dff 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 128, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 0, 128, 0.6)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 0, 128, 0.3)',
        'neon-strong': '0 0 30px rgba(255, 0, 128, 0.6)',
        'card-hover': '0 15px 35px rgba(255, 0, 128, 0.2)',
      },
    },
  },
  plugins: [],
}
