import React from 'react';
import { StyleSheet, Text, View } from 'react-native';



export function EmptyRecentLookups() {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Lookups</Text>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No Recent Lookups</Text>
        <Text style={styles.emptyText}>
          Your recent visa searches will appear here
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
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
});
