import AppInput from "@/components/AppInput";
import PrimaryButton from "@/components/PrimaryButton";
import { addDestinationToTrip } from "@/services/tripDestination";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function AddDestinationScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const [countryId, setCountryId] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [travelPurpose, setTravelPurpose] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!tripId || !countryId || !entryDate || !exitDate || !travelPurpose) {
      Alert.alert("Missing fields", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await addDestinationToTrip(tripId, {
        countryId,
        entryDate,
        exitDate,
        travelPurpose,
      });

      Alert.alert("Added", "Destination added to trip");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to add destination");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Destination</Text>

      {/* TEMP INPUT — later replace with CountryPicker */}
      <AppInput
        placeholder="Country ID"
        onChangeText={setCountryId}
      />

      <AppInput
        placeholder="Entry date (YYYY-MM-DD)"
        onChangeText={setEntryDate}
      />

      <AppInput
        placeholder="Exit date (YYYY-MM-DD)"
        onChangeText={setExitDate}
      />

      <AppInput
        placeholder="Purpose (TOURISM, BUSINESS, TRANSIT)"
        onChangeText={setTravelPurpose}
      />

      <PrimaryButton
        title="Add Destination"
        onPress={handleSubmit}
        loading={loading}
      />

      <Pressable onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  cancel: {
    marginTop: 16,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
});
