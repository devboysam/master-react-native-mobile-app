import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getLessonById } from '../api/client';

const BOOKMARKS_KEY = 'bookmarked_lessons';

export default function LessonReaderScreen({ route }) {
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      const [lessonData, rawBookmarks] = await Promise.all([
        getLessonById(lessonId),
        AsyncStorage.getItem(BOOKMARKS_KEY),
      ]);

      const bookmarks = rawBookmarks ? JSON.parse(rawBookmarks) : [];
      setLesson(lessonData);
      setIsBookmarked(bookmarks.includes(Number(lessonId)));
      setLoading(false);
    }

    bootstrap().catch(() => setLoading(false));
  }, [lessonId]);

  const contentStyle = useMemo(() => [styles.content, { fontSize }], [fontSize]);

  async function toggleBookmark() {
    const rawBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    const bookmarks = rawBookmarks ? JSON.parse(rawBookmarks) : [];
    const parsedId = Number(lessonId);

    let updated;
    if (bookmarks.includes(parsedId)) {
      updated = bookmarks.filter((id) => id !== parsedId);
      setIsBookmarked(false);
    } else {
      updated = [...bookmarks, parsedId];
      setIsBookmarked(true);
    }

    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  }

  async function handleShare() {
    if (!lesson) {
      return;
    }

    await Share.share({
      message: `${lesson.title}\n\n${lesson.content.slice(0, 180)}...`,
    });
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.centered}>
        <Text>Lesson unavailable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lesson.title}</Text>

      <View style={styles.toolbar}>
        <Pressable style={styles.chip} onPress={() => setFontSize((size) => Math.max(12, size - 2))}>
          <Text style={styles.chipText}>A-</Text>
        </Pressable>
        <Pressable style={styles.chip} onPress={() => setFontSize((size) => Math.min(28, size + 2))}>
          <Text style={styles.chipText}>A+</Text>
        </Pressable>
        <Pressable style={styles.chip} onPress={toggleBookmark}>
          <Text style={styles.chipText}>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</Text>
        </Pressable>
        <Pressable style={styles.chip} onPress={handleShare}>
          <Text style={styles.chipText}>Share</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.meta}>Estimated read time: {lesson.read_time} min</Text>
        <Text style={contentStyle}>{lesson.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffefb',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: '#d1fae5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: '#065f46',
    fontWeight: '600',
  },
  meta: {
    color: '#6b7280',
    marginBottom: 10,
  },
  content: {
    color: '#111827',
    lineHeight: 28,
  },
});
