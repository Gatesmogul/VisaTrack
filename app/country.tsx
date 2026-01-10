import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

interface CountryDropdownProps {
  label: string;
  required?: boolean;
  onSelect: (value: string) => void;
}

export default function CountryDropdown({ label, required, onSelect }: CountryDropdownProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Complete list of countries provided
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
  ].sort((a, b) => a.label.localeCompare(b.label)); // Keeps the list organized A-Z

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>

      <View style={styles.dropdownBox}>
        {/* Globe icon matches the Calendar icon style in your Date picker */}
        <Ionicons name="globe-outline" size={20} color="#666" style={styles.icon} />
        
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedCountry(value);
              onSelect(value);
            }}
            items={countries}
            placeholder={{ label: 'Select Country', value: null, color: '#999' }}
            useNativeAndroidPickerStyle={false}
            style={pickerSelectStyles}
            Icon={() => {
              return <Ionicons name="chevron-down" size={18} color="#666" />;
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: -10,
    marginBottom: 15, 
    width: '100%' 
  },
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8 
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    //backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 50,
  },
  icon: { 
    marginRight: 10 
  },
  pickerWrapper: {
    flex: 1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: '#333',
    height: 50,
    width: '100%',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    color: '#333',
    height: 50,
    width: '100%',
    paddingRight: 30,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 15 : 15,
    right: 0,
  },
});

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Platform } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import { Ionicons } from '@expo/vector-icons';

// interface CountryDropdownProps {
//   label: string;
//   required?: boolean;
//   onSelect: (value: string) => void;
// }

// export default function CountryDropdown({ label, required, onSelect }: CountryDropdownProps) {
//   const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
 

//   const countries = [
//     { label: 'Nigeria', value: 'NG' },
//     { label: 'United States', value: 'US' },
//     { label: 'United Kingdom', value: 'GB' },
//     { label: 'Canada', value: 'CA' },
//     { label: 'Ghana', value: 'GH' },
//   ].sort((a, b) => a.label.localeCompare(b.label));

//   return (
//     <View style={styles.container}>
//       {/* Label - Same style as Date Picker */}
//       <Text style={styles.label}>
//         {label} {required && <Text style={{ color: 'red' }}>*</Text>}
//       </Text>

//       {/* Box Wrapper - This ensures the box size and icon placement matches Date Picker */}
//       <View style={styles.dropdownBox}>
//         <Ionicons name="globe-outline" size={20} color="#666" style={styles.icon} />
        
//         <View style={styles.pickerWrapper}>
//           <RNPickerSelect
//             onValueChange={(value) => {
//               setSelectedCountry(value);
//               onSelect(value);
//             }}
//             items={countries}
//             placeholder={{ label: 'Select Country', value: null, color: '#999' }}
//             useNativeAndroidPickerStyle={false}
//             style={pickerSelectStyles}
//             Icon={() => {
//               return <Ionicons name="chevron-down" size={18} color="#666" />;
//             }}
//           />
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     marginBottom: 20, 
//     width: '100%' 
//   },
//   label: { 
//     fontSize: 16, 
//     fontWeight: '600', 
//     color: '#333', 
//     marginBottom: 8 
//   },
//   dropdownBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     paddingHorizontal: 12,
//     height: 50, // Matches your DateDropdown exactly
//   },
//   icon: { 
//     marginRight: 10 
//   },
//   pickerWrapper: {
//     flex: 1, // Makes the picker fill the rest of the box
//   },
// });

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     fontSize: 16,
//     color: '#333',
//     height: 50,
//     width: '100%',
//     paddingRight: 30, // Space for chevron
//   },
//   inputAndroid: {
//     fontSize: 16,
//     color: '#333',
//     height: 50,
//     width: '100%',
//     paddingRight: 30, // Space for chevron
//   },
//   iconContainer: {
//     top: Platform.OS === 'ios' ? 15 : 15,
//     right: 0,
//   },
// });