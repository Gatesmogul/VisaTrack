import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { CountryPickerModal } from "../../components/CountryPickerModal";

export default function VisaLookupScreen() {
  const [citizenOf, setCitizenOf] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [openFor, setOpenFor] = useState<"citizen" | "destination" | null>(null);
  const [result, setResult] = useState<any>(null);

  async function checkVisa() {
    const res = await fetch(
      `https://your-api.com/visa/lookup?passport=${citizenOf._id}&destination=${destination._id}`
    );
    const data = await res.json();
    setResult(data);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Visa Lookup</Text>

      {/* CITIZEN */}
      <Pressable style={styles.input} onPress={() => setOpenFor("citizen")}>
        <Text style={citizenOf ? styles.text : styles.placeholder}>
          {citizenOf?.name || "Citizen of"}
        </Text>
      </Pressable>

      {/* DESTINATION */}
      <Pressable style={styles.input} onPress={() => setOpenFor("destination")}>
        <Text style={destination ? styles.text : styles.placeholder}>
          {destination?.name || "Destination"}
        </Text>
      </Pressable>

      {/* BUTTON */}
      <Pressable
        style={[
          styles.button,
          (!citizenOf || !destination) && { opacity: 0.4 },
        ]}
        disabled={!citizenOf || !destination}
        onPress={checkVisa}
      >
        <Text style={styles.buttonText}>Check Visa Requirements</Text>
      </Pressable>

      {/* RESULT */}
      {!result ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyText}>
            Start searching for visa requirements by entering a country name or destination above
          </Text>
        </View>
      ) : (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{result.visaType}</Text>
          <Text style={styles.resultText}>
            Stay up to {result.allowedStayDays} days
          </Text>
        </View>
      )}

      <CountryPickerModal
        visible={openFor !== null}
        onClose={() => setOpenFor(null)}
        onSelect={(country) => {
          if (openFor === "citizen") setCitizenOf(country);
          if (openFor === "destination") setDestination(country);
          setOpenFor(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },

  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  placeholder: {
    color: "#9CA3AF",
  },

  text: {
    color: "#111827",
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },

  empty: {
    marginTop: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  resultCard: {
    marginTop: 24,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
  },

  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  resultText: {
    fontSize: 14,
    color: "#374151",
    marginTop: 6,
  },
});
