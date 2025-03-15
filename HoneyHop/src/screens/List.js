import React, { useState } from 'react';
import { 
  View, Text, Keyboard, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput as PaperInput, Button as PaperButton } from 'react-native-paper';
import GlobalStyles from '../../styles/GlobalStyles';

export default function List() {
  const [tripName, setTripName] = useState('');
  const [flightDetails, setFlightDetails] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const closePickers = () => {
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    Keyboard.dismiss();
  };

  const onStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
    setShowStartDatePicker(false); // Close picker automatically
  };

  const onEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
    setShowEndDatePicker(false); // Close picker automatically
  };

  return (
    <TouchableWithoutFeedback onPress={closePickers}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1, backgroundColor: '#FAFAFA', padding: 20 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Header Title */}
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>Plan Your Trip</Text>

          {/* Trip Name Input */}
          <PaperInput
            label="Enter Trip Name"
            value={tripName}
            onChangeText={setTripName}
            mode="outlined"
            style={{ marginBottom: 15 }}
          />

          {/* Date Range Picker */}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 5 }}>Select Date Range:</Text>

          {/* Start Date Picker */}
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={GlobalStyles.dateInput}>
            <Text>Start Date: {startDate.toDateString()}</Text>
          </TouchableOpacity>

          {showStartDatePicker && (
            <TouchableWithoutFeedback onPress={closePickers}>
              <View>
                <DateTimePicker 
                  value={startDate} 
                  mode="date" 
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                  onChange={onStartDateChange} 
                />
              </View>
            </TouchableWithoutFeedback>
          )}

          {/* End Date Picker */}
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={GlobalStyles.dateInput}>
            <Text>End Date: {endDate.toDateString()}</Text>
          </TouchableOpacity>

          {showEndDatePicker && (
            <TouchableWithoutFeedback onPress={closePickers}>
              <View>
                <DateTimePicker 
                  value={endDate} 
                  mode="date" 
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                  onChange={onEndDateChange} 
                />
              </View>
            </TouchableWithoutFeedback>
          )}

          {/* Flight Details Input */}
          <PaperInput
            label="Flight Details"
            value={flightDetails}
            onChangeText={setFlightDetails}
            mode="outlined"
            multiline
            style={{ marginTop: 15 }}
          />

          {/* Accommodation Details Input */}
          <PaperInput
            label="Accommodation Details"
            value={accommodation}
            onChangeText={setAccommodation}
            mode="outlined"
            multiline
            style={{ marginTop: 15 }}
          />

          {/* Save Button */}
          <PaperButton 
            mode="contained" 
            onPress={() => console.log({ tripName, startDate, endDate, flightDetails, accommodation })} 
            style={{ marginTop: 20, padding: 8 }}
          >
            Save Trip
          </PaperButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
