import { getFirebaseIdToken } from "@/firebase/getIdToken";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CountryPicker from "../../components/CountryPicker";
import { StepIndicator } from "../../components/StepIndicator";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Contact() {
  const router = useRouter();

  const [photo, setPhoto] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [code, setCode] = useState("+234");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [validPhone, setValidPhone] = useState(false);

  const [loading, setLoading] = useState(false);

  const isValid = validEmail && validPhone;

  // -------------------------
  // VALIDATION
  // -------------------------
  function validateEmail(value: string) {
    setEmail(value);
    const regex = /\S+@\S+\.\S+/;

    if (!regex.test(value)) {
      setEmailError("Please enter a valid email address");
      setValidEmail(false);
    } else {
      setEmailError("");
      setValidEmail(true);
    }
  }

  function validatePhone(value: string) {
    setPhone(value);

    if (value.length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
      setValidPhone(false);
    } else {
      setPhoneError("");
      setValidPhone(true);
    }
  }

  // -------------------------
  // PERSISTENCE
  // -------------------------
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("contact");
      if (!saved) return;

      const data = JSON.parse(saved);
      if (data.email) validateEmail(data.email);
      if (data.phone) validatePhone(data.phone);

      setCode(data.code || "+234");
      setPhoto(data.photo || null);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      "contact",
      JSON.stringify({ email, phone, code, photo })
    );
  }, [email, phone, code, photo]);

  // -------------------------
  // IMAGE PICKER
  // -------------------------
  async function pickImage() {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow photo access");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setPhoto(res.assets[0].uri);
    }
  }

  // -------------------------
  // SUBMIT
  // -------------------------
  async function handleNext() {
    if (!isValid || loading) return;

    setLoading(true);
    try {
      const token = await getFirebaseIdToken();

      await fetch(`${API_URL}/users/profile/contact`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `${code}${phone}`,
          photoUrl: photo,
        }),
      });

      router.push("/passportDetails");
    } catch {
      Alert.alert("Failed to save contact info");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Contact & Identity</Text>
      <StepIndicator currentStep={2} />

      {/* PHOTO */}
      <View style={styles.photoContainer}>
        <View style={styles.avatar}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.cameraIcon}>📷</Text>
          )}
        </View>

        <Pressable style={styles.uploadBtn} onPress={pickImage}>
          <Text style={styles.uploadText}>Upload Photo</Text>
        </Pressable>

        <Text style={styles.helper}>JPG or PNG, max 5MB</Text>
      </View>

      {/* EMAIL */}
      <Text style={styles.label}>Email Address*</Text>

      <View style={[styles.inputWrapper, emailError && styles.inputError]}>
        <Ionicons
          name="mail-outline"
          size={20}
          color={emailError ? "#E53935" : "#999"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="your.email@example.com"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {emailError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{emailError}</Text>
        </View>
      ) : null}

      {/* PHONE */}
      <Text style={styles.label}>Phone Number*</Text>

      <View style={styles.phoneRow}>
        <CountryPicker value={code} setValue={setCode} />

        <View
          style={[
            styles.inputWrapper,
            styles.phoneWrapper,
            phoneError && styles.inputError,
          ]}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={phoneError ? "#E53935" : "#999"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="123 456 7890"
            value={phone}
            onChangeText={validatePhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {phoneError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{phoneError}</Text>
        </View>
      ) : null}

      {/* STATUS */}
      {isValid ? (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>Verification Required</Text>
          <Text style={styles.successText}>
            We’ll verify your contact details next.
          </Text>
        </View>
      ) : (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Fix Required</Text>
          <Text style={styles.warningText}>
            Please correct the fields above.
          </Text>
        </View>
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable style={styles.prevBtn} onPress={() => router.back()}>
          <Text style={styles.prevText}>Prev</Text>
        </Pressable>

        <Pressable
          style={[styles.nextBtn, (!isValid || loading) && styles.disabled]}
          onPress={handleNext}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextText}>Next</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#FFF" },
  header: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  photoContainer: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: { width: "100%", height: "100%", borderRadius: 36 },
  cameraIcon: { fontSize: 24 },
  uploadBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4A90E2",
    borderRadius: 8,
  },
  uploadText: { color: "#4A90E2", fontWeight: "500" },
  helper: { fontSize: 12, color: "#888", marginTop: 6 },
  label: { fontWeight: "500", marginBottom: 6 },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 52,
    backgroundColor: "#FFF",
    marginBottom: 6,
  },
  phoneWrapper: { flex: 1, marginLeft: 8 },
  inputWithIcon: { flex: 1, fontSize: 15 },
  inputIcon: { marginRight: 10 },
  inputError: { borderColor: "#E53935", backgroundColor: "#FFF5F5" },
  errorBox: {
    backgroundColor: "#FFECEC",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E53935",
    marginBottom: 12,
  },
  errorText: { color: "#C62828", fontSize: 13 },
  successBox: {
    backgroundColor: "#E8F9EE",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  successTitle: { fontWeight: "600", color: "#2E7D32" },
  successText: { color: "#2E7D32", marginTop: 4 },
  warningBox: {
    backgroundColor: "#FDECEC",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  warningTitle: { fontWeight: "600", color: "#C62828" },
  warningText: { color: "#C62828", marginTop: 4 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  prevBtn: { padding: 14 },
  prevText: { fontWeight: "500" },
  nextBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  nextText: { color: "#FFF", fontWeight: "600" },
  disabled: { opacity: 0.4 },
});
