import { signUp } from "@/firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { useGoogleAuth } from "@/firebase/googleAuth";
import { useRouter } from "expo-router";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacing } from "../theme";

export default function SignUpScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState(""); // UI only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { promptAsync, handleGoogleResponse } = useGoogleAuth();

useEffect(() => {
  handleGoogleResponse();
  
}, []);


  async function handleSignUp() {
    try {
      await signUp(email, password);

      const user = auth.currentUser;
      if (!user) throw new Error("User not found");

      await sendEmailVerification(user);

      router.replace("/verify-email");
    } catch (err: any) {
      alert(err.message || "Sign up failed");
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <Image
          source={require("../../assets/images/header.png")}
          style={styles.logo}
        />
        <Text style={styles.appTitle}>VisaTrack</Text>
      </View>

      <Text style={styles.screenTitle}>Create your VisaTrack Account</Text>

      {/* Full Name (UX only for now) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="John Doe"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="************"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Sign up */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
        <Text style={styles.primaryButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerWrap}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Google */}
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => promptAsync()}
      >
        <Image
          source={require("../../assets/images/google.png")}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signInScreen")}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },

  logo: {
    width: 36,
    height: 36,
    marginRight: 6,
  },

  appTitle: {
    fontSize: 22,
    fontWeight: '700',
  },

  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },

  inputGroup: {
    marginBottom: spacing.md,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.textPrimary,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    backgroundColor: '#fff',
  },

  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  orText: {
    marginHorizontal: 10,
    color: colors.muted,
  },

  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: '#fff',
  },

  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },

  socialText: {
    fontSize: 15,
    fontWeight: '500',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },

  footerText: {
    fontSize: 14,
  },

  link: {
    color: colors.primary,
    fontWeight: '600',
  },
});
