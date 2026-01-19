import { auth } from "@/firebase/firebase.config";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TrackerTestScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    initTest();
  }, []);

  async function initTest() {
    try {
      console.log("🟡 Tracker test init");
      await createTestTrip();
      await fetchTrips();
    } catch (err: any) {
      console.error("❌ Init test error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function getAuthToken() {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    console.log("🟢 Firebase user:", user.uid);
    const token = await user.getIdToken(true);
    console.log("🟢 Firebase token acquired");

    return token;
  }

  async function createTestTrip() {
    console.log("🟡 Creating test trip");

    const token = await getAuthToken();

    const res = await fetch(`${API_URL}/trips`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test Trip",
        startDate: "2026-03-01",
        endDate: "2026-03-15",
        description: "Testing trip creation",
      }),
    });

    console.log("🟡 Create trip status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Create trip error body:", text);
      throw new Error("Failed to create test trip");
    }

    const createdTrip = await res.json();
    console.log("🧳 Trip created:", createdTrip._id);
  }

  async function fetchTrips() {
    console.log("🟡 Fetching trips");

    const token = await getAuthToken();

    const res = await fetch(`${API_URL}/trips`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🟡 Fetch trips status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fetch trips error body:", text);
      throw new Error("Failed to fetch trips");
    }

    const data = await res.json();
    console.log("🧳 Trips raw response:", data);

    if (!Array.isArray(data)) {
      throw new Error("Trips response is not an array");
    }

    setTrips(data);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        Tracker Test Screen{" "}
      </Text>

      {loading && <Text>Loading trips...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {!loading && !error && (
        <>
          <Text style={{ marginTop: 16 }}>Trips fetched: {trips.length}</Text>

          {trips.map((trip) => (
            <View
              key={trip._id}
              style={{
                marginTop: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
              }}
            >
              <Text>Title: {trip.title}</Text>
              <Text>Status: {trip.status}</Text>
              <Text>Purpose: {trip.purpose || "N/A"}</Text>
              <Text>
                Dates: {trip.startDate} → {trip.endDate}
              </Text>
              <Text>
                Feasibility: {trip.feasibilityStatus || "NOT_ANALYZED"}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
