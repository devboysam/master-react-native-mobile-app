import { createContext, useContext } from 'react';
import { createBrand } from './brand';

const defaultTheme = createBrand('light');

export const ThemeContext = createContext({
  mode: 'light',
  setMode: () => {},
  theme: defaultTheme,
});

export function useAppTheme() {
  return useContext(ThemeContext);
}
