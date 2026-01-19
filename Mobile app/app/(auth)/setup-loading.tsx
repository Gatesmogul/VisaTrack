import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProfileSetupLoading() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function finalize() {
      try {
        // Clear temp storage (profile setup drafts)
        await AsyncStorage.multiRemove([
          "profile",
          "contact",
          "passport",
        ]);

        // Show success state
        setCompleted(true);

        // Redirect after short pause
        setTimeout(() => {
          router.replace("./profile-complete");
        }, 2000);
      } catch (e) {
        console.error("Setup finalization failed", e);
      }
    }

    finalize();
  }, []);

  return (
    <View style={styles.container}>
      {!completed ? (
        <>
          <ActivityIndicator size="large" />
          <Text style={styles.text}>
            Setting up your account…
          </Text>
        </>
      ) : (
        <>
          <Ionicons
            name="checkmark-circle"
            size={96}
            color="#22C55E"
          />
          <Text style={styles.successTitle}>
            Profile Completed
          </Text>
          <Text style={styles.successText}>
            Your account is ready 🎉
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: "#444",
  },
  successTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "600",
  },
  successText: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
  },
});
