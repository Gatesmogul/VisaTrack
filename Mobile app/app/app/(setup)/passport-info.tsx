import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../constants/colors";

export default function PassportInfo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 3 of 3</Text>
      <Text style={styles.header}>Passport Information</Text>

      <Text style={styles.label}>Passport Number *</Text>
      <TextInput placeholder="A12345678" style={styles.input} />

      <Text style={styles.label}>Issuing Country *</Text>
      <TextInput placeholder="Select country" style={styles.input} />

      <Text style={styles.label}>Issue Date *</Text>
      <TextInput placeholder="DD / MM / YYYY" style={styles.input} />

      <Text style={styles.label}>Expiry Date *</Text>
      <TextInput
        placeholder="DD / MM / YYYY"
        style={[styles.input, styles.errorInput]}
      />
      <Text style={styles.errorText}>Passport expired</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Your passport must be valid for at least 6 months.
        </Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("./(setup)/complete")}
        >
          <Text style={styles.primaryText}>Finish Setup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
  },
  step: {
    color: colors.primary,
    marginBottom: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  errorInput: {
    borderColor: colors.error,
    backgroundColor: "#FFECEC",
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#EEF5FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
