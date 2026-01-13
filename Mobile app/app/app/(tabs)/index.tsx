import { getMe } from "@/services/user";
import { fetchRecentLookups, getSavedRequirements } from "@/services/visa";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EmptyRecentLookups } from "../../components/EmptyRecentLookups";
import { EmptySavedRequirements } from "../../components/EmptySavedRequirements";
import { HomeSkeleton } from "../../components/HomeSkeleton";
import { RecentLookups } from "../../components/RecentLookups";
import { VisaLookupCard } from "../../components/VisaLookupCard";

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [recentLookups, setRecentLookups] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();

  function rerunLookup(visaRequirement: any) {
    router.push({
      pathname: "/(tabs)/lookup",
      params: {
        passportId: visaRequirement.passportCountry._id,
        passportCode: visaRequirement.passportCountry.code,
        destinationId: visaRequirement.destinationCountry._id,
        destinationCode: visaRequirement.destinationCountry.code,
        travelPurpose: visaRequirement.travelPurpose,
      },
    });
  }

  // Load saved requirements once
  useEffect(() => {
    getSavedRequirements()
      .then(setSaved)
      .finally(() => setSavedLoading(false));
  }, []);

  // Load user
  useEffect(() => {
    getMe().then(setUser).catch(console.error);
    setUnreadCount(0);
  }, []);

  // Reload recent lookups on focus
  useFocusEffect(
    useCallback(() => {
      setRecentLoading(true);
      fetchRecentLookups()
        .then(setRecentLookups)
        .finally(() => setRecentLoading(false));
    }, [])
  );

  if (!user) return null;

  const displayName =
    user.personal?.fullName ||
    user.email?.split("@")[0] ||
    "Traveler";

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hi}>Hi</Text>
          <Text style={styles.name}>{displayName}</Text>
        </View>

        <View style={styles.headerRow}>
          <Image source={require("../../assets/images/logo-1.png")} />
          <Pressable onPress={() => router.push("../notifications")}>
            <Ionicons name="notifications-outline" size={24} />
            {unreadCount > 0 && <View style={styles.badge} />}
          </Pressable>
        </View>
      </View>

      {/* VISA LOOKUP */}
      <VisaLookupCard />

      {/* SAVED REQUIREMENTS */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Requirements</Text>

          {saved.length > 3 && (
            <Pressable onPress={() => router.push("./saved")}>
  <Text style={styles.seeAll}>See all</Text>
</Pressable>

          )}
        </View>

        {savedLoading ? (
          <HomeSkeleton />
        ) : saved.length === 0 ? (
          <EmptySavedRequirements />
        ) : (
          saved.slice(0, 3).map((item) => (
            <SavedRequirementCard
              key={item._id}
              item={item}
              onPress={() => rerunLookup(item.visaRequirement)}
            />
          ))
        )}
      </View>

      {/* RECENT LOOKUPS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Lookups</Text>

        {recentLoading ? (
          <HomeSkeleton />
        ) : recentLookups.length === 0 ? (
          <EmptyRecentLookups />
        ) : (
          <RecentLookups data={recentLookups} />
        )}
      </View>
    </ScrollView>
  );
}

const SavedRequirementCard = memo(function SavedRequirementCard({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) {
  const req = item.visaRequirement;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardTopRow}>
        <Text style={styles.flags}>
          {req.passportCountry.flag} → {req.destinationCountry.flag}
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {req.visaType.replace("_", " ")}
          </Text>
        </View>
      </View>

      <Text style={styles.purpose}>{req.travelPurpose}</Text>
    </Pressable>
  );
});

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
    paddingVertical: 12,
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },

  section: {
    marginTop: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  flags: {
    fontSize: 16,
    fontWeight: "600",
  },

  // badge: {
  //   backgroundColor: "#EEF2FF",
  //   paddingHorizontal: 10,
  //   paddingVertical: 4,
  //   borderRadius: 999,
  // },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },

  purpose: {
    marginTop: 6,
    fontSize: 13,
    color: "#374151",
  },
});
