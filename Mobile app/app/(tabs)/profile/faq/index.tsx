import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function FAQHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      <Text style={styles.subtitle}>
        Find answers to common questions about VisaTrack
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/profile/faq/list")}
      >
        <Text style={styles.buttonText}>Browse FAQs</Text>
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
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
