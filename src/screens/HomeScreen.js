import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAppContent, getModules } from '../api/client';

const initialContent = {
  welcome_title: 'Welcome to Learn React',
  welcome_description: 'Master React.js through structured modules and hands-on practice',
  motivation_text: 'Daily Motivation',
  motivation_quote: 'Keep up the great work!',
};

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [appContent, setAppContent] = useState(initialContent);

  const loadData = useCallback(async () => {
    try {
      const [contentData, moduleData] = await Promise.all([getAppContent(), getModules()]);
      setAppContent(contentData || initialContent);
      setModules((moduleData || []).slice(0, 6));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData().catch(() => setLoading(false));
    }, [loadData])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0ea5c6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Learn React</Text>
      </View>

      <FlatList
        data={modules}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeTitle}>{appContent.welcome_title}</Text>
              <Text style={styles.welcomeDesc}>{appContent.welcome_description}</Text>
            </View>

            <Text style={styles.sectionTitle}>Daily Motivation</Text>
            <View style={styles.motivationCard}>
              <Text style={styles.motivationHeading}>{appContent.motivation_text}</Text>
              <Text style={styles.motivationQuote}>{appContent.motivation_quote}</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Learning Modules</Text>
              <Pressable onPress={() => navigation.navigate('Modules')}>
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.moduleCard}
            onPress={() => navigation.navigate('Modules', { screen: 'ModuleDetails', params: { moduleId: item.id } })}
          >
            <Text style={styles.moduleTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.moduleMeta}>{item.lesson_count || 0} lessons</Text>
            <Text style={styles.moduleMeta}>{item.total_read_time || 0} mins</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3f8',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f3f8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  brand: {
    fontSize: 38,
    fontWeight: '700',
    color: '#12131f',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 120,
  },
  welcomeCard: {
    backgroundColor: '#dddae9',
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
  },
  welcomeTitle: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
    color: '#1a1b2e',
  },
  welcomeDesc: {
    marginTop: 8,
    color: '#36384e',
    fontSize: 23,
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#12131f',
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  viewAll: {
    color: '#0ea5c6',
    fontWeight: '600',
  },
  motivationCard: {
    backgroundColor: '#dddae9',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },
  motivationHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1b2e',
  },
  motivationQuote: {
    marginTop: 8,
    color: '#32354e',
    fontSize: 20,
    lineHeight: 28,
  },
  column: {
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#e5e3ea',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    minHeight: 130,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181a2b',
  },
  moduleMeta: {
    marginTop: 8,
    color: '#585b72',
    fontSize: 18,
  },
});
