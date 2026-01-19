import { getFirebaseIdToken } from "@/firebase/getIdToken";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StepIndicator } from "../../components/StepIndicator";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PassportDetails() {
  const router = useRouter();

  const [passportNumber, setPassportNumber] = useState("");
  const [issuingCountry, setIssuingCountry] = useState("");
  const [issueDate, setIssueDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const [showIssuePicker, setShowIssuePicker] = useState(false);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const isExpired = expiryDate !== null && expiryDate.getTime() < Date.now();

  const isValid =
    passportNumber && issuingCountry && issueDate && expiryDate && !isExpired;

  /* ---------------- RESTORE ---------------- */
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("passport");
      if (!saved) return;

      const data = JSON.parse(saved);
      setPassportNumber(data.passportNumber || "");
      setIssuingCountry(data.issuingCountry || "");
      setIssueDate(data.issueDate ? new Date(data.issueDate) : null);
      setExpiryDate(data.expiryDate ? new Date(data.expiryDate) : null);
    })();
  }, []);

  /* ---------------- PERSIST ---------------- */
  useEffect(() => {
    AsyncStorage.setItem(
      "passport",
      JSON.stringify({
        passportNumber,
        issuingCountry,
        issueDate,
        expiryDate,
      }),
    );
  }, [passportNumber, issuingCountry, issueDate, expiryDate]);

  /* ---------------- SUBMIT ---------------- */
  async function handleFinish() {
    if (!isValid || loading) return;

    setLoading(true);
    try {
      const token = await getFirebaseIdToken();

      await fetch(`${API_URL}/users/profile/passport`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passportNumber,
          issuingCountry,
          issueDate,
          expiryDate,
        }),
      });

      router.replace("/setup-loading");
    } catch {
      Alert.alert("Error", "Failed to save passport details");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>
        <Text style={styles.header}>Passport Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.stepText}>Step 3 of 3</Text>
      <StepIndicator currentStep={3} />

      {/* ICON */}
      <View style={styles.iconBadge}>
        <Ionicons name="document-text-outline" size={26} color="#2563EB" />
      </View>

      <Text style={styles.title}>Passport Information</Text>
      <Text style={styles.subtitle}>
        Enter your passport details exactly as they appear on your document
      </Text>

      {/* PASSPORT NUMBER */}
      <Text style={styles.label}>
        Passport Number <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.input}>
        <MaterialIcons name="credit-card" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.textInput}
          placeholder="e.g. N1234567"
          value={passportNumber}
          onChangeText={setPassportNumber}
          autoCapitalize="characters"
        />
      </View>
      <Text style={styles.helper}>
        Enter without spaces or special characters
      </Text>

      {/* ISSUING COUNTRY */}
      <Text style={styles.label}>
        Issuing Country <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.input}>
        <Ionicons name="globe-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.textInput}
          placeholder="Select country"
          value={issuingCountry}
          onChangeText={setIssuingCountry}
        />
        <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
      </View>

      {/* ISSUE DATE */}
      <Text style={styles.label}>
        Issue Date <Text style={styles.required}>*</Text>
      </Text>
      <Pressable style={styles.input} onPress={() => setShowIssuePicker(true)}>
        <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
        <Text style={styles.valueText}>
          {issueDate ? issueDate.toLocaleDateString() : "Select date"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
      </Pressable>

      {/* EXPIRY DATE */}
      <Text style={styles.label}>
        Expiry Date <Text style={styles.required}>*</Text>
      </Text>
      <Pressable
        style={[styles.input, isExpired && styles.inputError]}
        onPress={() => setShowExpiryPicker(true)}
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color={isExpired ? "#DC2626" : "#9CA3AF"}
        />
        <Text style={[styles.valueText, isExpired && styles.errorText]}>
          {expiryDate ? expiryDate.toLocaleDateString() : "Select date"}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={isExpired ? "#DC2626" : "#9CA3AF"}
        />
      </Pressable>

      {isExpired && (
        <Text style={styles.inlineError}>Passport has expired</Text>
      )}

      {/* INFO / ERROR CARD */}
      {!isExpired ? (
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#2563EB" />
          <Text style={styles.infoText}>
            Make sure all details match your physical passport exactly. Any
            mismatch may delay your visa application.
          </Text>
        </View>
      ) : (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle" size={20} color="#DC2626" />
          <View>
            <Text style={styles.errorTitle}>Passport Expired</Text>
            <Text style={styles.errorDesc}>
              Please update your passport details to continue.
            </Text>
          </View>
        </View>
      )}

      {/* DATE PICKERS */}
      {showIssuePicker && (
        <DateTimePicker
          value={issueDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            setShowIssuePicker(false);
            if (date) setIssueDate(date);
          }}
        />
      )}

      {showExpiryPicker && (
        <DateTimePicker
          value={expiryDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            setShowExpiryPicker(false);
            if (date) setExpiryDate(date);
          }}
        />
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable style={styles.prevBtn} onPress={() => router.back()}>
          <Text style={styles.prevText}>Prev</Text>
        </Pressable>

        <Pressable
          style={[styles.nextBtn, (!isValid || loading) && styles.disabled]}
          onPress={handleFinish}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.nextText}>Finish</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  header: {
    fontSize: 16,
    fontWeight: "600",
  },

  stepText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 6,
  },

  iconBadge: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 6,
  },

  required: {
    color: "#DC2626",
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },

  textInput: {
    flex: 1,
    fontSize: 14,
  },

  valueText: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  helper: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },

  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },

  errorText: {
    color: "#DC2626",
  },

  inlineError: {
    fontSize: 11,
    color: "#DC2626",
    marginTop: 4,
  },

  infoCard: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },

  infoText: {
    fontSize: 12,
    color: "#1E40AF",
    flex: 1,
  },

  errorCard: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },

  errorTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },

  errorDesc: {
    fontSize: 12,
    color: "#7F1D1D",
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },

  prevBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },

  nextBtn: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  prevText: {
    fontWeight: "600",
  },

  nextText: {
    color: "#FFF",
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.4,
  },
});
