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

  const isValid = Object.values(errors).every(v => v === false);

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
      JSON.stringify({ name, dob, gender, nationality, residence })
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
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}>Personal Information</Text>
      <StepIndicator currentStep={1} />

      <View style={styles.infoBox}>
        <Text>Ensure your data matches your passport</Text>
      </View>

      <Field
        label="Full Name*"
        value={name}
        onChange={setName}
        error={touched && errors.name}
      />

      <Text style={styles.label}>Date of Birth*</Text>
      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text>{dob ? dob.toDateString() : "Select date"}</Text>
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

      <Text style={styles.label}>Gender*</Text>
      <View style={styles.row}>
        {["Male", "Female", "Other"].map(g => (
          <Pressable
            key={g}
            onPress={() => setGender(g)}
            style={[
              styles.gender,
              gender === g && styles.genderSelected,
            ]}
          >
            <Text>{g}</Text>
          </Pressable>
        ))}
      </View>

      <DropdownSelect
        label="Nationality*"
        value={nationality}
        setValue={setNationality}
        options={["Nigeria", "Ghana", "Kenya", "United Kingdom", "USA"]}
      />

      <DropdownSelect
        label="Country of Residence*"
        value={residence}
        setValue={setResidence}
        options={["Nigeria", "Ghana", "Kenya", "United Kingdom", "USA"]}
      />

      <Pressable
        style={[styles.button, !isValid && styles.disabled]}
        onPress={handleNext}
        disabled={loading}
      >
        {loading ? (
          <Loader />
        ) : (
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Next
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, value, onChange, error }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[
          styles.input,
          error && { borderColor: "red" },
          !error && value && { borderColor: "green" },
        ]}
      />
      {error && <Text style={{ color: "red" }}>This field is required</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  infoBox: {
    backgroundColor: "#EAF3FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: { marginBottom: 6, fontWeight: "500" },
  input: { borderWidth: 1, padding: 12, borderRadius: 10 },
  row: { flexDirection: "row", gap: 10, marginVertical: 8 },
  gender: { borderWidth: 1, padding: 10, borderRadius: 10 },
  genderSelected: {
    backgroundColor: "#DDF3FF",
    borderColor: "#2196F3",
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  disabled: { opacity: 0.4 },
});
