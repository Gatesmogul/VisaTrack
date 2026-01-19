import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileComplete() {
  const router = useRouter();

  // Optional auto-redirect after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.checkmark}>✅</Text>

      <Text style={styles.title}>Profile completed!</Text>

      <Text style={styles.subtitle}>Your account is now fully set up.</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Text style={styles.buttonText}>Go to dashboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  checkmark: {
    fontSize: 96,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
