import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAppContent, getModules } from '../api/client';
import AppScreen from '../components/AppScreen';
import { brand, softShadows } from '../theme/brand';
import { useAppTheme } from '../theme/ThemeContext';

const APP_NAME = 'Master React Native';
const APP_WELCOME_TITLE = APP_NAME;
const APP_DESCRIPTION = 'A practical React Native course app to help you master app development step by step.';

const initialContent = {
  welcome_title: APP_WELCOME_TITLE,
  welcome_description: APP_DESCRIPTION,
  motivation_text: 'Daily Motivation',
  motivation_quote: 'Keep up the great work!',
};

const FONT = {
  regular: 'Manrope_400Regular',
  semi: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extra: 'Manrope_800ExtraBold',
};

export default function HomeScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [appContent, setAppContent] = useState(initialContent);

  const loadData = useCallback(async () => {
    try {
      const [contentData, moduleData] = await Promise.all([getAppContent(), getModules()]);
      setAppContent({
        ...initialContent,
        ...(contentData || {}),
        welcome_title: APP_WELCOME_TITLE,
        welcome_description: APP_DESCRIPTION,
      });
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
      <AppScreen style={[styles.loader, { backgroundColor: theme.colors.bg }] }>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </AppScreen>
    );
  }

  return (
    <AppScreen style={[styles.container, { backgroundColor: theme.colors.bg }] }>
      <FlatList
        data={modules}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.introSection}>
            <LinearGradient
              colors={[theme.colors.gradientStart, theme.colors.gradientMid || theme.colors.gradientEnd, theme.colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.welcomeCard, { borderColor: theme.colors.border }]}
            >
              <View style={styles.welcomeGrid}>
                <View style={styles.welcomeIconColumn}>
                  <Ionicons name="logo-react" size={66} color={theme.colors.primary} />
                </View>
                <View style={styles.welcomeTextColumn}>
                  <Text style={[styles.welcomeTitle, { color: '#ffffff' }]} numberOfLines={1}>
                    {appContent.welcome_title || APP_WELCOME_TITLE}
                  </Text>
                  <Text style={[styles.welcomeDesc, { color: theme.colors.primarySoft }]}>
                    {appContent.welcome_description || APP_DESCRIPTION}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={theme.mode === 'dark' ? ['#332417', '#523721', '#7c4f26'] : ['#fff2e4', '#ffd8b8', '#ffbf83']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.motivationCard, { borderColor: theme.mode === 'dark' ? '#8f6239' : '#ffca96' }]}
            >
              <View style={styles.motivationTopRow}>
                <View style={[styles.motivationTag, { backgroundColor: theme.mode === 'dark' ? '#614125' : '#fff7e5', borderColor: theme.mode === 'dark' ? '#8f6239' : '#ffd79f' }]}>
                  <Ionicons name="flash-outline" size={12} color={theme.colors.accent} />
                  <Text style={[styles.motivationTagText, { color: theme.mode === 'dark' ? '#ffd8ad' : '#9a5408' }]}>Today's Boost</Text>
                </View>
                <View style={[styles.motivationOrb, { backgroundColor: theme.colors.accent, shadowColor: theme.colors.accent }]} />
              </View>
              <View style={styles.motivationGrid}>
                <View style={styles.motivationIconColumn}>
                  <View style={[styles.motivationIconShell, { shadowColor: theme.colors.accent }]}> 
                    <Ionicons name="bulb" size={42} color={theme.colors.accent} />
                  </View>
                </View>
                <View style={styles.motivationTextColumn}>
                  <Text style={[styles.motivationHeading, { color: theme.mode === 'dark' ? '#ffe1be' : '#6f3d06' }]}>{appContent.motivation_text}</Text>
                  <Text style={[styles.motivationQuote, { color: theme.mode === 'dark' ? '#ffd3a2' : '#8a520a' }]}>{appContent.motivation_quote}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.sectionRow}>
              <View style={styles.headingWithIcon}>
                <Ionicons name="sparkles-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Learning Modules</Text>
              </View>
              <Pressable onPress={() => navigation.navigate('Modules')} style={({ pressed }) => (pressed ? styles.viewAllPressed : undefined)}>
                <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View all</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.moduleCard,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
              pressed && styles.moduleCardPressed,
            ]}
            onPress={() => navigation.navigate('Modules', { screen: 'ModuleDetails', params: { moduleId: item.id } })}
            android_ripple={{ color: theme.colors.chipBg }}
          >
            <View
              style={[
                styles.moduleTopArea,
                { backgroundColor: getModuleBackgroundColor(item) || theme.colors.heroBg },
              ]}
            >
              <View style={styles.moduleVisualWrap}>
                {getModuleImage(item) ? (
                  <Image source={{ uri: getModuleImage(item) }} style={styles.moduleImage} resizeMode="contain" />
                ) : (
                  <View style={styles.moduleImageFallback}>
                    <Text style={styles.moduleEmoji}>{getModuleEmoji(item.icon)}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.moduleBottomArea}>
              <Text style={[styles.moduleTitle, { color: theme.colors.text }]} numberOfLines={2}>{item.title}</Text>
              <View style={[styles.metaBadge, styles.lessonsBadge, { backgroundColor: theme.colors.chipBg }]}> 
                <Ionicons name="book-outline" size={13} color={theme.colors.primaryDeep} />
                <Text style={[styles.moduleMeta, { color: theme.colors.primaryDeep }]}>{item.lesson_count || 0} lessons</Text>
              </View>
              <View style={[styles.metaBadge, styles.timeBadge, { backgroundColor: theme.mode === 'dark' ? '#223929' : '#dff8ea' }]}>
                <Ionicons name="time-outline" size={13} color={theme.colors.success} />
                <Text style={[styles.moduleMeta, { color: theme.colors.success }]}>{item.total_read_time || 0} mins</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </AppScreen>
  );
}

