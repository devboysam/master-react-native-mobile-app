import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/ThemeContext';

export default function AppScreen({ children, style }) {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: theme.colors.bg }] }>
      <View style={styles.topChrome}>
        <View style={[styles.topHandle, { backgroundColor: theme.colors.border }]} />
      </View>
      <View style={[styles.inner, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topChrome: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 6,
  },
  topHandle: {
    width: 84,
    height: 6,
    borderRadius: 999,
    opacity: 0.9,
  },
  inner: {
    flex: 1,
  },
});
