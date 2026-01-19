import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function ContactSupportScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="headset-outline" size={48} color="#2563EB" />
      <Text style={styles.title}>Contact Support</Text>

      <Text style={styles.item}>support@visatrack.com</Text>
      <Text style={styles.item}>+1 (555) 000 000</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  item: {
    fontSize: 15,
    color: "#374151",
  },
});
