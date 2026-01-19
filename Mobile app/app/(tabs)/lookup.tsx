import { CountryPickerModal } from "@/components/CountryPickerModal";
import { saveVisaRequirement } from "@/services/visa";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const TRAVEL_PURPOSES = ["tourism", "business", "study", "transit", "work"];

export default function VisaLookupScreen() {
  const [citizenOf, setCitizenOf] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [travelPurpose, setTravelPurpose] = useState<string | null>(null);
  const [openFor, setOpenFor] = useState<"citizen" | "destination" | null>(
    null,
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ PARAM CONTRACT (from Home rerun)
  const params = useLocalSearchParams<{
    passportId?: string;
    passportCode?: string;
    destinationId?: string;
    destinationCode?: string;
    travelPurpose?: string;
  }>();

  // ✅ Auto-run ONLY when coming from Home
  useEffect(() => {
    if (params.passportId && params.destinationId && params.travelPurpose) {
      const citizen = {
        _id: params.passportId,
        code: params.passportCode,
      };

      const dest = {
        _id: params.destinationId,
        code: params.destinationCode,
      };

      setCitizenOf(citizen);
      setDestination(dest);
      setTravelPurpose(params.travelPurpose);

      setTimeout(() => {
        runLookup(citizen, dest, params.travelPurpose);
      }, 0);
    }
  }, [params.passportId, params.destinationId, params.travelPurpose]);

  async function runLookup(
    citizen = citizenOf,
    dest = destination,
    purpose = travelPurpose,
  ) {
    if (!citizen || !dest || !purpose) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `${API_URL}/visa/lookup` +
          `?passportCountryId=${citizen._id}` +
          `&destinationCountryId=${dest._id}` +
          `&travelPurpose=${purpose}`,
      );

      const data = await res.json();
      console.log("VISA LOOKUP RESPONSE:", data);
      setResult(data);
    } finally {
      setLoading(false);
    }
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

      {/* TRAVEL PURPOSE */}
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.purposeLabel}>Travel Purpose</Text>

        {TRAVEL_PURPOSES.map((purpose) => (
          <Pressable
            key={purpose}
            style={[
              styles.input,
              travelPurpose === purpose && styles.purposeActive,
            ]}
            onPress={() => setTravelPurpose(purpose)}
          >
            <Text style={styles.text}>{purpose}</Text>
          </Pressable>
        ))}
      </View>

      {/* BUTTON */}
      <Pressable
        style={[
          styles.button,
          (!citizenOf || !destination || !travelPurpose) && { opacity: 0.4 },
        ]}
        disabled={!citizenOf || !destination || !travelPurpose || loading}
        onPress={() => runLookup()}
      >
        <Text style={styles.buttonText}>
          {loading ? "Checking..." : "Check Visa Requirements"}
        </Text>
      </Pressable>

      {/* RESULT */}
      {!result ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyText}>
            Select a passport, destination and travel purpose to check visa
            requirements.
          </Text>
        </View>
      ) : (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{result.requirement.visaType}</Text>
          <Text style={styles.resultText}>
            Stay up to {result.requirement.allowedStayDays} days
          </Text>

          <Pressable
            style={styles.saveButton}
            onPress={() => saveVisaRequirement(result.requirement._id)}
          >
            <Text style={styles.saveText}>Save Requirement</Text>
          </Pressable>
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

  purposeLabel: {
    fontWeight: "500",
    marginBottom: 6,
  },

  purposeActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EEF2FF",
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

  saveButton: {
    marginTop: 12,
    backgroundColor: "#EEF2FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  saveText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
