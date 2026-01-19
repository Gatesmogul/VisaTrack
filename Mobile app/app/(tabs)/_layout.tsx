import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth } from "../../firebase/firebase.config";
import { usePushNotifications } from "../../firebase/usePushNotifications";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function NewTabButton({ onPress, accessibilityState }: any) {
  const focused = accessibilityState?.selected;

  return (
    <Pressable onPress={onPress} style={styles.newTabWrapper}>
      <View style={styles.newTabCircle}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </View>
      <Text style={[styles.newTabLabel, focused && { color: "#2563EB" }]}>
        New
      </Text>
    </Pressable>
  );
}

export default function TabLayout() {
  console.log("🟥 AUTH LAYOUT RENDERED");
  usePushNotifications();
  const router = useRouter();
  const [checkingBackend, setCheckingBackend] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<any>(undefined);

  // 🔐 Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("🔥 AUTH STATE CHANGED", u?.uid ?? "null");
      setUser(u);
      setAuthReady(true); // 🔐 Firebase is now fully initialized
    });

    return unsub;
  }, []);

  // 🧠 Backend onboarding gate
  // 🧠 Backend onboarding gate
  useEffect(() => {
    if (!authReady || !user) return;

    // ⛔ Do NOT run backend logic until email is verified
    if (!user.emailVerified) {
      console.log("⏸ Backend check skipped — email not verified");
      return;
    }

    async function checkUserState() {
      try {
        console.log("🟡 Checking backend state");

        const token = await user.getIdToken(true);
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("🟢 Backend user:", data);

        if (!data.acceptedTerms) {
          router.replace("/(app)/terms");
          return;
        }

        if (!data.profileCompleted) {
          router.replace("/profile");
          return;
        }

        setCheckingBackend(false);
      } catch (e) {
        console.error("Failed to verify user state", e);
        setCheckingBackend(false);
      }
    }

    checkUserState();
  }, [authReady, user]);

  useEffect(() => {
    console.log("🧪 Auth persistence check");
    console.log("Current user at boot:", auth.currentUser);
  }, []);

  // ✅ NEVER return null
  if (!authReady || checkingBackend) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/signInScreen" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🔵 CENTER FLOATING TAB */}
      <Tabs.Screen
        name="lookup"
        options={{
          title: "New",
          tabBarButton: (props) => <NewTabButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="tracker"
        options={{
          title: "Tracker",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🔒 HIDE NESTED ROUTES FROM TAB BAR */}
      <Tabs.Screen name="lookup/saved" options={{ href: null }} />
      {/* <Tabs.Screen name="lookup/trip-planner" options={{ href: null }} /> */}

      <Tabs.Screen name="explore/trip/[tripId]" options={{ href: null }} />
      <Tabs.Screen
        name="explore/trip/[tripId]/add-destination"
        options={{ href: null }}
      />

      <Tabs.Screen name="profile/about" options={{ href: null }} />
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
      <Tabs.Screen name="profile/support" options={{ href: null }} />
      <Tabs.Screen name="profile/logout" options={{ href: null }} />
      <Tabs.Screen name="profile/faq/index" options={{ href: null }} />
      <Tabs.Screen name="profile/faq/list" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  newTabWrapper: {
    alignItems: "center",
    justifyContent: "center",
    top: -18, // lifts the button
  },

  newTabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  newTabLabel: {
    fontSize: 11,
    marginTop: 4,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
