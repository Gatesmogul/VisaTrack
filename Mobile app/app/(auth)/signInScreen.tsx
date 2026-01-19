import { signIn } from "@/firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { useGoogleAuth } from "@/firebase/googleAuth";
import { registerForPushNotificationsAsync } from "@/services/pushNotifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ GOOGLE AUTH
  const { promptAsync, handleGoogleResponse } = useGoogleAuth();

  useEffect(() => {
    handleGoogleResponse();
  }, []);

  async function syncPushToken() {
    const token = await registerForPushNotificationsAsync();
    if (!token) return;

    const idToken = await auth.currentUser?.getIdToken();

    await fetch(`${API_URL}/users/push-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ expoPushToken: token }),
    });
  }

  async function handleSignIn() {
    try {
      setLoading(true);

      const user = await signIn(email.trim(), password);

      /**
       * 1️⃣ Firebase email verification gate
       * Backend assumes EMAIL_VERIFIED is already true
       */
      if (!user.emailVerified) {
        router.replace("/(auth)/verify-email");
        return;
      }

      /**
       * 2️⃣ Get fresh ID token for backend
       */
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) throw new Error("Missing auth token");

      /**
       * 3️⃣ Backend is the single source of truth
       */
      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await res.json();

      /**
       * 4️⃣ Route strictly by SERVER status
       */
      switch (data.status) {
        case "NEW":
          // Should be rare, but safest fallback
          router.replace("/(auth)/verify-email");
          return;

        case "EMAIL_VERIFIED":
          router.replace("/(app)/terms");
          return;

        case "PROFILE_INCOMPLETE":
          router.replace("/(auth)/profile");
          return;

        case "ACTIVE":
          break;

        default:
          throw new Error(`Unknown user status: ${data.status}`);
      }

      /**
       * 5️⃣ Fire-and-forget push token sync
       */
      syncPushToken().catch(() => {});

      /**
       * 6️⃣ Enter app
       */
      router.replace("/(tabs)/home");
    } catch (err: any) {
      Alert.alert("Login error", err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerWrap}>
        <Image
          source={require("../../assets/images/logo1.png")}
          style={styles.logo}
        />
        <Text style={styles.appTitle}>VisaTrack</Text>
      </View>

      <Text style={styles.screenTitle}>Welcome back to VisaTrack!</Text>
      <Text style={styles.subText}>Sign in to your account</Text>

      {/* EMAIL */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
      </View>

      {/* PASSWORD */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordWrap}>
          <TextInput
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            editable={!loading}
          />

          <TouchableOpacity
            onPress={() => setSecure(!secure)}
            style={styles.eyeButton}
          >
            <Text>{secure ? "👁️" : "🔐"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* REMEMBER + FORGOT */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setRemember(!remember)}
          disabled={loading}
        >
          <View style={[styles.checkbox, remember && styles.checkboxActive]} />
          <Text style={styles.remember}>Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={loading}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* SIGN IN */}
      <Pressable
        style={[styles.primaryButton, loading && { opacity: 0.6 }]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Sign In</Text>
        )}
      </Pressable>

      {/* DIVIDER */}
      <View style={styles.dividerWrap}>
        <View style={styles.line} />
        <Text style={styles.or}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* GOOGLE */}
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => promptAsync()}
        disabled={loading}
      >
        <Image
          source={require("../../assets/images/google.png")}
          style={styles.icon}
        />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, backgroundColor: "#fff" },

  headerWrap: { flexDirection: "row", alignItems: "center", marginTop: 20 },

  logo: { width: 36, height: 36, marginRight: 6 },

  appTitle: { fontSize: 22, fontWeight: "700" },

  screenTitle: { fontSize: 18, fontWeight: "600", marginTop: 12 },

  subText: { color: "#666", marginBottom: 18 },

  inputGroup: { marginBottom: 14 },

  label: { fontSize: 14, marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#000",
  },

  passwordWrap: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    backgroundColor: "#fff",
  },

  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: "#000",
  },

  eyeButton: { paddingHorizontal: 6 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 6,
  },

  checkboxActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  remember: { color: "#333" },

  forgot: { color: "#007AFF", fontWeight: "500" },

  primaryButton: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  dividerWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  line: { flex: 1, height: 1, backgroundColor: "#ddd" },

  or: { marginHorizontal: 10, color: "#777" },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  icon: { width: 20, height: 20, marginRight: 12 },

  socialText: { fontSize: 15, fontWeight: "500" },
});
