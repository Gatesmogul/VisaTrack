import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/PrimaryButton";
import { createTrip } from "../../services/trip";
import { useRouter } from "expo-router";

export default function TripPlanner() {
  const router = useRouter();

  const [country, setCountry] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateTrip() {
    if (!country || !entryDate || !exitDate) {
      Alert.alert("Missing fields", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await createTrip({
        country,
        entryDate,
        exitDate,
        purpose,
      });

      Alert.alert("Trip added", "Your trip has been saved");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppInput placeholder="Destination country" onChangeText={setCountry} />
      <AppInput placeholder="Entry date (YYYY-MM-DD)" onChangeText={setEntryDate} />
      <AppInput placeholder="Exit date (YYYY-MM-DD)" onChangeText={setExitDate} />
      <AppInput placeholder="Purpose (tourism, business)" onChangeText={setPurpose} />

      <PrimaryButton
        title="Create Trip"
        onPress={handleCreateTrip}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
