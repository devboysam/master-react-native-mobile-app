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
  bg: '#edf5ff',
  card: '#ffffff',
  primary: '#43d8ff',
  primarySoft: '#9ceeff',
  primaryDeep: '#0c1f43',
  text: '#102649',
  muted: '#5b7295',
  border: '#c9d9ee',
  success: '#10b981',
  warning: '#ff9a3c',
  accent: '#ff8f3d',
  accentSoft: '#ffe4cc',
  gradientStart: '#081a3a',
  gradientMid: '#123a72',
  gradientEnd: '#2dcefa',
  chipBg: '#dbf5ff',
  heroBg: '#d9f3ff',
  glass: 'rgba(255,255,255,0.22)',
};

export const darkColors = {
  bg: '#050f22',
  card: '#0a1934',
  primary: '#4dddff',
  primarySoft: '#8ff0ff',
  primaryDeep: '#dff8ff',
  text: '#e8f5ff',
  muted: '#90abcc',
  border: '#1d3457',
  success: '#34d399',
  warning: '#ffb56c',
  accent: '#ff9d52',
  accentSoft: '#3b291c',
  gradientStart: '#040e22',
  gradientMid: '#0e2b56',
  gradientEnd: '#26c7f5',
  chipBg: '#0f284b',
  heroBg: '#0f2b52',
  glass: 'rgba(255,255,255,0.12)',
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
  shadowColor: '#081225',
  shadowOpacity: 0.14,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 18,
  elevation: 6,
};
