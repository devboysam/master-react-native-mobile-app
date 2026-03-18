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
      colors={['#0d1b2a', '#163d5e', '#2b8abf', '#61dafb']}
      style={styles.container}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.6, y: 1 }}
    >
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
        <View style={styles.logoWrap}>
          <Ionicons name="logo-react" size={56} color="#ffffff" />
        </View>
        <Text style={styles.title}>Master React Native</Text>
        <Text style={styles.subtitle}>This React Native course app helps you practice daily and master mobile development.</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  logoWrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#ffffff',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.72)',
  },
});
