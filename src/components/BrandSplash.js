import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function BrandSplash() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  return (
    <LinearGradient
      colors={['#040d20', '#0a2350', '#15477e', '#2fcaf4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: progress,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [32, 0],
                }),
              },
              {
                scale: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.93, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>* PRO COURSE *</Text>
        </View>

        <View style={styles.logoWrap}>
          <Ionicons name="logo-react" size={72} color="#4ddcff" />
        </View>

        <Text style={styles.title}>MASTER</Text>
        <Text style={styles.subtitle}>REACT NATIVE</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  glowOne: {
    position: 'absolute',
    top: '18%',
    left: '14%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(67,216,255,0.22)',
  },
  glowTwo: {
    position: 'absolute',
    bottom: '14%',
    right: '10%',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,143,61,0.16)',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  badge: {
    marginBottom: 22,
    borderRadius: 999,
    backgroundColor: '#ff8f3d',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#ffb77f',
    shadowColor: '#ff8f3d',
    shadowOpacity: 0.48,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 6,
  },
  badgeText: {
    fontSize: 14,
    letterSpacing: 2.2,
    fontWeight: '800',
    color: '#ffffff',
  },
  logoWrap: {
    width: 144,
    height: 144,
    borderRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(8, 30, 62, 0.74)',
    borderWidth: 1,
    borderColor: 'rgba(77, 220, 255, 0.38)',
    shadowColor: '#31d0f7',
    shadowOpacity: 0.46,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '800',
    letterSpacing: 7,
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: 'rgba(255,255,255,0.48)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 5,
    fontWeight: '700',
    textAlign: 'center',
    color: '#54dbff',
  },
});
