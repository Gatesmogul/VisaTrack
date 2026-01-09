// app/(tabs)/logout.tsx
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

export default function LogoutScreen() {
  const router = useRouter();

  const handleCancel = () => {
    // Always return to a valid tab route
    router.replace("/(tabs)");
  };

  const handleLogout = async () => {
    // TODO: Clear auth state (AsyncStorage / SecureStore / Context)
    console.log("User logged out");

    // Reset navigation & exit tabs safely
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Log out</Text>

        <View style={styles.messageRow}>
          <Text style={styles.arrow}>←</Text>
          <Text style={styles.message}>
            You will be signed out but your data stays safe
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Pressable
            onPress={handleCancel}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 30,
    color: "#000",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  arrow: {
    fontSize: 22,
    marginRight: 10,
    color: "#000",
  },
  message: {
    fontSize: 16,
    color: "#444",
    flex: 1,
  },
  buttonWrapper: {
    marginTop: "auto",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#CCC",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  cancelText: {
    fontSize: 16,
    color: "#000",
  },
  logoutButton: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
