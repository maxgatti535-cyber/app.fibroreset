/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brandPrimary: '#6C3F99',        /* Rich purple — elegant, modern */
        brandPrimaryDark: '#4A2873',    /* Deep purple for hover/headers */
        brandPrimaryTint: '#EDE5F7',    /* Soft lavender for backgrounds */
        brandPrimaryLight: '#B794D6',   /* Light purple for accents */
        brandAccent: '#8BBBA1',         /* Soft sea-green — the healing color */
        brandAccentDark: '#6A9E83',     /* Darker teal for contrast */
        brandAccentTint: '#E8F5EE',     /* Pale mint green */
        brandWarm: '#F5C6AA',           /* Warm peach — nurturing */
        brandWarmDark: '#D4A088',       /* Deeper warm tone */
        creamBg: '#F9F5EF',            /* Warm off-white */
        surface: '#FFFFFF',
        surfaceElevated: '#FEFEFE',
        border: '#E8E3ED',              /* Subtle lavender border */
        borderLight: '#F0ECF5',
        textPrimary: '#1E1B24',         /* Dark purplish-gray */
        textSecondary: '#524B5E',       /* Medium purple-gray */
        textMuted: '#8E87A0',           /* Light muted purple */
        danger: '#E04B6A',              /* Softer, modern red-pink */
        dangerLight: '#FCE4EC',
        warning: '#F5A623',             /* Warm amber */
        warningLight: '#FFF3E0',
        success: '#4CAF7D',             /* Soft green */
        successLight: '#E8F5E9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
    }
  },
  plugins: []
}
