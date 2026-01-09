import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";

export default function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
