import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { auth } from "../../firebase/firebase.config";
import { usePushNotifications } from "../../firebase/usePushNotifications";

export default function TabLayout() {
  usePushNotifications();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/signInScreen" />;
  if (!user.emailVerified)
    return <Redirect href="/(auth)/verify-email" />;

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
