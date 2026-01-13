import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { auth } from "../../firebase/firebase.config";
import { usePushNotifications } from "../../firebase/usePushNotifications";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TabLayout() {
  usePushNotifications();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [checkingBackend, setCheckingBackend] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 🔐 Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // 🧠 Backend onboarding gate
  useEffect(() => {
    if (!user) return;

    async function checkUserState() {
      try {
        const token = await user.getIdToken();

        const res = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // 🚫 Terms not accepted
        if (!data.acceptedTerms) {
          router.replace("/terms");
          return;
        }

        // 🚫 Profile not completed
        if (!data.profileCompleted) {
          router.replace("/profile");
          return;
        }

        // ✅ All good → allow dashboard
        setCheckingBackend(false);
      } catch (e) {
        console.error("Failed to verify user state", e);
      }
    }

    checkUserState();
  }, [user]);

  // ⏳ Block rendering until checks complete
  if (loading || checkingBackend) return null;

  // 🔁 Hard auth guards
  if (!user) return <Redirect href="/(auth)/signInScreen" />;
  if (!user.emailVerified)
    return <Redirect href="/(auth)/verify-email" />;

  // ✅ Dashboard tabs
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          height: 68,
          borderRadius: 20,
          backgroundColor: "#FFFFFF",
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 6,
        },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      {[
        { name: "index", title: "Home", icon: "home" },
        { name: "trip", title: "Trip", icon: "airplane" },
        { name: "track", title: "Track", icon: "time" },
        { name: "profile", title: "Profile", icon: "person" },
      ].map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#E5EDFF" : "transparent",
                  padding: 8,
                  borderRadius: 14,
                }}
              >
                <Ionicons name={tab.icon as any} size={20} color={color} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
