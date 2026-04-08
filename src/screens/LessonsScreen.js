import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getLessonsByModule, getModuleById } from '../api/client';
import { getBookmarkedLessonIds, getCompletedLessonIds, toggleBookmarkedLesson } from '../storage/learningState';
import AppScreen from '../components/AppScreen';
import { brand, softShadows } from '../theme/brand';
import { useAppTheme } from '../theme/ThemeContext';

const FONT = {
  regular: 'Manrope_400Regular',
  semi: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extra: 'Manrope_800ExtraBold',
};

export default function LessonsScreen({ route, navigation }) {
  const { theme } = useAppTheme();
  const [moduleItem, setModuleItem] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkSet, setBookmarkSet] = useState(new Set());
  const [completedSet, setCompletedSet] = useState(new Set());

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
      const [bookmarkIds, completedIds] = await Promise.all([
        getBookmarkedLessonIds(),
        getCompletedLessonIds(),
      ]);
      setModuleItem(moduleData);
      setLessons(lessonData || []);
      setBookmarkSet(new Set(bookmarkIds.map((id) => Number(id))));
      setCompletedSet(new Set(completedIds.map((id) => Number(id))));
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  const isModuleCompleted = useMemo(() => {
    if (!lessons.length) {
      return false;
    }
    return lessons.every((lessonItem) => completedSet.has(Number(lessonItem.id)));
  }, [completedSet, lessons]);

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

  function handleBackToModules() {
    // Always return to the module listing screen instead of switching tabs unexpectedly.
    navigation.navigate('ModulesRoot');
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
              <Pressable style={[styles.backBtn, { backgroundColor: theme.colors.chipBg }]} onPress={handleBackToModules}>
                <Ionicons name="chevron-back" size={18} color={theme.colors.primaryDeep} />
                <Text style={[styles.backLabel, { color: theme.colors.primaryDeep }]}>Back</Text>
              </Pressable>
            </View>

            <View style={[styles.headerWrap, { borderColor: theme.colors.border }] }>
              <LinearGradient
                colors={[theme.colors.heroBg, theme.colors.chipBg]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
              >
                <Text style={[styles.headerEyebrow, { color: theme.colors.muted }]}>Module Overview</Text>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: theme.colors.primaryDeep }]}>{moduleItem?.title || 'Module Details'}</Text>
                  <Ionicons
                    name={isModuleCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={22}
                    color={isModuleCompleted ? theme.colors.success : theme.colors.muted}
                    style={styles.titleStatusIcon}
                  />
                </View>
                <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{moduleItem?.description || 'Module overview and lessons'}</Text>
              </LinearGradient>
            </View>

            {prerequisites.length ? (
              <>
                <View style={styles.prereqHead}>
                  <Ionicons name="sparkles-outline" size={15} color={theme.colors.accent} />
                  <Text style={[styles.sectionTitle, styles.prereqTitle, { color: theme.colors.accent }]}>Prerequisites</Text>
                </View>
                <View style={styles.prereqWrap}>
                  {prerequisites.map((item) => (
                    <View key={item} style={[styles.bubble, { backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.accent }]}>
                      <Text style={[styles.bubbleText, { color: theme.colors.accent }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            <View style={styles.lessonsHeadingRow}>
              <Ionicons name="sparkles-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Lessons</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
              pressed && styles.rowPressed,
            ]}
            onPress={() => navigation.push('LessonReader', { lessonId: item.id })}
          >
            <View style={[styles.lessonIconWrap, { backgroundColor: theme.colors.chipBg }]}>
              <Ionicons name="document-text-outline" size={18} color={theme.colors.primary} />
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
                style={({ pressed }) => [
                  styles.bookmarkMini,
                  { borderColor: theme.colors.border, backgroundColor: theme.colors.chipBg },
                  pressed && styles.bookmarkMiniPressed,
                ]}
              >
                <Ionicons
                  name={bookmarkSet.has(Number(item.id)) ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color={theme.colors.primaryDeep}
                />
              </Pressable>
              <Ionicons
                name={completedSet.has(Number(item.id)) ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={18}
                color={completedSet.has(Number(item.id)) ? theme.colors.success : theme.colors.muted}
              />
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
    backgroundColor: 'transparent',
  },
  backLabel: {
    fontFamily: FONT.bold,
  },
  headerWrap: {
    borderRadius: brand.radius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 16,
  },
  headerEyebrow: {
    fontSize: 12,
    fontFamily: FONT.bold,
    letterSpacing: 0.4,
    color: brand.colors.muted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: brand.type.h2,
    fontFamily: FONT.extra,
    flex: 1,
    marginBottom: 6,
    lineHeight: 36,
    letterSpacing: 0.3,
    color: brand.colors.primaryDeep,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleStatusIcon: {
    marginTop: 4,
  },
  subtitle: {
    color: brand.colors.muted,
    fontFamily: FONT.regular,
  },
  sectionTitle: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: brand.type.h3,
    fontFamily: FONT.bold,
    color: brand.colors.text,
  },
  prereqWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  prereqHead: {
    borderWidth: 0,
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
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
  lessonsHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bubble: {
    backgroundColor: '#fff2db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ffd9a3',
    maxWidth: '100%',
  },
  bubbleText: {
    color: '#7a3f00',
    fontFamily: FONT.semi,
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
    fontFamily: FONT.bold,
    color: brand.colors.text,
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: FONT.regular,
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
    fontFamily: FONT.semi,
  },
  actionsColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
