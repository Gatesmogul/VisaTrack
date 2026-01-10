//(tabs) → app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Your App 👋</Text>
          <Text style={styles.subtitle}>
            This is the Home tab. Navigate to Personal Info to fill your details.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#4DA3FF',
  },
  scrollContainer: {
    justifyContent: 'center',
    minHeight: height,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: Math.min(width * 0.07, 26),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(width * 0.045, 16),
    color: '#EAF3FF',
    textAlign: 'center',
  },
});
