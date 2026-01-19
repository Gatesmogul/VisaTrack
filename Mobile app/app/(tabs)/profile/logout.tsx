import { auth } from "@/firebase/firebase.config";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

export default function LogoutScreen() {
 const handleLogout = async () => {
  await signOut(auth);
  router.replace("/(auth)/signInScreen");
};

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
      onPress={handleLogout}
      >
        Log Out
      </TouchableOpacity>
      <ActivityIndicator size="large" />
    </View>
  );
}
