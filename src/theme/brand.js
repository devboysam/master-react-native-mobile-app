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

export const lightColors = {
  bg: '#f1f4fb',
  card: '#ffffff',
  primary: '#61dafb',
  primarySoft: '#61dafb',
  primaryDeep: '#20232a',
  text: '#20232a',
  muted: '#66708e',
  border: '#dfe6f5',
  success: '#16a34a',
  warning: '#f59e0b',
  gradientStart: '#61dafb',
  gradientEnd: '#7be6ff',
  chipBg: '#e8f7ff',
  heroBg: '#e7f8ff',
};

export const darkColors = {
  bg: '#090f1d',
  card: '#111a2f',
  primary: '#61dafb',
  primarySoft: '#88e6ff',
  primaryDeep: '#d3ecff',
  text: '#e8efff',
  muted: '#9aa8c5',
  border: '#26314a',
  success: '#34d399',
  warning: '#fbbf24',
  gradientStart: '#1f4fb8',
  gradientEnd: '#0f223f',
  chipBg: '#152640',
  heroBg: '#102640',
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
