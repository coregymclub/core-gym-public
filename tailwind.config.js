/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,vue,ts}',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  safelist: [
    'bg-brand',
    'bg-brand-dark',
    'bg-brand-vibrant',
    'bg-brand-warm',
    'bg-rose-500',
    'bg-teal-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-on-surface-dim',
    'bg-orange-100', 'text-orange-900',
    'bg-blue-100', 'text-blue-900',
    'bg-purple-100', 'text-purple-900',
    'bg-green-100', 'text-green-900',
    'animate-slide-up',
    'animate-fade',
    'col-span-1',
    'col-span-2',
    'row-span-1',
    'aspect-square',
    'aspect-[2/1]',
  ],
  theme: {
    extend: {
      /* ===========================================
         COLORS - M3 Expressive Palette
         =========================================== */
      colors: {
        // Brand colors
        'brand': '#D93636',
        'brand-dark': '#B02020',
        'brand-deep': '#C42121',    // For hero sections/gradients
        'brand-vibrant': '#E30613', // Nike-style powerful red
        'brand-warm': '#FA2D48',    // Apple Music warm red
        'brand-light': '#FFEDEF',   // For subtle backgrounds

        // Surface system (light theme)
        'surface': '#ffffff',
        'surface-bright': '#fcfcfc',
        'surface-dim': '#f5f5f5',
        'surface-container': '#f0f0f0',
        'surface-container-high': '#ececec',

        // Text colors
        'on-surface': '#1a1a1a',
        'on-surface-dim': '#666666',
        'on-surface-muted': '#999999',

        // Border colors
        'outline': '#e0e0e0',
        'outline-focus': '#bdbdbd',
        'outline-dim': '#f0f0f0',

        // Semantic colors
        'success': '#22c55e',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
      },

      /* ===========================================
         TYPOGRAPHY
         =========================================== */
      fontFamily: {
        'display': ['Suisse BP Intl', 'system-ui', 'sans-serif'],
        'body': ['Neue Montreal', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Small text
        'label-sm': ['0.75rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.02em' }],
        'label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.01em' }],

        // Body text
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.015em' }],

        // Headings
        'title-sm': ['1.25rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.02em' }],
        'title': ['1.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.03em' }],
        'headline': ['2rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.04em' }],
        'headline-lg': ['2.5rem', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.04em' }],

        // Display text (heroes)
        'display-sm': ['2.5rem', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.04em' }],
        'display': ['3.5rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.05em' }],
        'display-lg': ['5rem', { lineHeight: '0.95', fontWeight: '800', letterSpacing: '-0.05em' }],
        'display-xl': ['6rem', { lineHeight: '0.9', fontWeight: '800', letterSpacing: '-0.06em' }],
        'display-2xl': ['7rem', { lineHeight: '0.9', fontWeight: '800', letterSpacing: '-0.06em' }],
      },

      /* ===========================================
         SPACING
         =========================================== */
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
      },

      /* ===========================================
         BORDER RADIUS - Large, friendly
         =========================================== */
      borderRadius: {
        'sm': '0.75rem',    // 12px - inputs, small cards
        'md': '1rem',       // 16px - buttons, tags
        'lg': '1.5rem',     // 24px - cards
        'xl': '2rem',       // 32px - large cards
        '2xl': '2.5rem',    // 40px - sections
        '3xl': '3rem',      // 48px - hero cards
        '4xl': '4rem',      // 64px - section dividers
        'full': '9999px',
      },

      /* ===========================================
         SCALE - For active/hover states
         =========================================== */
      scale: {
        '98': '.98',
        '102': '1.02',
        '103': '1.03',
      },

      /* ===========================================
         ANIMATIONS - Spring-based, expressive
         =========================================== */
      animation: {
        'spring': 'spring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-slow': 'spring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade': 'fade 0.4s cubic-bezier(0.2, 0, 0, 1)',
        'fade-slow': 'fade 0.6s cubic-bezier(0.2, 0, 0, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up-fast': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.2, 0, 0, 1)',
        'scale-in-slow': 'scaleIn 1.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        spring: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(1.05)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      /* ===========================================
         TRANSITIONS - Custom timing functions
         =========================================== */
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.2, 0, 0, 1)',
        'expressive': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },

      /* ===========================================
         SHADOWS - Soft, elevated, premium
         =========================================== */
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.04)',
        'DEFAULT': '0 2px 8px rgba(0,0,0,0.04)',
        'md': '0 4px 12px rgba(0,0,0,0.05)',
        'elevated': '0 4px 12px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)',
        'elevated-lg': '0 12px 32px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.02)',
        'float': '0 20px 40px -10px rgba(0,0,0,0.15)',
        'float-lg': '0 25px 50px -12px rgba(0,0,0,0.2)',
        'glow': '0 0 40px -10px rgba(217, 54, 54, 0.3)',
        'glow-lg': '0 0 60px -10px rgba(217, 54, 54, 0.4)',
        'inner-sm': 'inset 0 1px 2px rgba(0,0,0,0.05)',
      },

      /* ===========================================
         BACKDROP BLUR
         =========================================== */
      backdropBlur: {
        'xs': '2px',
        'md': '12px',
        'xl': '24px',
        '2xl': '32px',
      },

      /* ===========================================
         Z-INDEX - Logical layers
         =========================================== */
      zIndex: {
        'behind': '-1',
        'base': '0',
        'raised': '10',
        'dropdown': '20',
        'sticky': '30',
        'overlay': '40',
        'modal': '50',
        'toast': '60',
      },

      /* ===========================================
         ASPECT RATIO
         =========================================== */
      aspectRatio: {
        'card': '4 / 5',
        'hero': '16 / 9',
        'square': '1 / 1',
      },

      /* ===========================================
         CONTAINER
         =========================================== */
      maxWidth: {
        'container': '1400px',
        'content': '800px',
        'narrow': '600px',
      },
    },
  },
  plugins: [],
}
