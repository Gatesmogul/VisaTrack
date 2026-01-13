import { auth } from "@/firebase/firebase.config";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inAuthGroup = segments[0] === "(auth)";

      // 🔓 Not logged in → must stay in auth flow
      if (!user && !inAuthGroup) {
        router.replace("/signInScreen");
      }

      // 🔐 Logged in → should not see auth screens
      if (user && inAuthGroup) {
        router.replace("/verify-email");
      }

      setCheckingAuth(false);
    });

    const sub =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Push clicked:",
          response.notification.request.content.data
        );
      });

    return () => {
      unsubscribe();
      sub.remove();
    };
  }, [segments]);

  // ⏳ Prevent flicker during auth check
  if (checkingAuth) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
