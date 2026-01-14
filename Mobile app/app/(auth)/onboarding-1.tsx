import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/button";
import { colors } from "../../constants/colors";

export default function Onboarding1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
       source={require("../../assets/images/onboarding1.png")}
        style={styles.image}
      />

      <Text style={styles.title}>
        Your window to the world starts here
      </Text>

      <Text style={styles.subtitle}>
        Discover where you can go and what you need with clear guidance.
      </Text>

      <Button
        title="Next"
        onPress={() => router.push("/onboarding-2")}
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
