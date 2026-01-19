import { HomeSkeleton } from "@/components/HomeSkeleton";
import { getSavedRequirements, removeSavedRequirement } from "@/services/visa";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function SavedRequirementsScreen() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSavedRequirements()
      .then(setSaved)
      .finally(() => setLoading(false));
  }, []);

  function rerunLookup(req: any) {
    router.push({
      pathname: "/(tabs)/lookup",
      params: {
        passportId: req.passportCountry._id,
        destinationId: req.destinationCountry._id,
        travelPurpose: req.travelPurpose,
      },
    });
  }

  async function unsave(savedId: string) {
    await removeSavedRequirement(savedId);
    setSaved((prev) => prev.filter((i) => i._id !== savedId));
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Saved Requirements</Text>

      {loading ? (
        <HomeSkeleton />
      ) : saved.length === 0 ? (
        <Text style={styles.empty}>No saved requirements</Text>
      ) : (
        saved.map((item) => {
          const req = item.visaRequirement;

          return (
            <View key={item._id} style={styles.card}>
              <Pressable onPress={() => rerunLookup(req)}>
                <View style={styles.row}>
                  <Text style={styles.flags}>
                    {req.passportCountry.flag} →{" "}
                    {req.destinationCountry.flag}
                  </Text>

                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {req.visaType.replace("_", " ")}
                    </Text>
                  </View>
                </View>

                <Text style={styles.purpose}>
                  {req.travelPurpose}
                </Text>
              </Pressable>

              <Pressable onPress={() => unsave(item._id)}>
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  empty: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flags: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  purpose: {
    marginTop: 6,
    color: "#374151",
  },
  remove: {
    marginTop: 8,
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600",
  },
});
