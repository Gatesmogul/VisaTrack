import { ActivityIndicator, View } from "react-native";

export default function Loader() {
  return (
    <View style={{ padding: 8 }}>
      <ActivityIndicator size="small" />
    </View>
  );
}
