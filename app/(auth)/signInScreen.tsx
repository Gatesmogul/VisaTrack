import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { radius } from "../../constants/radius";
import { spacing } from "../../constants/spacing";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back to VisaTrack</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.primaryButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("./(auth)/signUpScreen")}
      >
        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text style={styles.link}>Sign up</Text>
        </Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
      
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialText}>Continue with Facebook</Text>
            </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 17,
    fontWeight: "400",
    marginBottom: 24,
    marginTop: 40,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 60,
  },
  link: {
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 24,
  },
   socialButton: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      borderRadius: radius.md,
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    socialText: {
      fontWeight: '500',
    },
});
