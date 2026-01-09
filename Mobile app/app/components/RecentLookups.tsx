import { StyleSheet, Text, View } from "react-native";



export function RecentLookups({ data }: { data: any[] }) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Lookups</Text>
      </View>

      <View style={styles.cardRow}>
        {data.map((item, index) => (
          <View key={index} style={styles.visaCard}>
            <Text style={styles.visaCountry}>{item.country}</Text>
            <Text style={styles.visaType}>{item.type}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </View>
  );
}

const styles = StyleSheet.create({
    
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  emptyState: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },

  cardRow: {
    flexDirection: "row",
    gap: 12,
  },

  visaCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
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

  bottomSpacing: {
    height: 80,
  },
});