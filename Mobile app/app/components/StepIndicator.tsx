import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export function StepIndicator({ currentStep = 2 }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentStep,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const width = progress.interpolate({
    inputRange: [1, 2, 3],
    outputRange: ["33%", "66%", "100%"],
  });

  return (
    <View style={{ marginBottom: 24 }}>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width }]} />
      </View>

      <Text style={styles.stepText}>Contact & Identity — Step {currentStep} of 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  barTrack: {
    height: 6,
    borderRadius: 6,
    backgroundColor: "#E6E6E6",
  },
  barFill: {
    height: 6,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  stepText: {
    marginTop: 8,
    fontSize: 13,
    color: "#555",
  },
});
