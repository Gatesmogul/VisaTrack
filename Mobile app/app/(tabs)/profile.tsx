import { apiFetch } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Profile = {
  fullName: string;
  email: string;
  avatarUrl?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/users/me")
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Unable to load profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>My Profile</Text>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.emptyAvatar} />
          )}
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
        </View>

        <Text style={styles.subText}>Verified Member</Text>

        <Pressable
          style={styles.editBtn}
          onPress={() => router.push("/(tabs)/profile/edit")}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </Pressable>
      </View>

      {/* MENU */}
      <View style={styles.menu}>
        <MenuItem label="Contact Support" />
        <MenuItem label="Terms of Service" />
        <MenuItem label="Privacy Policy" />
        <MenuItem
          label="About us"
          onPress={() => router.push("/(tabs)/profile/about")}
        />

        {/* LOGOUT */}
        <MenuItem
          label="Log out"
          danger
          onPress={() => router.push("/(tabs)/profile/logout")}
        />
      </View>

      {/* FOOTER */}
      <Pressable
        style={styles.backHome}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text style={styles.backHomeText}>Back to home</Text>
      </Pressable>
    </View>
  );
}

/* ---------------------------------- */
/* MENU ITEM COMPONENT                */
/* ---------------------------------- */
function MenuItem({
  label,
  onPress,
  danger = false,
}: {
  label: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Text style={[styles.menuText, danger && styles.dangerText]}>
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={danger ? "#DC2626" : "#9CA3AF"}
      />
    </Pressable>
  );
}

/* ---------------------------------- */
/* STYLES                             */
/* ---------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  emptyAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E5E7EB",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  subText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  editBtn: {
    marginTop: 12,
    backgroundColor: "#60A5FA",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  menu: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuText: {
    fontSize: 14,
    color: "#111827",
  },
  dangerText: {
    color: "#DC2626",
    fontWeight: "600",
  },
  backHome: {
    marginTop: "auto",
    backgroundColor: "#60A5FA",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  backHomeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
