import { getMe } from "@/services/user.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image, Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { EmptyRecentLookups } from "../../components/EmptyRecentLookups";
import { EmptySavedRequirements } from "../../components/EmptySavedRequirements";
import { RecentLookups } from "../../components/RecentLookups";
import { SavedRequirements } from "../../components/SavedRequirements";
import { VisaLookupCard } from "../../components/VisaLookupCard";

export default function HomeScreen() {
  // FROM YOUR EXISTING FLOW
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState (0)

  useEffect(() => {
    getMe().then(setUser).catch(console.error);
    setUnreadCount(0)
  }, []);

  if (!user) return null; 

  const savedRequirements: any[] = []; // fetched
  const recentLookups: any[] = []; // fetched

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerleft}>
          <Text style={styles.hi}>Hi</Text>
          <Text style={styles.name}>{user.fullName}</Text>
        </View>
        <View style={styles.headerRow}>
  <Image source={require("../../assets/images/logo-1.png")} />

  <Pressable onPress={() => router.push("../notifications")}>
    <Ionicons name="notifications-outline" size={24} />
    {unreadCount > 0 && <View style={styles.badge} />}
  </Pressable>
</View>

      </View>

      {/* VISA LOOKUP — ALWAYS */}
      <VisaLookupCard />

      {/* SAVED REQUIREMENTS */}
      {savedRequirements.length === 0 ? (
        <EmptySavedRequirements />
      ) : (
        <SavedRequirements data={savedRequirements} />
      )}

      {/* RECENT LOOKUPS */}
      {recentLookups.length === 0 ? (
        <EmptyRecentLookups />
      ) : (
        <RecentLookups data={recentLookups} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 20,
    marginBottom: 10,
  },
headerleft:{},
  hi: {
    fontSize: 14,
    color: "#6B7280",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#fff"
  }
});

