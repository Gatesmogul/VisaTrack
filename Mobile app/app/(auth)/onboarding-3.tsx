import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/button";
import { colors } from "../../constants/colors";

export default function Onboarding3() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/onboarding3.png")}
        style={styles.image}
      />

      <Text style={styles.title}>
        Secure Data for a Safer Journey
      </Text>

      <Text style={styles.subtitle}>
        Your information is protected so you can focus on planning your trip.
      </Text>

      <Button
        title="Get Started"
        onPress={() => router.push("/signUpScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "space-between",
  },
  image: {
    height: 400,
    width: "100%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: colors.muted,
  },
});
