import AsyncStorage from '@react-native-async-storage/async-storage';

export const BOOKMARKS_KEY = 'bookmarked_lessons';
export const COMPLETED_KEY = 'completed_lessons';
export const THEME_KEY = 'app_theme_mode';

async function getNumberList(key) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item));
  } catch {
    return [];
  }
}

async function setNumberList(key, values) {
  const unique = [...new Set(values.map((item) => Number(item)).filter((item) => Number.isFinite(item)))];
  await AsyncStorage.setItem(key, JSON.stringify(unique));
}

export function getBookmarkedLessonIds() {
  return getNumberList(BOOKMARKS_KEY);
}

export async function toggleBookmarkedLesson(lessonId) {
  const numericId = Number(lessonId);
  const existing = await getBookmarkedLessonIds();
  const hasValue = existing.includes(numericId);
  const next = hasValue ? existing.filter((id) => id !== numericId) : [...existing, numericId];

  await setNumberList(BOOKMARKS_KEY, next);
  return !hasValue;
}

export function getCompletedLessonIds() {
  return getNumberList(COMPLETED_KEY);
}

export async function markLessonCompleted(lessonId) {
  const numericId = Number(lessonId);
  const existing = await getCompletedLessonIds();

  if (!existing.includes(numericId)) {
    await setNumberList(COMPLETED_KEY, [...existing, numericId]);
  }
}

export async function clearBookmarks() {
  await AsyncStorage.removeItem(BOOKMARKS_KEY);
}

export async function clearCompletedLessons() {
  await AsyncStorage.removeItem(COMPLETED_KEY);
}

export async function clearAllLearningState() {
  await Promise.all([clearBookmarks(), clearCompletedLessons()]);
}

export async function getThemePreference() {
  const value = await AsyncStorage.getItem(THEME_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'system';
}

export async function setThemePreference(mode) {
  await AsyncStorage.setItem(THEME_KEY, mode);
}
