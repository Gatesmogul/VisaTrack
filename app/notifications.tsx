import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define the shape of a notification
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isUnread: boolean;
}

const DATA: NotificationItem[] = [
  {
    id: '1',
    title: 'Welcome to Visa Track!',
    message: 'This is where you’ll receive updates about your visa applications and helpful reminders.',
    isUnread: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationCard}>
      <View style={styles.iconContainer}>
        <View style={styles.blueIconBg}>
          <Ionicons name="id-card" size={20} color="#4A90E2" />
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#4A90E2" />
          </View>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.notifTitle}>{item.title}</Text>
        <Text style={styles.notifMessage}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center title */}
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.unreadText}>Unread</Text>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Mark All As Read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  unreadText: { fontSize: 18, color: '#888', fontWeight: '600' },
  markReadText: { fontSize: 16, color: '#4A90E2', fontWeight: 'bold' },
  listContent: { paddingHorizontal: 20 },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    // Shadow for that "lifted" look in your image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: { marginRight: 15 },
  blueIconBg: {
    width: 45,
    height: 45,
    backgroundColor: '#EBF3FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  textContainer: { flex: 1 },
  notifTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  notifMessage: { fontSize: 14, color: '#777', lineHeight: 20 },
});