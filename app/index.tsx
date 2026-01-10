import { styles } from '../theme';
import React, { useState } from 'react';
import {router} from 'expo-router';
//import { View, Text, StyleSheet, Image, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateDropdown from './date';
import CountryDropdown from './country';
import PassportNumberInput from './passportno';

const RequiredLabel = ({ label }: { label: string }) => (
  <Text style={styles.label}>
    {label} <Text style={styles.asterisk}>*</Text>
  </Text>
);

export default function ProgressHeader() {
  const [issueCountry, setIssueCountry] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState('');

    const countries = [
    { label: 'Nigeria', value: 'NG' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'Canada', value: 'CA' },
    { label: 'Germany', value: 'DE' },
    { label: 'France', value: 'FR' },
    { label: 'India', value: 'IN' },
    { label: 'China', value: 'CN' },
    { label: 'Brazil', value: 'BR' },
    { label: 'South Africa', value: 'ZA' },
    { label: 'Ghana', value: 'GH' },
    { label: 'Kenya', value: 'KE' },
    { label: 'Australia', value: 'AU' },
  ].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* --- FIXED SECTION (This will NOT scroll) --- */}
      <View style={styles.progcontainer}>
        <Text style={styles.progtitle}>Passport details</Text>
        <Text style={styles.progstepText}>Step 3 of 3</Text>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progsegment, styles.completed]} />
          <View style={styles.progseparator} />
          <View style={[styles.progsegment, styles.completed]} />
          <View style={styles.progseparator} />
          <View style={[styles.progsegment, styles.progactive]} />
        </View>
      </View>
      {/* ------------------------------------------- */}

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progLogo}>
          <Image 
            source={require('../assets/images/passpo.png')}                 
            style={styles.passpoLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headText}>
          <Text style={styles.passinf}>Passport Information</Text>
          <Text style={styles.lonText}>
            Enter your passport details exactly as they appear on your document
          </Text>
        </View>

        {/* Input Fields Container */}
        <View style={localStyles.container}>
          <PassportNumberInput 
            label="Passport Number"
            required={true}
            value={passportNumber}
            onChangeText={(text) => setPassportNumber(text)}
          />

          <CountryDropdown 
            label='Country of Issue'
            required={true}
            onSelect={(value) => setIssueCountry(value)}
          />

          <DateDropdown
            label={<RequiredLabel label="Issue Date" />}
            onDateChange={(date) => console.log(date)}
          />

          <DateDropdown
            label={<RequiredLabel label="Expiry Date" />}
            onDateChange={(date) => console.log(date)}
          />

          {/* Warning Message */}
          <View style={styles.warnsms}>
            <View style={styles.infoCircle}>
              <Text style={styles.infoIconText}>!</Text>
            </View>
            <Text style={styles.warnText}>
              Make sure all details match your physical passport exactly. Any mismatch may delay your visa application
            </Text>
          </View>

          {/* Buttons Row */}
          <View style={localStyles.buttonRow}>
            <Pressable 
              style={[localStyles.btn, localStyles.btnPrevious]} 
              onPress={() => router.push('/')}
            >
              <Text style={localStyles.btnTextPrevious}>Previous</Text>
            </Pressable>

            <Pressable 
              style={[localStyles.btn, localStyles.btnNext]} 
              onPress={() => router.push('/passportinfo')}
            >
              <Text style={localStyles.btnTextNext}>Next</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Renamed to localStyles to avoid confusion with imported theme styles
const localStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingBottom: 40,
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  btnPrevious: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  btnNext: {
    backgroundColor: '#7ca0ecff', 
    borderColor: '#7ca0ecff',
  },
  btnTextPrevious: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  btnTextNext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});