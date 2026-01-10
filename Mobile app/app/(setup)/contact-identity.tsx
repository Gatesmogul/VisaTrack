import { useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../../constants/colors";

export default function ContactIdentity() {
    const [form, setForm] = useState({
  email: "",
  phone: "",
  address: "",
  city: "",
});

const [errors, setErrors] = useState<Record<string, string>>({});
const updateField = (key: string, value: string) => {
  setForm({ ...form, [key]: value });
  if (errors[key]) {
    setErrors({ ...errors, [key]: "" });
  }
};
const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!form.email.includes("@")) {
    newErrors.email = "Enter a valid email address";
  }
  if (form.phone.length < 10) {
    newErrors.phone = "Enter a valid phone number";
  }
  if (!form.address) {
    newErrors.address = "Address is required";
  }
  if (!form.city) {
    newErrors.city = "City is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 2 of 3</Text>
      <Text style={styles.header}>Contact & Identity</Text>

      <View style={styles.photoBox}>
        <Text>Upload Photo</Text>
        <Text style={styles.photoHint}>JPG or PNG, max 5MB</Text>
      </View>

      <Text style={styles.label}>Email Address *</Text>
    <TextInput
  style={[styles.input, errors.email && styles.errorInput]}
  value={form.email}
  onChangeText={(v) => updateField("email", v)}
  keyboardType="email-address"
/>
{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        placeholder="+234 123 456 7890"
        style={styles.input}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Verification Required. We’ll send a code to confirm your email and phone.
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
          onPress={() => router.push("./(setup)/passport-info")}
        >
          <Text style={styles.primaryText}>Next</Text>
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
  photoBox: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  photoHint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
  },
  infoBox: {
    backgroundColor: "#E8F3FF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
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
