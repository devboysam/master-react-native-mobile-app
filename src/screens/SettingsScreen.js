import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  clearAllLearningState,
  clearBookmarks,
  clearCompletedLessons,
  getBookmarkedLessonIds,
  getCompletedLessonIds,
} from '../storage/learningState';
import AppScreen from '../components/AppScreen';
import { brand } from '../theme/brand';
import { useAppTheme } from '../theme/ThemeContext';

export default function SettingsScreen() {
  const { theme, mode, setMode } = useAppTheme();
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [status, setStatus] = useState('');

  const loadCounts = useCallback(async () => {
    const [bookmarkIds, completedIds] = await Promise.all([
      getBookmarkedLessonIds(),
      getCompletedLessonIds(),
    ]);
    setBookmarkCount(bookmarkIds.length);
    setCompletedCount(completedIds.length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCounts().catch(() => {
        setStatus('Failed to load local settings state');
      });
    }, [loadCounts])
  );

  function confirmAction(title, message, action) {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          action().catch(() => setStatus('Action failed'));
        },
      },
    ]);
  }

  async function handleClearBookmarks() {
    await clearBookmarks();
    await loadCounts();
    setStatus('Bookmarks cleared');
  }

  async function handleClearCompleted() {
    await clearCompletedLessons();
    await loadCounts();
    setStatus('Completed lessons cleared');
  }

  async function handleClearAll() {
    await clearAllLearningState();
    await loadCounts();
    setStatus('All local learning data cleared');
  }

  return (
    <AppScreen style={[styles.container, { backgroundColor: theme.colors.bg }] }>
      <ScrollView contentContainerStyle={{ paddingBottom: 124 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }] }>
          <Text style={[styles.label, { color: theme.colors.muted }]}>Appearance</Text>
          <View style={styles.segmentRow}>
            {['light', 'dark', 'system'].map((item) => {
              const active = mode === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setMode(item)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: active ? theme.colors.primary : theme.colors.chipBg,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.segmentText, { color: active ? '#ffffff' : theme.colors.primaryDeep }]}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }] }>
          <Text style={[styles.label, { color: theme.colors.muted }]}>Learning Stats</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>Bookmarks: {bookmarkCount}</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>Completed Lessons: {completedCount}</Text>
          <View style={styles.actionWrap}>
            <Pressable
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() =>
                confirmAction('Clear bookmarks?', 'This removes all saved read-later lessons.', handleClearBookmarks)
              }
            >
              <Text style={styles.buttonText}>Clear Bookmarks</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: theme.colors.primaryDeep }]}
              onPress={() =>
                confirmAction('Clear completed progress?', 'This resets your completion tracking.', handleClearCompleted)
              }
            >
              <Text style={styles.buttonText}>Clear Progress</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }] }>
          <Text style={[styles.label, { color: theme.colors.muted }]}>About This App</Text>
          <Text style={[styles.aboutText, { color: theme.colors.text }]}>Master React Native helps you practice daily and master real React Native development.</Text>
          <Text style={[styles.aboutText, { color: theme.colors.muted }]}>Instructor: Sam • Platform: React Native + Expo • Backend: Railway • Admin: Hostinger</Text>
        </View>

        <Pressable
          style={[styles.button, styles.danger]}
          onPress={() =>
            confirmAction('Reset everything?', 'This clears bookmarks and completion progress.', handleClearAll)
          }
        >
          <Text style={styles.buttonText}>Reset All Local Data</Text>
        </Pressable>

        {status ? <Text style={[styles.status, { color: theme.colors.muted }]}>{status}</Text> : null}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: brand.type.h2,
    fontWeight: '800',
    marginBottom: 10,
  },
  card: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    fontWeight: '700',
    marginBottom: 6,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  segmentText: {
    fontWeight: '700',
    fontSize: 13,
  },
  actionWrap: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
  },
  danger: {
    backgroundColor: '#b42318',
    marginTop: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  status: {
    marginTop: 10,
  },
});
