import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getLessonsByModule, getModules } from '../api/client';

export default function LessonsScreen({ route, navigation }) {
  const [moduleId, setModuleId] = useState(route.params?.moduleId || null);
  const [moduleTitle, setModuleTitle] = useState(route.params?.moduleTitle || 'Lessons');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      let targetModuleId = moduleId;
      let targetTitle = moduleTitle;

      if (!targetModuleId) {
        const modules = await getModules();
        if (modules.length) {
          targetModuleId = modules[0].id;
          targetTitle = modules[0].title;
          setModuleId(targetModuleId);
          setModuleTitle(targetTitle);
        }
      }

      if (targetModuleId) {
        const list = await getLessonsByModule(targetModuleId);
        setLessons(list);
      }

      setLoading(false);
    }

    bootstrap().catch(() => setLoading(false));
  }, [moduleId, moduleTitle]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{moduleTitle}</Text>
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
              <Text style={styles.meta}>Read time: {item.read_time} min</Text>
            </View>
            <Text style={styles.arrow}>{'>'}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0f172a',
  },
  row: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  meta: {
    marginTop: 6,
    color: '#64748b',
  },
  arrow: {
    fontSize: 18,
    color: '#334155',
  },
});
