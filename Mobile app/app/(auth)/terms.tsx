// app/terms.tsx
import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { acceptTerms } from "../../services/user";

export default function Terms() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={styles.heading}>Terms & Conditions</Text>

        <Text style={styles.sectionTitle}>1. User Responsibilities</Text>
        <Text style={styles.text}>
          You are responsible for providing accurate...
        </Text>

        <Text style={styles.sectionTitle}>2. Data & Privacy</Text>
        <Text style={styles.text}>
          VisaTrack collects and stores personal information...
        </Text>

        <Text style={styles.sectionTitle}>3. Service Limitations</Text>
        <Text style={styles.text}>
          VisaTrack does not guarantee visa approval...
        </Text>

        <Text style={styles.sectionTitle}>4. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By tapping Agree, you confirm...
        </Text>

        <View style={styles.row}>
          <Checkbox value={accepted} onValueChange={setAccepted} />
          <Text style={{ marginLeft: 8 }}>
            I agree to the Terms & Conditions
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={!accepted}
          style={[styles.button, !accepted && styles.disabled]}
         onPress={async () => {
  await acceptTerms();
  router.push("/profile");
}}  
>
          <Text style={styles.buttonText}>I Agree & Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: "700", fontSize: 18, marginBottom: 10 },
  sectionTitle: { fontWeight: "600", marginTop: 14 },
  text: { marginTop: 4, color: "#333" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  footer: { padding: 20 },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
  },
  disabled: { opacity: 0.4 },
  buttonText: { color: "#fff", textAlign: "center" },
});
