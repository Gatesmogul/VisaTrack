import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/settings")}
      >
        <Ionicons name="settings-outline" size={28} color="#fff" />
        <Text style={styles.text}>Settings</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/personalinformationscreen")}
      >
        <Ionicons name="person-outline" size={28} color="#fff" />
        <Text style={styles.text}>Personal Info</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={() => router.push("/(tabs)/logout")}
      >
        <Ionicons name="log-out-outline" size={28} color="#fff" />
        <Text style={styles.text}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#4DA3FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
