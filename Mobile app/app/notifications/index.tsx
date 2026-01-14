import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Notification = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const res = await fetch("https://your-api.com/notifications", {
      headers: {
        Authorization: "Bearer TOKEN_HERE",
      },
    });
    const data = await res.json();
    setNotifications(data);
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* ACTION ROW */}
      <View style={styles.actions}>
        <Text style={styles.filter}>Unread ▾</Text>
        <Pressable>
          <Text style={styles.markAll}>Mark All As Read</Text>
        </Pressable>
      </View>

      {/* CONTENT */}
      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Welcome to Visa Track!</Text>
          <Text style={styles.emptyText}>
            This is where you’ll receive updates about your visa applications and helpful reminders.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.notification}>
              <View style={!item.isRead && styles.unreadDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationText}>{item.message}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  badge: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

  actions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  filter: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },

  markAll: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },

  empty: {
    marginTop: 40,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },

  notification: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
    marginTop: 6,
  },

  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  notificationText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
});
