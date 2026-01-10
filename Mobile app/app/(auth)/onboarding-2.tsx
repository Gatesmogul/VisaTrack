import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/button";
import { colors } from "../../constants/colors";

export default function Onboarding2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/onboarding2.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Your Passport, your Key</Text>

      <Text style={styles.subtitle}>
        Simply add your passport details and receive travel info that fits your journey.
      </Text>

      <Button
        title="Next"
        onPress={() => router.push("/onboarding-3")}
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
