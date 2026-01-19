import { getMyTrips } from "@/services/trip.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function TripListScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTrips()
      .then((data) => setTrips(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Trips</Text>

      {trips.length === 0 ? (
        <Text style={styles.empty}>No trips yet. Create your first trip.</Text>
      ) : (
        trips.map((trip) => (
          <Pressable
            key={trip._id}
            style={styles.card}
            onPress={() => router.push(`/(tabs)/explore/trip/${trip._id}`)}
          >
            <Text style={styles.tripTitle}>{trip.title}</Text>
            <Text style={styles.dates}>
              {new Date(trip.startDate).toDateString()} →{" "}
              {new Date(trip.endDate).toDateString()}
            </Text>
            <Text style={styles.status}>Status: {trip.status}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  empty: { color: "#6B7280" },

  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  tripTitle: { fontSize: 16, fontWeight: "600" },
  dates: { marginTop: 4, fontSize: 13, color: "#6B7280" },
  status: { marginTop: 4, fontSize: 12, color: "#374151" },
});
