import { getTripById } from "@/services/trip.service";
import { getTripDestinations } from "@/services/tripDestination";
import { startVisaApplication } from "@/services/visaApplication.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TripDetailScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const [trip, setTrip] = useState<any | null>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleStartVisa = async (tripDestinationId: string) => {
    try {
      const application = await startVisaApplication(tripDestinationId);

      router.push({
        pathname: "/visa-application/[id]",
        params: { id: application._id },
      });
    } catch (err: any) {
      Alert.alert(
        "Unable to start application",
        err.message || "Please try again",
      );
    }
  };

  useEffect(() => {
    if (!tripId) return;

    Promise.all([getTripById(tripId), getTripDestinations(tripId)])
      .then(([tripRes, destRes]) => {
        setTrip(tripRes);
        setDestinations(Array.isArray(destRes) ? destRes : []);
      })
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{trip.title}</Text>
        <Text style={styles.dates}>
          {new Date(trip.startDate).toDateString()} →{" "}
          {new Date(trip.endDate).toDateString()}
        </Text>
      </View>

      {/* DESTINATIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destinations</Text>

        {destinations.length === 0 ? (
          <Text style={styles.emptyText}>No destinations added yet</Text>
        ) : (
          [...destinations]
            .sort(
              (a, b) =>
                new Date(a.entryDate).getTime() -
                new Date(b.entryDate).getTime(),
            )
            .map((dest) => (
              <View key={dest._id} style={styles.card}>
                <Text style={styles.country}>{dest.countryId?.name}</Text>

                <Text style={styles.meta}>
                  {new Date(dest.entryDate).toDateString()} →{" "}
                  {new Date(dest.exitDate).toDateString()}
                </Text>

                <Text style={styles.meta}>Purpose: {dest.travelPurpose}</Text>

                <View
                  style={[
                    styles.badge,
                    dest.visaRequired ? styles.badgeRequired : styles.badgeFree,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      dest.visaRequired
                        ? styles.badgeTextRequired
                        : styles.badgeTextFree,
                    ]}
                  >
                    {dest.visaRequired
                      ? "Visa required"
                      : "Visa-free / No action"}
                  </Text>
                </View>
                <View style={styles.feasibilityRow}>
                  <Text
                    style={[
                      styles.feasibilityBadge,
                      dest.feasibility.status === "FEASIBLE" && styles.feasible,
                      dest.feasibility.status === "RISKY" && styles.risky,
                      dest.feasibility.status === "IMPOSSIBLE" &&
                        styles.impossible,
                    ]}
                  >
                    {dest.feasibility.status.replace("_", " ")}
                  </Text>

                  <Text style={styles.feasibilityReason}>
                    {dest.feasibility.reason}
                  </Text>
                </View>

                {dest.visaRequired && (
                  <Pressable
                    style={styles.cta}
                    onPress={() => handleStartVisa(dest._id)}
                  >
                    <Text style={styles.ctaText}>Start Visa Application</Text>
                  </Pressable>
                )}
              </View>
            ))
        )}
      </View>

      {/* ADD DESTINATION */}
      <Pressable
        style={styles.addButton}
        onPress={() => router.push(`/explore/trip/${tripId}/add-destination`)}
      >
        <Text style={styles.addButtonText}>+ Add Destination</Text>
      </Pressable>
    </ScrollView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  dates: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 14,
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },

  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },

  country: {
    fontSize: 16,
    fontWeight: "600",
  },

  meta: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  badge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeRequired: {
    backgroundColor: "#FEF3C7",
  },

  badgeFree: {
    backgroundColor: "#ECFDF5",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  badgeTextRequired: {
    color: "#92400E",
  },

  badgeTextFree: {
    color: "#065F46",
  },

  /** ✅ FIXED CTA STYLES **/
  cta: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#111827",
    alignItems: "center",
  },

  ctaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  addButton: {
    margin: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111827",
    alignItems: "center",
  },

  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  feasibilityRow: {
    marginTop: 8,
  },

  feasibilityBadge: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  feasible: {
    backgroundColor: "#ECFDF5",
    color: "#065F46",
  },

  risky: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  impossible: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },

  feasibilityReason: {
    marginTop: 2,
    fontSize: 12,
    color: "#374151",
  },
});
