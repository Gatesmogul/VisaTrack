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
      JSON.stringify({ email, phone, code, photo }),
    );
  }, [email, phone, code, photo]);

  // -------------------------
  // IMAGE PICKER
  // -------------------------
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>

        <Text style={styles.header}>Contact & Identity</Text>

        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.subHeader}>Step 2 of 3</Text>

      <StepIndicator currentStep={2} />

      {/* PROFILE PHOTO */}
      <View style={styles.photoSection}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.avatar}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="camera" size={24} color="#6B7280" />
            )}
          </View>

          <Pressable style={styles.uploadBtn} onPress={pickImage}>
            <Ionicons name="cloud-upload-outline" size={18} color="#3B82F6" />
            <Text style={styles.uploadText}>Upload Photo</Text>
          </Pressable>
        </View>
        <Text style={styles.helper}>JPG or PNG, max 5MB</Text>
      </View>

      {/* EMAIL */}
      <Text style={styles.label}>Email Address*</Text>
      <View
        style={[
          styles.input,
          emailError && styles.inputError,
          validEmail && styles.inputSuccess,
        ]}
      >
        <Ionicons
          name="mail-outline"
          size={20}
          color={emailError ? "#DC2626" : "#9CA3AF"}
        />
        <TextInput
          style={styles.textInput}
          placeholder="your.email@example.com"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {emailError && <Text style={styles.inlineError}>{emailError}</Text>}

      {/* PHONE */}
      <Text style={styles.label}>Phone Number*</Text>

      <View
        style={[
          styles.input,
          styles.phoneInput,
          phoneError && styles.inputError,
          validPhone && styles.inputSuccess,
        ]}
      >
        <CountryPicker value={code} setValue={setCode} />

        <View
          style={[
            styles.input,
            styles.phoneInput,
            phoneError && styles.inputError,
          ]}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={phoneError ? "#DC2626" : "#9CA3AF"}
          />
          <TextInput
            style={styles.textInput}
            placeholder="123 456 7890"
            value={phone}
            onChangeText={validatePhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {phoneError && <Text style={styles.inlineError}>{phoneError}</Text>}

      {/* VERIFICATION STATUS */}
      <View style={isValid ? styles.successCard : styles.errorCard}>
        <Ionicons
          name={isValid ? "checkmark-circle" : "alert-circle"}
          size={20}
          color={isValid ? "#16A34A" : "#DC2626"}
        />
        <View style={{ marginLeft: 8 }}>
          <Text style={isValid ? styles.successTitle : styles.errorTitle}>
            Verification Required
          </Text>
          <Text style={isValid ? styles.successText : styles.errorText}>
            We’ll send a verification code to confirm your email and phone
            number.
          </Text>
        </View>
      </View>

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
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.nextText}>Next</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },

  header: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  inputSuccess: {
    borderColor: "#22C55E",
    backgroundColor: "#ECFDF5",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  subHeader: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },

  photoSection: {
    alignItems: "center",
    marginVertical: 20,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 30,
    marginLeft: -66,
  },

  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
  },

  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },

  uploadText: {
    color: "#3B82F6",
    fontWeight: "500",
    marginLeft: 6,
  },

  helper: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
    marginRight: -28,
  },

  label: {
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  phoneInput: {
    flex: 1,
    marginLeft: 8,
  },

  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },

  inlineError: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
  },

  successCard: {
    flexDirection: "row",
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },

  errorCard: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },

  successTitle: {
    fontWeight: "600",
    color: "#16A34A",
  },

  successText: {
    color: "#16A34A",
    fontSize: 13,
    marginTop: 2,
  },

  errorTitle: {
    fontWeight: "600",
    color: "#DC2626",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 2,
  },

  prevText: {
    fontWeight: "500",
  },

  nextText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.4,
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
});
