import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About VisaTrack</Text>

      <Text style={styles.text}>
        VisaTrack helps travelers plan, track, and manage visa applications
        with confidence. From timelines to reminders, we simplify the process.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
});
