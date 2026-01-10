import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

// 1. Interface must be OUTSIDE the function
interface DateDropdownProps {
  label: any;
  required?: boolean;
  onDateChange: (date: Date) => void;
  containerStyle?: any; // To handle the red border when expired
}

export default function DateDropdown({ label, required, onDateChange, containerStyle }: DateDropdownProps) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedText, setSelectedText] = useState('Select Date');

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // iOS stays open, Android closes
    setDate(currentDate);
    
    // Format the date for display
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    setSelectedText(fDate);
    
    // Send date back to parent
    onDateChange(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>

      {/* 2. Added containerStyle to the array here */}
      <Pressable 
        style={[styles.dropdown, containerStyle]} 
        onPress={() => setShow(true)}
      >
        <Ionicons name="calendar-outline" size={20} color="#666" style={styles.icon} />
        
        <Text style={[styles.dateText, selectedText === 'Select Date' && { color: '#999' }]}>
          {selectedText}
        </Text>

        <Ionicons name="chevron-down" size={18} color="#666" />
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: -10,
    marginBottom: 13, 
    width: '100%'
  },
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8 
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff', // Ensured background is white
    paddingHorizontal: 12,
    height: 50,
  },
  icon: { marginRight: 10 },
  dateText: { flex: 1, fontSize: 12, color: '#333' },
});
