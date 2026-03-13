import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLessonsByModule, getModuleById } from '../api/client';

export default function LessonsScreen({ route, navigation }) {
  const [moduleItem, setModuleItem] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setModuleItem(moduleData);
      setLessons(lessonData || []);
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>{moduleItem?.title || 'Module Details'}</Text>
        <Text style={styles.subtitle}>{moduleItem?.description || 'Module overview and lessons'}</Text>
      </View>

      {prerequisites.length ? (
        <>
          <Text style={styles.sectionTitle}>Prerequisites</Text>
          <View style={styles.bubbleWrap}>
            {prerequisites.map((item) => (
              <View key={item} style={styles.bubble}>
                <Text style={styles.bubbleText}>{item}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      <Text style={styles.sectionTitle}>Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('LessonReader', { lessonId: item.id })}
          >
            <View>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.meta}>{item.description || 'No description'}</Text>
              <Text style={styles.meta}>Read time: {item.read_time} min</Text>
            </View>
            <Text style={styles.arrow}>{`#${item.lesson_order}`}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.meta}>No lessons for this module yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3f8',
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrap: {
    backgroundColor: '#d7ecf7',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    color: '#15172a',
  },
  subtitle: {
    color: '#3f4761',
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '700',
    color: '#141628',
  },
  bubbleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  bubble: {
    backgroundColor: '#e6e3ec',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bubbleText: {
    color: '#3f4258',
  },
  row: {
    backgroundColor: '#ece9f0',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b1e31',
  },
  meta: {
    marginTop: 6,
    color: '#595f79',
  },
  arrow: {
    fontSize: 18,
    color: '#334155',
  },
});
