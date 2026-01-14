import { getFirebaseIdToken } from "@/firebase/getIdToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileSetupLoading() {
  const router = useRouter();

  useEffect(() => {
    async function setupAccount() {
      try {
        const personal = JSON.parse(await AsyncStorage.getItem("profile") || "{}");
        const contact = JSON.parse(await AsyncStorage.getItem("contact") || "{}");
        const passport = JSON.parse(await AsyncStorage.getItem("passport") || "{}");

        const token = await getFirebaseIdToken();

        await fetch(`${API_URL}/users/profile/passport`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ personal, contact, passport })
        });

        // Clear temp storage
        await AsyncStorage.multiRemove(["profile", "contact", "passport"]);

        // Go to Sign In
        router.replace("/signInScreen");
      } catch (e) {
        console.error(e);
      }
    }

    setupAccount();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>
        Setting up your account… please wait
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    marginTop: 12,
    fontSize: 14
  }
});
