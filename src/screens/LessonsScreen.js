import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getLessonsByModule, getModuleById } from '../api/client';
import { getBookmarkedLessonIds, toggleBookmarkedLesson } from '../storage/learningState';
import AppScreen from '../components/AppScreen';
import { brand, softShadows } from '../theme/brand';
import { useAppTheme } from '../theme/ThemeContext';

export default function LessonsScreen({ route, navigation }) {
  const { theme } = useAppTheme();
  const [moduleItem, setModuleItem] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkSet, setBookmarkSet] = useState(new Set());

  const moduleId = route.params?.moduleId;

  const prerequisites = useMemo(() => {
    const raw = moduleItem?.prerequisites || '';
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [moduleItem]);

  const loadModuleData = useCallback(async () => {
    if (!moduleId) {
      setLoading(false);
      return;
    }

    try {
      const [moduleData, lessonData] = await Promise.all([
        getModuleById(moduleId),
        getLessonsByModule(moduleId),
      ]);
      const bookmarkIds = await getBookmarkedLessonIds();
      setModuleItem(moduleData);
      setLessons(lessonData || []);
      setBookmarkSet(new Set(bookmarkIds.map((id) => Number(id))));
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadModuleData().catch(() => setLoading(false));
    }, [loadModuleData])
  );

  if (loading) {
    return (
      <AppScreen style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </AppScreen>
    );
  }

  async function handleToggleBookmark(lessonId) {
    const nextValue = await toggleBookmarkedLesson(lessonId);
    setBookmarkSet((current) => {
      const next = new Set(current);
      if (nextValue) {
        next.add(Number(lessonId));
      } else {
        next.delete(Number(lessonId));
      }
      return next;
    });
  }

  return (
    <AppScreen style={[styles.container, { backgroundColor: theme.colors.bg }] }>
      <FlatList
        data={lessons}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 124 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.backRow}>
              <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={18} color={theme.colors.primaryDeep} />
                <Text style={[styles.backLabel, { color: theme.colors.primaryDeep }]}>Back</Text>
              </Pressable>
            </View>

            <View style={[styles.headerWrap, { borderColor: theme.colors.border, backgroundColor: theme.colors.heroBg }] }>
              <Text style={styles.headerEyebrow}>Module Overview</Text>
              <Text style={[styles.title, { color: theme.colors.primaryDeep }]}>{moduleItem?.title || 'Module Details'}</Text>
              <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{moduleItem?.description || 'Module overview and lessons'}</Text>
            </View>

            {prerequisites.length ? (
              <>
                <View style={[styles.prereqHead, { backgroundColor: '#eaf8ff', borderColor: theme.colors.border }] }>
                  <Ionicons name="sparkles-outline" size={15} color={theme.colors.primary} />
                  <Text style={[styles.sectionTitle, styles.prereqTitle, { color: theme.colors.primaryDeep }]}>Prerequisites</Text>
                </View>
                <View style={styles.bubbleWrap}>
                  {prerequisites.map((item) => (
                    <View key={item} style={[styles.bubble, { backgroundColor: '#dff4ff', borderColor: '#b8e4ff' }] }>
                      <Text style={[styles.bubbleText, { color: theme.colors.primaryDeep }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Lessons</Text>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => navigation.push('LessonReader', { lessonId: item.id })}
          >
            <View style={styles.lessonIconWrap}>
              <Ionicons name="logo-react" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.lessonTitle, { color: theme.colors.text }]} numberOfLines={2}>{item.title}</Text>
              <Text style={[styles.meta, { color: theme.colors.muted }]} numberOfLines={2}>{item.description || 'No description'}</Text>
              <View style={styles.metaInline}>
                <Ionicons name="time-outline" size={14} color={theme.colors.muted} />
                <Text style={[styles.timeValue, { color: theme.colors.muted }]}>{item.read_time || 0} min</Text>
              </View>
            </View>
            <View style={styles.actionsColumn}>
              <Pressable
                hitSlop={8}
                onPress={() => handleToggleBookmark(item.id)}
                style={({ pressed }) => [styles.bookmarkMini, pressed && styles.bookmarkMiniPressed]}
              >
                <Ionicons
                  name={bookmarkSet.has(Number(item.id)) ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color={theme.colors.primaryDeep}
                />
              </Pressable>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={[styles.meta, { color: theme.colors.muted }]}>No lessons for this module yet.</Text>}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brand.colors.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backRow: {
    marginBottom: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#eaf2ff',
  },
  backLabel: {
    fontWeight: '600',
  },
  headerWrap: {
    backgroundColor: '#eaf2ff',
    borderRadius: brand.radius.md,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d4e2fb',
  },
  headerEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#5f78a8',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: brand.type.h2,
    fontWeight: '700',
    marginBottom: 4,
    color: brand.colors.primaryDeep,
  },
  subtitle: {
    color: brand.colors.muted,
  },
  sectionTitle: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: brand.type.h3,
    fontWeight: '700',
    color: brand.colors.text,
  },
  bubbleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  prereqHead: {
    borderWidth: 1,
    borderRadius: 999,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  prereqTitle: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: 15,
  },
  bubble: {
    backgroundColor: '#eaf2ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cfe6ff',
  },
  bubbleText: {
    color: '#3f4d77',
  },
  row: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: brand.radius.md,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: brand.colors.border,
    ...softShadows,
  },
  rowPressed: {
    opacity: 0.9,
  },
  rowBody: {
    flex: 1,
    paddingRight: 8,
    minWidth: 0,
  },
  lessonIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#d5f3ff',
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: brand.colors.text,
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
  },
  metaInline: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeValue: {
    fontSize: 13,
    marginTop: 0,
  },
  actionsColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkMini: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d5dff5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef3ff',
  },
  bookmarkMiniPressed: {
    opacity: 0.7,
  },
});
