import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export function EmptySavedRequirements() {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Saved Requirements</Text>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No Saved Requirements</Text>
        <Text style={styles.emptyText}>
          Search for visa requirements and save them for quick access
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
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
});
