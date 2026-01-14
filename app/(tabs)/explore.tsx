import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for the country list
const COUNTRIES = [
  { id: '1', name: 'South Africa' },
  { id: '2', name: 'Dominican Republic' },
  { id: '3', name: 'United Arab Emirates' },
  { id: '4', name: 'Thailand' },
  { id: '5', name: 'Ghana' },
  { id: '6', name: 'Tanzania' },
  { id: '7', name: 'Rwanda' },
  { id: '8', name: 'Egypt' },
  { id: '9', name: 'Kenya' },
  { id: '10', name: 'Nigeria' },
  { id: '11', name: 'Uganda' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  // Filtering logic for the search bar
  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visa Lookup</Text>
        <View style={{ width: 40 }} /> {/* Layout balancer */}
      </View>

      <View style={styles.content}>
        {/* Passport Source Selection */}
        <Text style={styles.label}>I hold a passport from</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>United States</Text>
          <Ionicons name="chevron-down" size={20} color="#AAA" />
        </TouchableOpacity>

        {/* Destination Search Input */}
        <Text style={styles.label}>I am traveling to</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#AAA" style={{ marginRight: 10 }} />
          <TextInput 
            placeholder="Search destination..." 
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#AAA"
            style={styles.input}
          />
        </View>

        {/* Scrollable Country List */}
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.countryItem}
              onPress={() => console.log(`Selected: ${item.name}`)}
            >
              <Text style={styles.countryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 100 }} // Space for tab bar
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', flex: 1 },
  content: { flex: 1, paddingHorizontal: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8, color: '#000' },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
  },
  dropdownText: { fontSize: 16, color: '#333' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 16,
    borderRadius: 14,
    height: 54,
    marginBottom: 10,
  },
  input: { flex: 1, fontSize: 16, color: '#000' },
  countryItem: { paddingVertical: 18 },
  countryName: { fontSize: 16, color: '#333', fontWeight: '500' },
  separator: { height: 1, backgroundColor: '#F0F0F0' }
});