import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getLessonsByModule, getModules } from '../api/client';
import { getBookmarkedLessonIds } from '../storage/learningState';
import AppScreen from '../components/AppScreen';
import { brand, softShadows } from '../theme/brand';
import { useAppTheme } from '../theme/ThemeContext';

export default function ReadLaterScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [bookmarkedLessons, setBookmarkedLessons] = useState([]);
  const [moduleMap, setModuleMap] = useState({});
  const [error, setError] = useState('');

  const loadBookmarks = useCallback(async () => {
    setError('');
    try {
      const [bookmarkIds, modules] = await Promise.all([getBookmarkedLessonIds(), getModules()]);

      const map = modules.reduce((acc, moduleItem) => {
        acc[moduleItem.id] = moduleItem;
        return acc;
      }, {});
      setModuleMap(map);

      if (!bookmarkIds.length || !modules.length) {
        setBookmarkedLessons([]);
        return;
      }

      const lessonResponses = await Promise.all(
        modules.map((moduleItem) => getLessonsByModule(moduleItem.id).catch(() => []))
      );
      const allLessons = lessonResponses.flat();
      const bookmarkedSet = new Set(bookmarkIds);

      setBookmarkedLessons(allLessons.filter((lesson) => bookmarkedSet.has(Number(lesson.id))));
    } catch (loadError) {
      setError(loadError.message || 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadBookmarks().catch(() => setLoading(false));
    }, [loadBookmarks])
  );

  const totalMinutes = useMemo(
    () => bookmarkedLessons.reduce((sum, lesson) => sum + Number(lesson.read_time || 0), 0),
    [bookmarkedLessons]
  );

  if (loading) {
    return (
      <AppScreen style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </AppScreen>
    );
  }

  return (
    <AppScreen style={[styles.container, { backgroundColor: theme.colors.bg }] }>
      <Text style={[styles.title, { color: theme.colors.text }]}>Read Later</Text>
      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{bookmarkedLessons.length} saved lessons • {totalMinutes} min</Text>
      {error ? <Text style={[styles.error, { color: theme.colors.accent }]}>{error}</Text> : null}

      <FlatList
        data={bookmarkedLessons}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={bookmarkedLessons.length ? { paddingBottom: 124 } : styles.emptyContainer}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, pressed && styles.rowPressed]}
            onPress={() =>
              navigation.navigate('Modules', { screen: 'LessonReader', params: { lessonId: item.id } })
            }
          >
            <View style={styles.rowInner}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.chipBg }]}>
                <Ionicons name="logo-react" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.rowBody}>
                <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>{item.title}</Text>
                <Text style={[styles.meta, { color: theme.colors.muted }]}>{moduleMap[item.module_id]?.title || 'Unknown module'}</Text>
                <Text style={[styles.meta, { color: theme.colors.muted }]}>{item.read_time} min</Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={[styles.text, { color: theme.colors.muted }]}>No bookmarked lessons yet.</Text>}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brand.colors.bg,
    padding: 16,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: brand.type.h2,
    fontWeight: '800',
    color: brand.colors.text,
  },
  subtitle: {
    marginBottom: 8,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 124,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
  },
  error: {
    color: '#b42318',
    marginBottom: 8,
  },
  row: {
    backgroundColor: '#ffffff',
    borderRadius: brand.radius.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: brand.colors.border,
    ...softShadows,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d5f3ff',
    marginTop: 2,
  },
  rowBody: {
    flex: 1,
  },
  rowPressed: {
    opacity: 0.9,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: brand.colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
  },
});
