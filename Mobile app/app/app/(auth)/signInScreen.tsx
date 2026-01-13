import { signIn } from "@/firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { registerForPushNotificationsAsync } from "@/services/pushNotifications";
import { useRouter } from "expo-router";
import { useState } from "react";
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
//import { useAuthStore } from "../../store/auth";
 


const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SignIn() {


  
  const router = useRouter();
  //const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [secure, setSecure] = useState(true);   // 👈 toggle state
  const [loading, setLoading] = useState(false); // 👈 loading state

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

    const user = await signIn(email, password);

    // 1️⃣ Email verification gate (Firebase-level)
    if (!user.emailVerified) {
      Alert.alert(
        "Verify your email",
        "Please check your inbox and verify your email before continuing."
      );
      return;
    }

    // 2️⃣ Ask backend for authoritative user state
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("Missing auth token");

    const res = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await res.json();

    /**
     * Expected server response shape:
     * {
     *   id,
     *   email,
     *   status: "EMAIL_PENDING" | "TERMS_PENDING" | "PROFILE_INCOMPLETE" | "ACTIVE",
     *   role
     * }
     */

    // 3️⃣ Route guards based on SERVER STATUS (single source of truth)
    switch (data.status) {
      case "EMAIL_PENDING":
        router.replace("/verify-email");
        return;

      case "TERMS_PENDING":
        router.replace("/terms");
        return;

      case "PROFILE_INCOMPLETE":
        router.replace("/profile");
        return;

      case "ACTIVE":
        // continue
        break;

      default:
        throw new Error("Unknown user status");
    }

    // 4️⃣ Sync push notifications (non-blocking)
    syncPushToken().catch(() => {});

    // 5️⃣ All checks passed → app
    router.replace("/(tabs)");

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
          source={require("../../assets/images/header.png")}
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
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            editable={!loading}
          />

          {/* 👁 TOGGLE */}
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

      {/* PRIMARY BUTTON */}
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
      <TouchableOpacity style={styles.socialButton} disabled={loading}>
        <Image
          source={require("../../assets/images/google.png")}
          style={styles.icon}
        />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* FACEBOOK */}
      <TouchableOpacity style={styles.socialButton} disabled={loading}>
        <Image
          source={require("../../assets/images/facebook.png")}
          style={styles.icon}
        />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <Text style={styles.footer}>
        By signing in, you agree to our Terms of Service and Privacy Policy
      </Text>
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

  footer: {
    textAlign: "center",
    color: "#777",
    fontSize: 12,
    marginTop: 10,
  },
});
