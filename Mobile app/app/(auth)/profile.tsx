import { getFirebaseIdToken } from "@/firebase/getIdToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DropdownSelect from "../../components/DropdownSelect";
import Loader from "../../components/Loader";
import { StepIndicator } from "../../components/StepIndicator";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [nationality, setNationality] = useState("");
  const [residence, setResidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const errors = {
    name: !name,
    dob: !dob,
    gender: !gender,
    nationality: !nationality,
    residence: !residence,
  };

  const isValid = Object.values(errors).every((v) => v === false);

  // -------------------------
  // FORM PERSISTENCE
  // -------------------------
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("profile");
      if (saved) {
        const data = JSON.parse(saved);
        setName(data.name || "");
        setDob(data.dob ? new Date(data.dob) : null);
        setGender(data.gender ?? null);
        setNationality(data.nationality || "");
        setResidence(data.residence || "");
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      "profile",
      JSON.stringify({ name, dob, gender, nationality, residence }),
    );
  }, [name, dob, gender, nationality, residence]);

  // -------------------------
  // SUBMIT TO API (SERVER IS SOURCE OF TRUTH)
  // -------------------------
  async function handleNext() {
    setTouched(true);
    if (!isValid) return;

    setLoading(true);
    try {
      const token = await getFirebaseIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/users/profile/personal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: name,
          dob,
          gender,
          nationality,
          residence,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save personal profile");
      }

      router.push("/profileContact");
    } catch (err) {
      Alert.alert("Error", "Unable to save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.header}>Personal Information</Text>
        <View style={{ width: 20 }} />
      </View>

      <Text style={styles.stepSub}>Step 1 of 3</Text>

      <StepIndicator currentStep={1} />

      {/* Error banner */}
      {touched && !isValid && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Please fix the errors below</Text>
          <Text style={styles.errorText}>
            Some required fields are missing or incorrect.
          </Text>
        </View>
      )}

      {/* Info box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Important</Text>
        <Text style={styles.infoText}>
          Use the exact details shown on your passport. Any mismatch may delay
          your visa application.
        </Text>
      </View>

      <Text style={styles.label}>
        Full Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[
          styles.input,
          touched && errors.name && styles.inputError,
          name && styles.inputSuccess,
        ]}
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#9CA3AF"
      />

      {/* Date of birth */}
      <Text style={styles.label}>
        Date of Birth <Text style={styles.required}>*</Text>
      </Text>
      <Pressable
        style={[
          styles.input,
          touched && errors.dob && styles.inputError,
          dob && styles.inputSuccess,
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={!dob && styles.placeholder}>
          {dob ? dob.toLocaleDateString() : "DD/MM/YYYY"}
        </Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) setDob(date);
          }}
        />
      )}

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        {["Male", "Female", "Other"].map((g) => (
          <Pressable
            key={g}
            onPress={() => setGender(g)}
            style={[styles.genderPill, gender === g && styles.genderSelected]}
          >
            <Text style={gender === g && styles.genderSelectedText}>{g}</Text>
          </Pressable>
        ))}
      </View>

      {/* Dropdowns */}
      <DropdownSelect
        label="Nationality"
        required
        value={nationality}
        setValue={setNationality}
        error={touched && errors.nationality}
      />

      <DropdownSelect
        label="Country of Residence"
        required
        value={residence}
        setValue={setResidence}
        error={touched && errors.residence}
      />

      {/* Buttons */}
      <View style={styles.footerRow}>
        <Pressable style={styles.prevBtn} onPress={() => router.back()}>
          <Text>Prev</Text>
        </Pressable>

        <Pressable
          style={[styles.nextBtn, !isValid && styles.disabled]}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? <Loader /> : <Text style={styles.nextText}>Next</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 20 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  header: { fontSize: 16, fontWeight: "600", marginTop: 15 },
  stepSub: { fontSize: 12, color: "#777", marginTop: 4, textAlign: "center" },

  backArrow: { fontSize: 28 },
  infoBox: {
    backgroundColor: "#EAF3FF",
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
  },
  infoTitle: { fontWeight: "600", marginBottom: 4 },
  infoText: { fontSize: 13, color: "#555" },

  errorBox: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  errorTitle: { fontWeight: "600", color: "#B91C1C" },
  errorText: { color: "#B91C1C", fontSize: 12 },

  label: { marginTop: 12, marginBottom: 6, fontWeight: "500" },
  required: { color: "red" },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    borderRadius: 12,
  },
  inputError: { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },
  inputSuccess: { borderColor: "#22C55E", backgroundColor: "#ECFDF5" },

  placeholder: { color: "#9CA3AF" },

  genderRow: { flexDirection: "row", gap: 10 },
  genderPill: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: "#EAF3FF",
    borderColor: "#4F8DF7",
  },
  genderSelectedText: { color: "#4F8DF7", fontWeight: "600" },

  footerRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },
  prevBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  nextBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#4F8DF7",
    alignItems: "center",
  },
  nextText: { color: "#fff", fontWeight: "600" },
  disabled: { opacity: 0.5 },
});
