import { auth } from "@/firebase/firebase.config";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View
} from "react-native";

export default function VerifyEmail() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const checkVerification = async () => {
    if (!auth.currentUser) {
      alert("Not authenticated");
      return;
    }

    try {
      setChecking(true);

      // Reload user to get latest emailVerified flag
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        router.replace("/terms");
      } else {
        alert("Email not verified yet. Please check your inbox.");
      }
    } catch (err) {
      alert("Failed to verify email status");
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
        Verify your email
      </Text>

      <Text style={{ color: "#666", marginBottom: 20 }}>
        We’ve sent a verification link to your email address.
        Please verify it to continue.
      </Text>

      <Pressable
        onPress={checkVerification}
        disabled={checking}
        style={{
          backgroundColor: "#000",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          opacity: checking ? 0.7 : 1,
        }}
      >
        {checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            I’ve verified my email
          </Text>
        )}
      </Pressable>
    </View>
  );
}

