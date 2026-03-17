import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';
import { getLessonById } from '../api/client';
import {
  getBookmarkedLessonIds,
  getCompletedLessonIds,
  markLessonCompleted,
  toggleBookmarkedLesson,
} from '../storage/learningState';
import AppScreen from '../components/AppScreen';
import { brand, softShadows } from '../theme/brand';
import { useAppTheme } from '../theme/ThemeContext';

export default function LessonReaderScreen({ route, navigation }) {
  const { theme } = useAppTheme();
  const { lessonId } = route.params || {};
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    async function bootstrap() {
      const [lessonData, bookmarkIds, completedIds] = await Promise.all([
        getLessonById(lessonId),
        getBookmarkedLessonIds(),
        getCompletedLessonIds(),
      ]);

      setLesson(lessonData);
      setIsBookmarked(bookmarkIds.includes(Number(lessonId)));
      setIsCompleted(completedIds.includes(Number(lessonId)));
      setLoading(false);
    }

    bootstrap().catch(() => setLoading(false));
  }, [lessonId]);

  const htmlContent = useMemo(() => lessonToHtml(lesson?.content || ''), [lesson?.content]);

  const baseStyle = useMemo(
    () => ({
      color: theme.colors.text,
      fontSize: 15,
      lineHeight: 26,
    }),
    [theme.colors.text]
  );

  const tagsStyles = useMemo(
    () => ({
      h1: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '800',
        color: theme.colors.primaryDeep,
        marginBottom: 10,
        marginTop: 8,
      },
      h2: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '800',
        color: theme.colors.text,
        marginBottom: 8,
        marginTop: 10,
      },
      h3: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 8,
        marginTop: 10,
      },
      p: {
        marginTop: 0,
        marginBottom: 12,
      },
      strong: {
        fontWeight: '800',
        color: theme.colors.text,
      },
      pre: {
        backgroundColor: '#1f2937',
        color: '#d7e0ff',
        borderRadius: 14,
        padding: 14,
        marginTop: 8,
        marginBottom: 14,
        fontFamily: 'Courier New',
      },
      code: {
        fontFamily: 'Courier New',
        fontSize: 14,
        lineHeight: 22,
        color: '#9ad1ff',
      },
      ul: {
        marginTop: 0,
        marginBottom: 12,
      },
      li: {
        marginBottom: 8,
      },
    }),
    [theme.colors.primaryDeep, theme.colors.text]
  );

  const classesStyles = useMemo(
    () => ({
      tokKey: { color: '#f59e0b', fontWeight: '700' },
      tokFn: { color: '#22d3ee' },
      tokStr: { color: '#86efac' },
      tokType: { color: '#c4b5fd' },
    }),
    []
  );

  async function toggleBookmark() {
    const nextIsBookmarked = await toggleBookmarkedLesson(lessonId);
    setIsBookmarked(nextIsBookmarked);
  }

  async function completeLesson() {
    await markLessonCompleted(lessonId);
    setIsCompleted(true);
  }

  if (loading) {
    return (
      <AppScreen style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </AppScreen>
    );
  }

  if (!lesson) {
    return (
      <AppScreen style={styles.centered}>
        <Text>Lesson unavailable.</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={[styles.container, { backgroundColor: theme.colors.bg }] }>
      <ScrollView contentContainerStyle={{ paddingBottom: 124 }} showsVerticalScrollIndicator={false}>
        <View style={styles.backRow}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color={theme.colors.primaryDeep} />
            <Text style={[styles.backLabel, { color: theme.colors.primaryDeep }]}>Back</Text>
          </Pressable>
        </View>

        <View style={[styles.headerCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.heroBg }] }>
          <Text style={[styles.title, { color: theme.colors.primaryDeep }]}>{lesson.title}</Text>
          <View style={styles.metaInline}>
            <Ionicons name="time-outline" size={14} color={theme.colors.muted} />
            <Text style={[styles.meta, { color: theme.colors.muted }]}>Estimated read time: {lesson.read_time} min</Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <Pressable style={[styles.chip, styles.saveChip]} onPress={toggleBookmark}>
            <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={15} color="#1f3f88" />
            <Text style={[styles.chipText, styles.saveChipText]}>{isBookmarked ? 'Saved' : 'Save'}</Text>
          </Pressable>
          <Pressable style={[styles.chip, isCompleted ? styles.completedChip : styles.pendingChip]} onPress={completeLesson}>
            <Ionicons name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'} size={15} color={isCompleted ? '#0f7a3c' : '#1f3f88'} />
            <Text style={[styles.chipText, isCompleted ? styles.completedChipText : styles.saveChipText]}>{isCompleted ? 'Completed' : 'Mark Complete'}</Text>
          </Pressable>
        </View>

        <View style={[styles.readerCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }] }>
          <RenderHTML
            contentWidth={width - 40}
            source={{ html: htmlContent }}
            baseStyle={baseStyle}
            tagsStyles={tagsStyles}
            classesStyles={classesStyles}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function lessonToHtml(raw) {
  const value = String(raw || '').trim();
  if (!value) {
    return '<p>No lesson content available yet.</p>';
  }

  if (/<\/?(h1|h2|h3|p|strong|em|pre|code|ul|li|br)\b/i.test(value)) {
    return highlightHtmlCodeBlocks(value);
  }

  const escaped = escapeHtml(value);

  const codeTransformed = escaped.replace(/```([\w-]+)?\n([\s\S]*?)```/g, (_match, _lang, code) => {
    const formattedCode = code.trim().replace(/\n/g, '<br/>');
    return `<pre><code>${highlightCodeTokens(formattedCode)}</code></pre>`;
  });

  const boldTransformed = codeTransformed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  const paragraphs = boldTransformed
    .split(/\n\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => (chunk.startsWith('<pre>') ? chunk : `<p>${chunk.replace(/\n/g, '<br/>')}</p>`));

  return paragraphs.join('');
}

