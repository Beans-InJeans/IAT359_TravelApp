import React, { useState } from 'react';
import { 
  View, Text, TextInput, Button, TouchableOpacity, Keyboard, 
  TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GlobalStyles from '../../styles/GlobalStyles';

export default function List() {
  const [tripName, setTripName] = useState('');
  const [flightDetails, setFlightDetails] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={GlobalStyles.container}>
          <Text style={GlobalStyles.header}>Plan Your Trip</Text>

          {/* Trip Name Input */}
          <Text style={GlobalStyles.label}>Enter Trip Name:</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Trip Name"
            value={tripName}
            onChangeText={setTripName}
            returnKeyType="done"
          />

          {/* Date Range Picker */}
          <Text style={GlobalStyles.label}>Select Date Range:</Text>

          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text style={GlobalStyles.dateInput}>Start Date: {startDate.toDateString()}</Text>
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />
          )}

          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={GlobalStyles.dateInput}>End Date: {endDate.toDateString()}</Text>
          </TouchableOpacity>

          {showEndDatePicker && (
            <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />
          )}

          {/* Flight Details Input */}
          <Text style={GlobalStyles.label}>Flight Details:</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Enter flight details"
            value={flightDetails}
            onChangeText={setFlightDetails}
            multiline
          />

          {/* Accommodation Details Input */}
          <Text style={GlobalStyles.label}>Accommodation Details:</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Enter accommodation details"
            value={accommodation}
            onChangeText={setAccommodation}
            multiline
          />

          {/* Submit Button */}
          <Button title="Save Trip" onPress={() => console.log({ tripName, startDate, endDate, flightDetails, accommodation })} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
