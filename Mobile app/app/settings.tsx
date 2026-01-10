import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  const user = {
    fullName: "Adekunle Gates",
    verified: true,
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    passportCountry: "Nigeria",
    passportFlag: "🇳🇬",
    currency: "NGN (₦)",
    language: "English",
    email: "adekunlegates@gmail.com",
    dateFormat: "26 March 1988",
    defaultTrip: "Trip Timeline",
  };

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile */}
        <View style={styles.profileRow}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />

          <View style={styles.profileText}>
            <Text style={styles.name}>
              {user.fullName}{" "}
              {user.verified && <Text style={styles.verified}>✔</Text>}
            </Text>
            <Text style={styles.verifiedText}>Verified Member</Text>
          </View>
        </View>

        {/* Edit Profile */}
        <Pressable
          style={styles.editButton}
          onPress={() => {
            // Navigate only when a real screen exists
            // router.push("/(tabs)/personalinformationscreen");
          }}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>

        {/* Account Header */}
        <Text style={styles.sectionHeader}>Account</Text>

        <InfoRow
          label={`${user.passportFlag} Passport Country`}
          value={user.passportCountry}
        />
        <InfoRow label="Currency" value={user.currency} />
        <InfoRow label="Language" value={user.language} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Date Format" value={user.dateFormat} />
        <InfoRow label="Default Trip" value={user.defaultTrip} />

        <Text style={styles.notification}>Notification</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  verified: {
    color: "#4DA3FF",
    fontSize: 16,
  },
  verifiedText: {
    marginTop: 4,
    fontSize: 13,
    color: "#4DA3FF",
  },
  editButton: {
    backgroundColor: "#4DA3FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 25,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  rowLabel: {
    fontSize: 14,
    color: "#666",
  },
  rowValue: {
    fontSize: 16,
    color: "#000",
    marginTop: 4,
  },
  notification: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
