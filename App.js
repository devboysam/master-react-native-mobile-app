import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './src/navigation/MainNavigator';
import BrandSplash from './src/components/BrandSplash';
import { ThemeContext } from './src/theme/ThemeContext';
import { createBrand } from './src/theme/brand';
import { getThemePreference, setThemePreference } from './src/storage/learningState';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState('system');
  const systemMode = useColorScheme();
  const resolvedMode = mode === 'system' ? (systemMode === 'dark' ? 'dark' : 'light') : mode;
  const theme = createBrand(resolvedMode);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 1700);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    getThemePreference().then(setMode).catch(() => setMode('system'));
  }, []);

  async function handleSetMode(nextMode) {
    setMode(nextMode);
    await setThemePreference(nextMode);
  }

  if (showSplash) {
    return (
      <ThemeContext.Provider value={{ mode, setMode: handleSetMode, theme }}>
        <SafeAreaProvider>
          <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
          <BrandSplash />
        </SafeAreaProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode: handleSetMode, theme }}>
      <SafeAreaProvider>
        <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
