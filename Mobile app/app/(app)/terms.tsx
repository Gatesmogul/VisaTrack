// app/(app)/terms.tsx
// app/(app)/terms.tsx
import { auth } from "@/firebase/firebase.config";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { acceptTerms } from "../../services/user";

export default function TermsScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!accepted || loading) return;

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        alert("Not authenticated");
        return;
      }

      await user.getIdToken(true);
      await acceptTerms();

      router.replace("/(auth)/profile");
    } catch (err) {
      console.error("Failed to accept terms", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </Pressable>

        <Text style={styles.headerTitle}>Terms & Conditions</Text>

        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={22} />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>

        <Text style={styles.paragraph}>
          By using VisaTrack, you agree to comply with and be bound by these
          Terms and Conditions. These terms govern your access to and use of the
          VisaTrack mobile application and services.
        </Text>

        <Text style={styles.sectionTitle}>1. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          You are responsible for providing accurate, complete, and up-to-date
          information during profile creation and visa tracking. VisaTrack is
          not responsible for delays or issues caused by incorrect or false
          information.
        </Text>

        <Text style={styles.sectionTitle}>2. Data & Privacy</Text>
        <Text style={styles.paragraph}>
          VisaTrack collects and stores personal information such as
          identification and passport details solely for visa tracking purposes.
          Your data is handled securely and in accordance with applicable data
          protection regulations.
        </Text>

        <Text style={styles.sectionTitle}>3. Service Limitations</Text>
        <Text style={styles.paragraph}>
          VisaTrack does not guarantee visa approval or processing timelines.
          The platform serves as a tracking and informational tool and is not
          affiliated with any embassy or immigration authority.
        </Text>

        <Text style={styles.sectionTitle}>4. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By tapping “I Agree”, you confirm that you have read, understood, and
          accepted these Terms and Conditions.
        </Text>

        {/* Checkbox */}
        <View style={styles.checkboxRow}>
          <Checkbox value={accepted} onValueChange={setAccepted} />
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Pressable
          disabled={!accepted || loading}
          onPress={handleAccept}
          style={[styles.primaryBtn, (!accepted || loading) && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>I agree & Continue</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 4,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
  },

  link: {
    color: "#2979FF",
    fontWeight: "500",
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,
  },

  cancelText: {
    textAlign: "center",
    fontWeight: "500",
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#4F8DF7",
    borderRadius: 10,
    paddingVertical: 14,
  },

  disabled: {
    opacity: 0.5,
  },

  primaryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
