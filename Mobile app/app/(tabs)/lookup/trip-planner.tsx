import AppInput from "@/components/AppInput";
import PrimaryButton from "@/components/PrimaryButton";
import { colors } from "@/constants";
import { createTrip } from "@/services/trip.service";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function TripPlanner() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateTrip() {
    if (!title || !startDate || !endDate) {
      Alert.alert("Missing fields", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const trip = await createTrip({
        title,
        startDate,
        endDate,
      });

      router.push({
        pathname: "/(tabs)/explore/trip/[tripId]",
        params: { tripId: trip._id },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppInput
        styles={{}}
        placeholder="Trip title"
        onChangeText={setTitle}
        placeholderTextColor={colors.black}
      />
      <AppInput
        placeholder="Start date (YYYY-MM-DD)"
        onChangeText={setStartDate}
        placeholderTextColor={colors.black}
      />
      <AppInput
        placeholder="End date (YYYY-MM-DD)"
        onChangeText={setEndDate}
        placeholderTextColor={colors.black}
      />

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
