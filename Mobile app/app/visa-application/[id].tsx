import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function VisaApplicationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        Visa Application
      </Text>

      <Text style={{ marginTop: 8 }}>
        Application ID: {id}
      </Text>
    </View>
  );
}
