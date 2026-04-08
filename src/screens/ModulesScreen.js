import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getModules } from '../api/client';
import AppScreen from '../components/AppScreen';
import { brand, softShadows } from '../theme/brand';
import { useAppTheme } from '../theme/ThemeContext';

const FONT = {
  regular: 'Manrope_400Regular',
  semi: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
};

function moduleIcon(icon) {
  if (icon === '?') {
    return '📚';
  }  const iconMap = {
    book: '📘',
    code: '💻',
    design: '🎨',
    video: '🎬',
    quiz: '🧠',
    project: '🛠️',
  };


  return iconMap[icon] || '📁';
}




export default function ModulesScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadModules = useCallback(async () => {
    setError('');
    getModules()
      .then(setModules)
      .catch((err) => setError(err.message || 'Failed to load modules'))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadModules().catch(() => setLoading(false));
    }, [loadModules])
  );

  if (loading) {
    return (
      <AppScreen style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </AppScreen>
    );
  }

  function openModule(moduleId) {
    navigation.push('ModuleDetails', { moduleId });
  }

  return (
    <AppScreen style={[styles.container, { backgroundColor: theme.colors.bg }] }>
      <Text style={[styles.title, { color: theme.colors.text }]}>All Modules</Text>
      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Pick a module to explore lessons</Text>
      {error ? <Text style={[styles.error, { color: theme.colors.accent }]}>{error}</Text> : null}
      <FlatList
        data={modules}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 124 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, pressed && styles.rowPressed]}
            onPress={() => openModule(item.id)}
          >
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getModuleBackgroundColor(item) || theme.colors.heroBg },
                ]}
              >
              {getModuleImage(item) ? (
                <Image source={{ uri: getModuleImage(item) }} style={styles.iconImage} resizeMode="contain" />
              ) : (
                <View style={styles.iconWrap}>
                  <Text style={styles.icon}>{moduleIcon(item.icon)}</Text>
                </View>
              )}
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.moduleTitle, { color: theme.colors.text }]} numberOfLines={2}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="book-outline" size={13} color={theme.colors.muted} />
                  <Text style={[styles.meta, { color: theme.colors.muted }]}>{item.lesson_count || 0} lessons</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={13} color={theme.colors.muted} />
                  <Text style={[styles.meta, { color: theme.colors.muted }]}>{item.total_read_time || 0} min total</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
          </Pressable>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.colors.muted }]}>No modules yet. Create one from admin panel.</Text>}
      />
    </AppScreen>
  );
}

function getModuleImage(item) {
  const candidates = [item?.thumbnail_url, item?.image_url, item?.icon_url, item?.cover_image];
  const url = candidates.find((value) => typeof value === 'string' && value.startsWith('http'));
  if (url) {
    return url;
  }

  if (typeof item?.icon === 'string' && item.icon.startsWith('http')) {
    return item.icon;
  }

  return null;
}

function getModuleBackgroundColor(item) {
  const raw = String(item?.background_color || '').trim();
  if (!raw) {
    return null;
  }

  const withHash = raw.startsWith('#') ? raw : `#${raw}`;
  return /^#[0-9A-Fa-f]{6}$/.test(withHash) ? withHash : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brand.colors.bg,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: brand.type.h2,
    fontFamily: FONT.bold,
    color: brand.colors.text,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    color: brand.colors.muted,
    fontFamily: FONT.regular,
  },
  error: {
    color: '#b42318',
    marginBottom: 10,
  },
  row: {
    backgroundColor: '#ffffff',
    borderRadius: brand.radius.md,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
    ...softShadows,
  },
  rowPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  iconContainer: {
    width: 78,
    height: 78,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 58,
    height: 58,
    backgroundColor: 'transparent',
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  moduleTitle: {
    fontSize: 16,
    fontFamily: FONT.bold,
    lineHeight: 20,
  },
  metaRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  meta: {
    fontSize: 13,
    fontFamily: FONT.semi,
  },
  empty: {
    marginTop: 8,
    fontFamily: FONT.regular,
  },
});
