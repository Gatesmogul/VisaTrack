import { StyleSheet, Text, View } from "react-native";


export function SavedRequirements({ data }: { data: any[] }) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Saved Requirements</Text>
        <Text style={styles.sectionAction}>Edit</Text>
      </View>

      <View style={styles.cardRow}>
        {data.map((item, index) => (
          <View key={index} style={styles.visaCard}>
            <Text style={styles.visaCountry}>{item.country}</Text>
            <Text style={styles.visaType}>{item.type}</Text>

            <View style={styles.visaBadge}>
              <Text style={styles.visaBadgeText}>{item.duration}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    cardRow: {
    flexDirection: "row",
    gap: 12,
  },

  visaCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  visaCountry: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  visaType: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 4,
  },

  visaBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E6F9EF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  visaBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },

  bottomSpacing: {
    height: 80,
  },
   sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  sectionAction: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "500",
  },
});