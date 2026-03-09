import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getModules } from '../api/client';

export default function HomeScreen({ navigation }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModules()
      .then(setModules)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Modules</Text>
      <FlatList
        data={modules}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('LessonsList', { moduleId: item.id, moduleTitle: item.title })}
          >
            <Text style={styles.icon}>{item.icon || 'book'}</Text>
            <Text style={styles.moduleTitle}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4fbf9',
    paddingTop: 20,
    paddingHorizontal: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#134e4a',
    marginBottom: 14,
  },
  column: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    minHeight: 140,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  icon: {
    fontSize: 22,
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    fontSize: 13,
    color: '#475569',
    marginTop: 8,
  },
});
