import { Slot } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../../firebase/firebase.config";

export default function AuthLayout() {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("🔥 AUTH LAYOUT STATE", u?.uid ?? "null");
      setUser(u);
    });
    return unsub;
  }, []);

  // ⏳ wait for Firebase
  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // ❗ Unverified users ARE ALLOWED here
  return <Slot />;
}
