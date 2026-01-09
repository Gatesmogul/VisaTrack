import { auth } from "@/firebase/firebase.config";
import { syncUser } from "@/services/user.service";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncUser({
          firebaseUid: user.uid,
          email: user.email!,
          fullName: user.displayName || "",
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
