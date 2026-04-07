const tokens = {
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    pill: 999,
  },
  type: {
    h1: 28,
    h2: 20,
    h3: 17,
    body: 15,
    small: 12,
  },
};

// React Native Official Colors
// Primary: #61DAFB (React Blue - Cyan)
// Dark: #282C34 (Dark background)
// Accent: #9B59B6 (Purple for accents)

export const lightColors = {
  bg: '#f5f8fd',
  card: '#ffffff',
  primary: '#61DAFB',
  primarySoft: '#a8e6ff',
  primaryDeep: '#20232a',
  text: '#20232a',
  muted: '#6b7280',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  accent: '#9B59B6',
  gradientStart: '#61DAFB',
  gradientEnd: '#7be6ff',
  chipBg: '#e0f7ff',
  heroBg: '#e6f9ff',
};

export const darkColors = {
  bg: '#0a0e1a',
  card: '#1a1f2e',
  primary: '#61DAFB',
  primarySoft: '#88e6ff',
  primaryDeep: '#d3ecff',
  text: '#f3f4f6',
  muted: '#9ca3af',
  border: '#2d3748',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  accent: '#b494d9',
  gradientStart: '#1f4fb8',
  gradientEnd: '#0f223f',
  chipBg: '#1a2b42',
  heroBg: '#142847',
};

export function createBrand(mode) {
  return {
    ...tokens,
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
  };
}

export const brand = createBrand('light');

export const softShadows = {
  shadowColor: '#0f172a',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 20,
  elevation: 6,
};
