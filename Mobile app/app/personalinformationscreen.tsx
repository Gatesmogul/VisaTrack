// app/(tabs)/personalinformationscreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const COUNTRIES = [ /* ⛔ UNCHANGED — your full list stays here */ 
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda',
  'Argentina','Armenia','Australia','Austria','Austrian Empire','Azerbaijan',
  'Baden','Bahamas','The Bahrain','Bangladesh','Barbados','Bavaria','Belarus',
  'Belgium','Belize','Benin (Dahomey)','Bolivia','Bosnia and Herzegovina',
  'Botswana','Brazil','Brunei','Brunswick and Lüneburg','Bulgaria',
  'Burkina Faso (Upper Volta)','Burma','Burundi','Cabo Verde','Cambodia',
  'Cameroon','Canada','Cayman Islands','The Central African Republic',
  'Central American Federation','Chad','Chile','China','Colombia','Comoros',
  'Congo Free State','The Cook Islands','Costa Rica',
  'Cote d’Ivoire (Ivory Coast)','Croatia','Cuba','Cyprus','Czechia',
  'Czechoslovakia','Democratic Republic of the Congo','Denmark','Djibouti',
  'Dominica','Dominican Republic','Duchy of Parma, The',
  'East Germany (German Democratic Republic)','Ecuador','Egypt','El Salvador',
  'Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia',
  'Federal Government of Germany (1848-49)','Fiji','Finland','France','Gabon',
  'Gambia','The Georgia','Germany','Ghana','Grand Duchy of Tuscany, The',
  'Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti',
  'Hanover','Hanseatic Republics','Hawaii','Hesse','Holy See','Honduras',
  'Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel',
  'Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya',
  'Kingdom of Serbia/Yugoslavia','Kiribati','Korea','Kosovo','Kuwait',
  'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya',
  'Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia',
  'Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius',
  'Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco',
  'Mozambique','Namibia','Nauru','Nepal','Netherlands','New Zealand',
  'Nicaragua','Niger','Nigeria','North Macedonia','Norway','Oman','Pakistan',
  'Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland',
  'Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia','Senegal',
  'Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Sweden',
  'Switzerland','Syria','Thailand','Togo','Tunisia','Turkey','Uganda',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
];

export default function PersonalInformationScreen() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) setDateOfBirth(selectedDate);
    if (Platform.OS !== 'ios') setShowDatePicker(false);
  };

  const handleSubmit = () => {
    if (!name || !dateOfBirth || !gender || !nationality || !countryOfResidence) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    Alert.alert(
      'Success',
      `Name: ${name}
DOB: ${dateOfBirth.toDateString()}
Gender: ${gender}
Nationality: ${nationality}
Country of Residence: ${countryOfResidence}`
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Personal Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#999"
        />

        <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {dateOfBirth ? dateOfBirth.toDateString() : 'Select Date of Birth'}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <View style={styles.pickerWrapper}>
          <Picker selectedValue={gender} onValueChange={setGender}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker selectedValue={nationality} onValueChange={setNationality}>
            <Picker.Item label="Select Nationality" value="" />
            {COUNTRIES.map(c => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={countryOfResidence}
            onValueChange={setCountryOfResidence}
          >
            <Picker.Item label="Select Country of Residence" value="" />
            {COUNTRIES.map(c => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#4DA3FF',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  dateInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    minHeight: 56,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#36FF0E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
