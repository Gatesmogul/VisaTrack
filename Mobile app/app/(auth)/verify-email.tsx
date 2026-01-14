import { auth } from "@/firebase/firebase.config";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function VerifyEmail() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function checkVerification() {
    setChecking(true);
    await auth.currentUser?.reload();

    if (auth.currentUser?.emailVerified) {
      router.replace("/terms");
    } else {
      alert("Email not verified yet");
    }
    setChecking(false);
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
        Verify your email
      </Text>

      <Text style={{ color: "#666", marginBottom: 20 }}>
        We’ve sent a verification link to your email address.
        Please verify to continue.
      </Text>

      <Pressable
        onPress={checkVerification}
        style={{
          backgroundColor: "#000",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff" }}>I’ve verified my email</Text>
        )}
      </Pressable>
    </View>
  );
}
