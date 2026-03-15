import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLessonsByModule, getModules } from '../api/client';
import { getCompletedLessonIds } from '../storage/learningState';

export default function ProgressScreen() {
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>

      <View style={styles.kpiCard}>
        <Text style={styles.kpiText}>Lessons: {completedLessons}/{totalLessons}</Text>
        <Text style={styles.kpiText}>Minutes: {completedMinutes}/{totalMinutes}</Text>
      </View>

      <FlatList
        data={moduleProgress}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowHead}>
              <Text style={styles.moduleTitle}>{item.title}</Text>
              <Text style={styles.percent}>{item.percent}%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${item.percent}%` }]} />
            </View>
            <Text style={styles.text}>{item.done}/{item.total} lessons completed</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.text}>No module progress yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3f8',
    padding: 16,
    paddingTop: 18,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  kpiCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  kpiText: {
    color: '#1e3a8a',
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    backgroundColor: '#ece9f0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  rowHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    color: '#1b1e31',
    fontWeight: '700',
    fontSize: 16,
  },
  percent: {
    color: '#334155',
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
    color: '#64748b',
    fontSize: 14,
  },
});
