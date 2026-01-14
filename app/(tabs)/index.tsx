import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RecentCityCard from '@/components/RecentCityCard';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // Set to 'false' to start with the Empty State (Home 1)
  // Set to 'true' to see the Dashboard (Home 2)
  const router = useRouter();
  const [hasApplications, setHasApplications] = useState(false);

  // --- VIEW 1: EMPTY STATE (HOME 1) ---
  if (!hasApplications) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.logoText}>VisaTrack</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
      onPress={() => {
        console.log("Navigating to notifications..."); // Add this to debug
        router.push('/notifications');
      }}
      style={{ padding: 5 }} // Increase tap area
    >
      <Ionicons name="notifications-outline" size={26} color="#444" />
    </TouchableOpacity>
          </View>
        </View>

        <View style={styles.emptyContent}>
          <Image
            source={require('@/assets/images/empty-state-illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>No Visa Application Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start tracking your visa <Text style={{ fontWeight: '700' }}>application</Text> here.
          </Text>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setHasApplications(true)}
          >
            <Text style={styles.mainButtonText}>Add New Application</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- VIEW 2: DASHBOARD (HOME 2) ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <View style={styles.logoRow}>
              <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
              <Text style={styles.logoText}>VisaTrack</Text>
            </View>
            <Text style={styles.greetingHi}>Hi</Text>
            <Text style={styles.greetingName}>Daniel</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity><Ionicons name="notifications-outline" size={26} color="#444" /></TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 15 }}><Ionicons name="settings-outline" size={26} color="#444" /></TouchableOpacity>
          </View>
        </View>

        {/* Blue Search Card */}
        <View style={styles.searchCard}>
          <View style={styles.visaLookupBadge}>
            <Ionicons name="globe-outline" size={14} color="#FFF" />
            <Text style={styles.badgeText}>VisaLookup</Text>
          </View>
          <Text style={styles.searchTitle}>Where to next?</Text>
          <Text style={styles.searchSubtitle}>Check visa requirements instantly.</Text>

          <View style={styles.whiteInputContainer}>
            <View style={styles.inputRow}>
              <Ionicons name="airplane-outline" size={20} color="#AAA" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.inputLabel}>CITIZEN OF</Text>
                <Text style={styles.inputValue}>United States <Ionicons name="chevron-down" size={14} /></Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.inputRow}>
              <Ionicons name="search-outline" size={20} color="#4A90E2" />
              <TextInput placeholder="Search Destination" style={styles.textInput} />
              <TouchableOpacity style={styles.goButton}>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Saved Requirements Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Requirements</Text>
          <TouchableOpacity><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          <RequirementCard country="Japan" type="TOURIST VISA" duration="90 Days" status="Visa Free" color="#E8F5E9" textColor="#4CAF50" />
          <RequirementCard country="Thailand" type="TRAVEL VISA" duration="1 Year" status="Apply..." color="#E3F2FD" textColor="#2196F3" />
        </ScrollView>

        {/* Recent Lookups Section */}
        <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 20 }]}>Recent Lookups</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          <RecentCityCard name="USA" image={require('@/assets/images/usa.png')} time="1d ago" />
          <RecentCityCard name="Germany" image={require('@/assets/images/germany.png')} time="1d ago" />
          {/* <RecentCityCard name="Vietnam" image={require('@/assets/images/vietnam.png')} time="2d ago" /> */}
        </ScrollView>

        {/* Padding for bottom to ensure nothing is cut off by the Tab Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- SUB-COMPONENTS ---

const RequirementCard = ({ country, type, duration, status, color, textColor }: any) => (
  <View style={styles.reqCard}>
    <Text style={styles.reqCountry}>{country}</Text>
    <Text style={styles.reqType}>{type}</Text>
    <View style={styles.badgeRow}>
      <View style={styles.infoBadge}><Text style={styles.infoBadgeText}>{duration}</Text></View>
      <View style={[styles.infoBadge, { backgroundColor: color }]}><Text style={{ color: textColor, fontSize: 12, fontWeight: '600' }}>{status}</Text></View>
    </View>
  </View>
);

// --- STYLES ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'flex-start' },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  logo: { width: 28, height: 28, marginRight: 8 },
  logoText: { fontWeight: '900', fontSize: 22, color: '#000' },
  headerIcons: { flexDirection: 'row', marginTop: 5 },

  // Empty State Styles
  emptyContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  illustration: { width: '100%', height: 280, marginBottom: 30 },
  emptyTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  emptySubtitle: { fontSize: 16, color: '#777', textAlign: 'center', marginBottom: 40 },
  mainButton: { backgroundColor: '#57A4FF', width: '100%', paddingVertical: 18, borderRadius: 15, alignItems: 'center', elevation: 4, shadowColor: '#57A4FF', shadowOpacity: 0.3, shadowRadius: 10 },
  mainButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  // Dashboard Styles
  greetingHi: { fontSize: 16, color: '#666' },
  greetingName: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 5 },

  // Search Card
  searchCard: { margin: 20, padding: 20, backgroundColor: '#4A90E2', borderRadius: 25, elevation: 10, shadowColor: '#4A90E2', shadowOpacity: 0.4, shadowRadius: 10 },
  visaLookupBadge: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start', alignItems: 'center', marginBottom: 15 },
  badgeText: { color: '#FFF', fontWeight: '600', marginLeft: 5, fontSize: 12 },
  searchTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  searchSubtitle: { color: '#E3F2FD', fontSize: 14, marginBottom: 20 },

  whiteInputContainer: { backgroundColor: '#FFF', borderRadius: 18, padding: 5 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  inputLabel: { fontSize: 10, color: '#AAA', fontWeight: '700', marginBottom: 2 },
  inputValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 15 },
  textInput: { flex: 1, fontSize: 16, color: '#333', marginLeft: 10 },
  goButton: { backgroundColor: '#4A90E2', width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  // Sections
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  editLink: { color: '#4A90E2', fontWeight: '600' },
  horizontalScroll: { paddingLeft: 20, paddingRight: 20, paddingBottom: 20 },

  // Requirement Card
  reqCard: { backgroundColor: '#FFF', width: 140, padding: 15, borderRadius: 20, marginRight: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  reqCountry: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  reqType: { fontSize: 12, color: '#999', marginBottom: 12 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  infoBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 5, marginBottom: 5, backgroundColor: '#F5F5F5' },
  infoBadgeText: { fontSize: 10, fontWeight: '600', color: '#555' },
});