import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/PrimaryButton";
import { resetPassword } from "../../firebase/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  async function handleReset() {
    try {
      await resetPassword(email);
      Alert.alert("Email sent", "Check your inbox for reset instructions.");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <AppInput placeholder="Email" onChangeText={setEmail} />
      <PrimaryButton title="Reset password" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
