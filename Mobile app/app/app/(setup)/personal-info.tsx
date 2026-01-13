import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../constants/colors";

export default function PersonalInfo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 1 of 3</Text>
      <Text style={styles.header}>Personal Information</Text>

      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        placeholder="As shown on your passport"
        style={[styles.input, styles.errorInput]}
      />
      <Text style={styles.errorText}>This field is required</Text>

      <Text style={styles.label}>Date of Birth *</Text>
      <TextInput placeholder="DD / MM / YYYY" style={styles.input} />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        <View style={styles.genderChip}><Text>Male</Text></View>
        <View style={[styles.genderChip, styles.genderActive]}>
          <Text style={styles.genderActiveText}>Female</Text>
        </View>
        <View style={styles.genderChip}><Text>Other</Text></View>
      </View>

      <Text style={styles.label}>Nationality *</Text>
      <TextInput placeholder="Select your nationality" style={styles.input} />

      <Text style={styles.label}>Country of Residence</Text>
      <TextInput placeholder="Select country" style={styles.input} />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("./(setup)/contact-identity")}
      >
        <Text style={styles.primaryText}>Next</Text>
      </TouchableOpacity>
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
  genderRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  genderChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genderActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderActiveText: {
    color: colors.white,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "600",
  },
});
