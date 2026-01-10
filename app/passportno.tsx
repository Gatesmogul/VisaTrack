import React from 'react';
import { View, Text, StyleSheet, TextInput, Image } from 'react-native';

interface PassportInputProps {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}

export default function PassportNumberInput({ label, required, value, onChangeText }: PassportInputProps) {
  return (
    <View style={styles.container}>
      {/* Label - Matches your existing style */}
      <Text style={styles.label}>
        {label} {required && <Text style={styles.asterisk}>*</Text>}
      </Text>

      {/* Input Box Wrapper */}
      <View style={styles.inputBox}>
        {/* Local Profile Image Asset */}
        <Image 
          source={require('../assets/images/idCard.png')} // Ensure path is correct
          style={styles.profileIcon}
          resizeMode="contain"
        />
        
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter 11-digit passport number"
          placeholderTextColor="#999"
          maxLength={11}
          keyboardType="default"
          autoCapitalize="characters"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: -15,
    marginBottom: 20, 
    width: '100%' 
  },
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8 
  },
  asterisk: {
    color: 'red',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    //backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 50, // Consistent height for all inputs
  },
  profileIcon: {
    width: 22, // Size adjusted to match typical icon scale
    height: 22,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 12,
    color: '#333',
  },
});