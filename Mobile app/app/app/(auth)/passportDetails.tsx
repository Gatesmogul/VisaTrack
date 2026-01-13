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
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

  const isExpired =
    expiryDate !== null && expiryDate.getTime() < Date.now();

  const isValid =
    passportNumber &&
    issuingCountry &&
    issueDate &&
    expiryDate &&
    !isExpired;

  // -------------------------
  // RESTORE
  // -------------------------
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

  // -------------------------
  // PERSIST
  // -------------------------
  useEffect(() => {
    AsyncStorage.setItem(
      "passport",
      JSON.stringify({
        passportNumber,
        issuingCountry,
        issueDate,
        expiryDate,
      })
    );
  }, [passportNumber, issuingCountry, issueDate, expiryDate]);

  // -------------------------
  // SUBMIT
  // -------------------------
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
    <View style={styles.container}>
      <Text style={styles.title}>Passport Information</Text>
      <Text style={styles.subtitle}>
        Enter your passport details exactly as they appear on your document
      </Text>

      {/* PASSPORT NUMBER */}
      <Text style={styles.label}>
        Passport Number <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="credit-card" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.input}
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
      <View style={styles.inputWrapper}>
        <Ionicons name="globe-outline" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.input}
          placeholder="Country name"
          value={issuingCountry}
          onChangeText={setIssuingCountry}
        />
      </View>

      {/* ISSUE DATE */}
      <Text style={styles.label}>
        Issue Date <Text style={styles.required}>*</Text>
      </Text>
      <Pressable
        style={styles.inputWrapper}
        onPress={() => setShowIssuePicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
        <Text style={styles.placeholder}>
          {issueDate ? issueDate.toLocaleDateString() : "Select date"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
      </Pressable>

      {/* EXPIRY DATE */}
      <Text style={styles.label}>
        Expiry Date <Text style={styles.required}>*</Text>
      </Text>
      <Pressable
        style={[
          styles.inputWrapper,
          isExpired && styles.errorBorder,
        ]}
        onPress={() => setShowExpiryPicker(true)}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={isExpired ? "#DC2626" : "#9CA3AF"}
        />
        <Text
          style={[
            styles.placeholder,
            isExpired && styles.errorText,
          ]}
        >
          {expiryDate ? expiryDate.toLocaleDateString() : "Select date"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
      </Pressable>

      {isExpired && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color="#DC2626" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.errorTitle}>Passport Expired</Text>
            <Text style={styles.errorDescription}>
              Please provide a valid passport to continue.
            </Text>
          </View>
        </View>
      )}

      {!isExpired && (
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={18} color="#2563EB" />
          <Text style={styles.infoText}>
            Ensure all details match your passport exactly.
          </Text>
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

      {/* FINISH */}
      <Pressable
        style={[styles.button, (!isValid || loading) && styles.disabled]}
        onPress={handleFinish}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnText}>Finish Setup</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#FFF", flex: 1 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#6B7280", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  required: { color: "#DC2626" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 6,
  },
  input: { flex: 1, marginLeft: 8 },
  placeholder: { flex: 1, marginLeft: 8, color: "#111827" },
  helper: { fontSize: 12, color: "#6B7280", marginBottom: 14 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  infoText: { marginLeft: 8, color: "#1E40AF", fontSize: 12, flex: 1 },
  errorBorder: { borderColor: "#DC2626" },
  errorText: { color: "#DC2626" },
  errorBox: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    borderColor: "#DC2626",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  errorTitle: { color: "#DC2626", fontWeight: "600", fontSize: 13 },
  errorDescription: { color: "#DC2626", fontSize: 12 },
  button: {
    marginTop: 24,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "600" },
  disabled: { opacity: 0.4 },
});
