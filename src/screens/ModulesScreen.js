import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getModules } from '../api/client';

function moduleIcon(icon) {
  const iconMap = {
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Modules</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={modules}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('ModuleDetails', { moduleId: item.id })}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.icon}>{moduleIcon(item.icon)}</Text>
              <View>
                <Text style={styles.moduleTitle}>{item.title}</Text>
                <Text style={styles.meta}>{item.lesson_count || 0} lessons</Text>
                <Text style={styles.meta}>{item.total_read_time || 0} min total</Text>
              </View>
            </View>
            <Text style={styles.chevron}>{'>'}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No modules yet. Create one from admin panel.</Text>}
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
    color: '#101226',
    marginBottom: 14,
  },
  error: {
    color: '#b42318',
    marginBottom: 10,
  },
  row: {
    backgroundColor: '#f1eef5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 24,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#141629',
  },
  meta: {
    marginTop: 4,
    color: '#5e627c',
  },
  chevron: {
    fontSize: 18,
    color: '#595d75',
  },
  empty: {
    color: '#64748b',
    marginTop: 8,
  },
});
