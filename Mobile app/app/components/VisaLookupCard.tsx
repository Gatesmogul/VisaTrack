import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import { CountryPickerModal } from "./CountryPickerModal";

//const API_URL=process.env.EXPO_BASE_URL
export function VisaLookupCard() {
  const [citizenOf, setCitizenOf] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [openFor, setOpenFor] = useState<"citizen" | "destination" | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleLookup() {
    if (!citizenOf || !destination) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `https://your-api.com/api/visa/lookup?passportCountryId=${citizenOf.id}&destinationCountryId=${destination.id}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "No visa info found");
        return;
      }

      setResult(data.requirement);
    } catch (err) {
      setError("Failed to fetch visa info");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>Visa Lookup</Text>

        {/* Citizen Of */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setOpenFor("citizen")}
        >
          {citizenOf ? (
            <>
              <CountryFlag isoCode={citizenOf.code} size={18} />
              <Text style={styles.text}>{citizenOf.name}</Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Citizen of</Text>
          )}
        </TouchableOpacity>

        {/* Destination */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setOpenFor("destination")}
        >
          {destination ? (
            <>
              <CountryFlag isoCode={destination.code} size={18} />
              <Text style={styles.text}>{destination.name}</Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Destination</Text>
          )}
        </TouchableOpacity>

        {/* SEARCH BUTTON */}
        <TouchableOpacity
          style={[
            styles.searchBtn,
            (!citizenOf || !destination) && { opacity: 0.5 },
          ]}
          disabled={!citizenOf || !destination || loading}
          onPress={handleLookup}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchText}>Search Visa</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* RESULT */}
      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Visa Result</Text>
          <Text>Visa Type: {result.visaType}</Text>
          {result.visaFreeDays && (
            <Text>Visa-free stay: {result.visaFreeDays} days</Text>
          )}
          {result.visaCost && (
            <Text>
              Cost: {result.visaCost} {result.currency}
            </Text>
          )}
          <Text>
            Processing Time: {result.processingTimeMin}–
            {result.processingTimeMax} days
          </Text>
        </View>
      )}

      {/* ERROR */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CountryPickerModal
        visible={openFor !== null}
        onClose={() => setOpenFor(null)}
        onSelect={(country) => {
          if (openFor === "citizen") setCitizenOf(country);
          if (openFor === "destination") setDestination(country);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  text: {
    fontSize: 14,
    color: "#111827",
  },
  placeholder: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  searchBtn: {
    marginTop: 16,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  searchText: {
    color: "#FFF",
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  error: {
    color: "#DC2626",
    marginTop: 10,
    textAlign: "center",
  },
});
