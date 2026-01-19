import { auth } from "@/firebase/firebase.config";
import { useRouter } from "expo-router";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);

  // 🔁 Poll verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;

      await user.reload();

      if (user.emailVerified) {
        console.log("✅ Email verified, syncing token...");

        // ⏱ give Firebase time to propagate
        await new Promise((res) => setTimeout(res, 1500));

        // 🔥 force FINAL token refresh
        await user.getIdToken(true);

        router.replace("/(app)/terms");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function resend() {
    try {
      const user = auth.currentUser;
      if (!user) return;

      setSending(true);
      await sendEmailVerification(user);
      Alert.alert("Sent", "Verification email sent");
    } catch {
      Alert.alert("Error", "Could not send email");
    } finally {
      setSending(false);
    }
  }

  async function iveVerified() {
    const user = auth.currentUser;
    if (!user) return;

    setChecking(true);
    await user.reload();

    if (!user.emailVerified) {
      setChecking(false);
      Alert.alert("Not verified yet");
      return;
    }

    // 🔥 FORCE fresh JWT
    await user.getIdToken(true);

    console.log("🚀 Manual confirm → terms");
    router.replace("/(app)/terms");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        Verify your email to continue
      </Text>

      <TouchableOpacity onPress={resend} disabled={sending}>
        <Text style={{ textAlign: "center", marginBottom: 12 }}>
          {sending ? "Sending..." : "Resend verification email"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={iveVerified}
        disabled={checking}
        style={{ backgroundColor: "black", padding: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {checking ? "Checking..." : "I’VE VERIFIED MY EMAIL"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
