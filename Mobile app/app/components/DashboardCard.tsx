import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

type Props = {
  title: string;
  onPress: () => void;
};

export function DashboardCard({ title, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconPlaceholder} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 32,
    marginBottom: 16,
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.6)",
    marginBottom: 12,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
