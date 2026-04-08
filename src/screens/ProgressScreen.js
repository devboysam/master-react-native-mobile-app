import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLessonsByModule, getModules } from '../api/client';
import { getCompletedLessonIds } from '../storage/learningState';
import AppScreen from '../components/AppScreen';
import { brand, softShadows } from '../theme/brand';
import { useAppTheme } from '../theme/ThemeContext';

export default function ProgressScreen() {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);

  const loadProgress = useCallback(async () => {
    try {
      const [moduleRows, completedRows] = await Promise.all([getModules(), getCompletedLessonIds()]);
      const lessonsByModule = await Promise.all(
        (moduleRows || []).map((moduleItem) => getLessonsByModule(moduleItem.id).catch(() => []))
      );

      setModules(moduleRows || []);
      setAllLessons(lessonsByModule.flat());
      setCompletedIds(completedRows || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadProgress().catch(() => setLoading(false));
    }, [loadProgress])
  );

  const completedSet = useMemo(() => new Set(completedIds.map((id) => Number(id))), [completedIds]);

  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((lesson) => completedSet.has(Number(lesson.id))).length;
  const totalMinutes = allLessons.reduce((sum, lesson) => sum + Number(lesson.read_time || 0), 0);
  const completedMinutes = allLessons
    .filter((lesson) => completedSet.has(Number(lesson.id)))
    .reduce((sum, lesson) => sum + Number(lesson.read_time || 0), 0);

  const moduleProgress = useMemo(() => {
    return modules.map((moduleItem) => {
      const lessons = allLessons.filter((lesson) => Number(lesson.module_id) === Number(moduleItem.id));
      const done = lessons.filter((lesson) => completedSet.has(Number(lesson.id))).length;
      const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;

      return {
        id: moduleItem.id,
        title: moduleItem.title,
        done,
        total: lessons.length,
        percent,
      };
    });
  }, [allLessons, completedSet, modules]);

  if (loading) {
    return (
      <AppScreen style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </AppScreen>
    );
  }

  return (
    <AppScreen style={[styles.container, { backgroundColor: theme.colors.bg }] }>
      <Text style={[styles.title, { color: theme.colors.text }]}>Progress</Text>

      <View style={[styles.kpiCard, { borderColor: theme.colors.border }] }>
        <Text style={[styles.kpiText, { color: '#ffffff' }]}>Lessons: {completedLessons}/{totalLessons}</Text>
        <Text style={[styles.kpiText, { color: '#ffffff' }]}>Minutes: {completedMinutes}/{totalMinutes}</Text>
      </View>

      <FlatList
        data={moduleProgress}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }] }>
            <View style={styles.rowHead}>
              <Text style={[styles.moduleTitle, { color: theme.colors.text }]}>{item.title}</Text>
              <Text style={[styles.percent, { color: theme.colors.primaryDeep }]}>{item.percent}%</Text>
            </View>
            <View style={[styles.barTrack, { backgroundColor: theme.colors.chipBg }]}>
              <View style={[styles.barFill, { width: `${item.percent}%`, backgroundColor: theme.colors.primary }]} />
            </View>
            <Text style={[styles.text, { color: theme.colors.muted }]}>{item.done}/{item.total} lessons completed</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.text, { color: theme.colors.muted }]}>No module progress yet.</Text>}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: brand.type.h2,
    fontWeight: '800',
    marginBottom: 10,
  },
  kpiCard: {
    backgroundColor: '#0d2754',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    ...softShadows,
  },
  kpiText: {
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    ...softShadows,
  },
  rowHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  percent: {
    fontWeight: '700',
  },
  barTrack: {
    height: 10,
    backgroundColor: '#d1d5db',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: 10,
    backgroundColor: '#0f766e',
    borderRadius: 999,
  },
  text: {
    fontSize: 14,
  },
});
