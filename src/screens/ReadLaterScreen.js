import { StyleSheet, Text, View } from 'react-native';

export default function ReadLaterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Read Later</Text>
      <Text style={styles.text}>Coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  text: {
    color: '#64748b',
    fontSize: 16,
  },
});