function highlightHtmlCodeBlocks(html) {
  return String(html).replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_full, code) => {
    const escapedCode = escapeHtml(String(code));
    const formattedCode = escapedCode.replace(/\n/g, '<br/>');
    return `<pre><code>${highlightCodeTokens(formattedCode)}</code></pre>`;
  });
}

function highlightCodeTokens(codeHtml) {
  let output = String(codeHtml);
  output = output.replace(/\b(import|export|default|const|let|var|return|function|from)\b/g, '<span style="color:#f59e0b;font-weight:700;">$1</span>');
  output = output.replace(/\b(React|View|Text|ScrollView|FlatList)\b/g, '<span style="color:#c4b5fd;">$1</span>');
  output = output.replace(/'([^']*)'/g, "'<span style=\"color:#86efac;\">$1</span>'");
  output = output.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g, '<span style="color:#22d3ee;">$1</span>(');
  return output;
}

function escapeHtml(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brand.colors.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backRow: {
    marginBottom: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#eaf2ff',
  },
  backLabel: {
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: '#eaf2ff',
    borderRadius: brand.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d4e2fb',
    marginBottom: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: brand.colors.primaryDeep,
    marginBottom: 8,
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  saveChip: {
    backgroundColor: '#dbe8ff',
    borderColor: '#b7cdfa',
  },
  pendingChip: {
    backgroundColor: '#dbe8ff',
    borderColor: '#b7cdfa',
  },
  completedChip: {
    backgroundColor: '#dcf7e8',
    borderColor: '#9bd8b8',
  },
  chipText: {
    fontWeight: '500',
    fontSize: 13,
  },
  saveChipText: {
    color: '#1f3f88',
  },
  completedChipText: {
    color: '#0f7a3c',
  },
  meta: {
    fontSize: 13,
  },
  metaInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readerCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: brand.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: brand.colors.border,
    ...softShadows,
  },
});