function getModuleImage(item) {
  const candidates = [item?.thumbnail_url, item?.image_url, item?.icon_url, item?.cover_image];
  const url = candidates.find((value) => typeof value === 'string' && value.startsWith('http'));
  if (url) {
    return url;
  }

  if (typeof item?.icon === 'string' && item.icon.startsWith('http')) {
    return item.icon;
  }

  return null;
}

function getModuleEmoji(icon) {
  const iconMap = {
    book: '📘',
    code: '💻',
    design: '🎨',
    video: '🎬',
    quiz: '🧠',
    project: '🛠️',
    react: '⚛️',
  };

  if (typeof icon === 'string' && icon.length <= 3 && icon !== '?') {
    return icon;
  }

  return iconMap[icon] || '📚';
}

function getModuleBackgroundColor(item) {
  const raw = String(item?.background_color || '').trim();
  if (!raw) {
    return null;
  }

  const withHash = raw.startsWith('#') ? raw : `#${raw}`;
  return /^#[0-9A-Fa-f]{6}$/.test(withHash) ? withHash : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 124,
  },
  introSection: {
    marginBottom: 4,
  },
  welcomeCard: {
    borderRadius: brand.radius.lg,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    ...softShadows,
  },
  welcomeGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeIconColumn: {
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTextColumn: {
    flex: 1,
    paddingLeft: 8,
  },
  welcomeTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: FONT.extra,
  },
  welcomeDesc: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT.regular,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: FONT.bold,
  },
  headingWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  viewAll: {
    fontFamily: FONT.bold,
  },
  viewAllPressed: {
    opacity: 0.65,
  },
  motivationCard: {
    borderRadius: brand.radius.md,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    ...softShadows,
  },
  motivationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  motivationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  motivationTagText: {
    fontSize: 12,
    fontFamily: FONT.bold,
    letterSpacing: 0.2,
  },
  motivationOrb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOpacity: 0.55,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 6,
  },
  motivationGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationIconColumn: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  motivationTextColumn: {
    flex: 1,
    paddingLeft: 6,
  },
  motivationIconShell: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 14,
    elevation: 8,
  },
  motivationHeading: {
    fontSize: 18,
    fontFamily: FONT.extra,
    lineHeight: 24,
  },
  motivationQuote: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: FONT.regular,
  },
  column: {
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    borderRadius: brand.radius.md,
    padding: 0,
    marginBottom: 14,
    minHeight: 228,
    borderWidth: 1,
    overflow: 'hidden',
    ...softShadows,
  },
  moduleCardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.88,
  },
  moduleTopArea: {
    minHeight: 94,
    paddingHorizontal: 10,
    paddingTop: 12,
    borderTopLeftRadius: brand.radius.md,
    borderTopRightRadius: brand.radius.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  moduleVisualWrap: {
    width: '100%',
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleBottomArea: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  moduleImage: {
    width: 54,
    height: 54,
    backgroundColor: 'transparent',
  },
  moduleImageFallback: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleEmoji: {
    fontSize: 24,
  },
  moduleTitle: {
    fontSize: 15,
    fontFamily: FONT.bold,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  metaBadge: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lessonsBadge: {
    backgroundColor: 'transparent',
  },
  timeBadge: {
    backgroundColor: 'transparent',
  },
  moduleMeta: {
    fontSize: 12,
    fontFamily: FONT.semi,
  },
});
