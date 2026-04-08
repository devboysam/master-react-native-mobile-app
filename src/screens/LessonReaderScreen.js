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
        backgroundColor: theme.mode === 'dark' ? '#08152c' : '#0f1f42',
        color: '#d8f3ff',
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
        color: theme.colors.primarySoft,
      },
      ul: {
        marginTop: 0,
        marginBottom: 12,
      },
      li: {
        marginBottom: 8,
      },
    }),
    [theme.colors.primaryDeep, theme.colors.primarySoft, theme.colors.text, theme.mode]
  );

  const classesStyles = useMemo(
    () => ({
      tokKey: { color: theme.colors.accent, fontWeight: '700' },
      tokFn: { color: theme.colors.primary },
      tokStr: { color: '#6ee7b7' },
      tokType: { color: '#a9b8ff' },
    }),
    [theme.colors.accent, theme.colors.primary]
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
        <View style={styles.topBarRow}>
          <Pressable style={[styles.backBtn, { backgroundColor: theme.colors.chipBg }]} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color={theme.colors.primaryDeep} />
            <Text style={[styles.backLabel, { color: theme.colors.primaryDeep }]}>Back</Text>
          </Pressable>
          <View style={styles.topActionsRow}>
            <Pressable style={[styles.chip, styles.saveChip, { backgroundColor: theme.colors.chipBg, borderColor: theme.colors.border }]} onPress={toggleBookmark}>
              <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={15} color={theme.colors.primaryDeep} />
            </Pressable>
            <Pressable
              style={[
                styles.chip,
                isCompleted
                  ? [styles.completedChip, { backgroundColor: theme.mode === 'dark' ? '#193528' : '#dff8ea', borderColor: theme.colors.success }]
                  : [styles.pendingChip, { backgroundColor: theme.colors.chipBg, borderColor: theme.colors.border }],
              ]}
              onPress={completeLesson}
            >
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={15}
                color={isCompleted ? theme.colors.success : theme.colors.primaryDeep}
              />
            </Pressable>
          </View>
        </View>

        <View style={[styles.headerCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.heroBg }] }>
          <Text style={[styles.title, { color: theme.colors.primaryDeep }]}>{lesson.title}</Text>
          <View style={styles.metaInline}>
            <Ionicons name="time-outline" size={14} color={theme.colors.muted} />
            <Text style={[styles.meta, { color: theme.colors.muted }]}>Estimated read time: {lesson.read_time ?? '-'} min</Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <Text style={[styles.meta, { color: theme.colors.muted }]}>{isBookmarked ? 'Saved for later' : 'Tap bookmark to save'} • {isCompleted ? 'Completed' : 'In progress'}</Text>
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
  output = output.replace(/\b(import|export|default|const|let|var|return|function|from)\b/g, '<span class="tokKey">$1</span>');
  output = output.replace(/\b(React|View|Text|ScrollView|FlatList)\b/g, '<span class="tokType">$1</span>');
  output = output.replace(/'([^']*)'/g, "'<span class=\"tokStr\">$1</span>'");
  output = output.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g, '<span class="tokFn">$1</span>(');
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
  topBarRow: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  backLabel: {
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: 'transparent',
    borderRadius: brand.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: brand.colors.primaryDeep,
    marginBottom: 8,
  },
  toolbar: {
    marginBottom: 8,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  saveChip: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  pendingChip: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  completedChip: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
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
    backgroundColor: brand.colors.card,
    borderRadius: brand.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: brand.colors.border,
    ...softShadows,
  },
});
