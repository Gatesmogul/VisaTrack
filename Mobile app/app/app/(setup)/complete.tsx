import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";

export default function SetupComplete() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.checkCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.header}>Profile Setup Complete</Text>
      <Text style={styles.sub}>
        Your information has been saved successfully.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.primaryText}>Start Visa Tracking</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.secondaryText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  check: {
    color: colors.white,
    fontSize: 42,
    fontWeight: "700",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 28,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "600",
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 14,
  },
});
