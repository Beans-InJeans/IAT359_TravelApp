import React, { useState } from 'react';
import { 
  View, Text, Keyboard, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, StyleSheet 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput as PaperInput, Button as PaperButton, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

export default function TripPlanner() {
   const navigation = useNavigation(); 

  const [tripName, setTripName] = useState('');
  
  // Date Pickers
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Flight Details Section
  const [expandedFlight, setExpandedFlight] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);
  const [airline, setAirline] = useState('');
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [terminal, setTerminal] = useState('');

  // Accommodation Details Section
  const [expandedAccommodation, setExpandedAccommodation] = useState(false);
  const [accommodationName, setAccommodationName] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [showCheckInDatePicker, setShowCheckInDatePicker] = useState(false);
  const [showCheckInTimePicker, setShowCheckInTimePicker] = useState(false);
  const [showCheckOutDatePicker, setShowCheckOutDatePicker] = useState(false);
  const [confirmationAccommodationNumber, setConfirmationAccommodationNumber] = useState('');

  // // Itinerary Section
  // const [itinerary, setItinerary] = useState('');
  

  const closePickers = () => {
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setShowDepartureDatePicker(false);
    setShowDepartureTimePicker(false);
    setShowCheckInDatePicker(false);
    setShowCheckInTimePicker(false);
    setShowCheckOutDatePicker(false);
    Keyboard.dismiss();
  };

  // Save trip function
const saveTrip = () => {
  const tripDetails = {
    tripName,
    startDate,
    endDate,
    departureDate,
    departureTime,
    airline,
    fromAirport,
    toAirport,
    flightNumber,
    confirmationNumber,
    terminal,
    accommodationName,
    checkInDate,
    checkInTime,
    checkOutDate,
    confirmationAccommodationNumber,
    //itinerary
  };

  // Save trip details (store in state or local storage if needed)
  console.log(tripDetails);

  // Navigate to the Timeline screen with trip data
  navigation.navigate('Timeline', { tripData: tripDetails });
};

  return (
    <TouchableWithoutFeedback onPress={closePickers}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Header Title */}
          <Text style={styles.header}>Plan Your Trip</Text>

          {/* Details Section */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Details</Text>

            {/* Trip Name Input */}
            <PaperInput
              label="Enter Trip Name"
              value={tripName}
              onChangeText={setTripName}
              mode="outlined"
              style={styles.inputField}
            />

            {/* Date Range Picker */}
            <Text style={styles.label}>Select Date Range:</Text>

            {/* Start Date */}
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateInput}>
              <Text>Start Date: {startDate.toDateString()}</Text>
            </TouchableOpacity>

            {showStartDatePicker && (
              <DateTimePicker 
                value={startDate} 
                mode="date" 
                display="default" 
                onChange={(event, selectedDate) => {
                  if (selectedDate) setStartDate(selectedDate);
                  setShowStartDatePicker(false);
                }} 
              />
            )}

            {/* End Date */}
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateInput}>
              <Text>End Date: {endDate.toDateString()}</Text>
            </TouchableOpacity>

            {showEndDatePicker && (
              <DateTimePicker 
                value={endDate} 
                mode="date" 
                display="default" 
                onChange={(event, selectedDate) => {
                  if (selectedDate) setEndDate(selectedDate);
                  setShowEndDatePicker(false);
                }} 
              />
            )}

            {/* Flight Details Dropdown Section */}
            <List.Accordion
              title="Flight Details"
              expanded={expandedFlight}
              onPress={() => setExpandedFlight(!expandedFlight)}
              style={styles.accordion}
            >
              {/* Departure Date */}
              <TouchableOpacity onPress={() => setShowDepartureDatePicker(true)} style={styles.dateInput}>
                <Text>Departure Date: {departureDate.toDateString()}</Text>
              </TouchableOpacity>

              {showDepartureDatePicker && (
                <DateTimePicker 
                  value={departureDate} 
                  mode="date" 
                  display="default" 
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setDepartureDate(selectedDate);
                    setShowDepartureDatePicker(false);
                  }} 
                />
              )}

              {/* Departure Time */}
              <TouchableOpacity onPress={() => setShowDepartureTimePicker(true)} style={styles.dateInput}>
                <Text>Departure Time: {departureTime.toLocaleTimeString()}</Text>
              </TouchableOpacity>

              {showDepartureTimePicker && (
                <DateTimePicker 
                  value={departureTime} 
                  mode="time" 
                  display="default" 
                  onChange={(event, selectedTime) => {
                    if (selectedTime) setDepartureTime(selectedTime);
                    setShowDepartureTimePicker(false);
                  }} 
                />
              )}

              {/* Airline */}
              <PaperInput
                label="Airline"
                value={airline}
                onChangeText={setAirline}
                mode="outlined"
                style={styles.inputField}
              />

              {/* From Airport */}
              <PaperInput
                label="From Airport"
                value={fromAirport}
                onChangeText={setFromAirport}
                mode="outlined"
                style={styles.inputField}
              />

              {/* To Airport */}
              <PaperInput
                label="To Airport"
                value={toAirport}
                onChangeText={setToAirport}
                mode="outlined"
                style={styles.inputField}
              />

              {/* Flight Number */}
              <PaperInput
                label="Flight Number"
                value={flightNumber}
                onChangeText={setFlightNumber}
                mode="outlined"
                style={styles.inputField}
              />

              {/* Confirmation Number */}
              <PaperInput
                label="Confirmation Number"
                value={confirmationNumber}
                onChangeText={setConfirmationNumber}
                mode="outlined"
                style={styles.inputField}
              />

              {/* Terminal */}
              <PaperInput
                label="Terminal"
                value={terminal}
                onChangeText={setTerminal}
                mode="outlined"
                style={styles.inputField}
              />
            </List.Accordion>

            {/* Accommodation Details Dropdown Section */}
            <List.Accordion
              title="Accommodation Details"
              expanded={expandedAccommodation}
              onPress={() => setExpandedAccommodation(!expandedAccommodation)}
              style={styles.accordion}
            >
              {/* Accommodation Name */}
              <PaperInput
                label="Accommodation Name"
                value={accommodationName}
                onChangeText={setAccommodationName}
                mode="outlined"
                style={styles.inputField}
              />

              {/* Check-In Date */}
              <TouchableOpacity onPress={() => setShowCheckInDatePicker(true)} style={styles.dateInput}>
                <Text>Check-In Date: {checkInDate.toDateString()}</Text>
              </TouchableOpacity>

              {showCheckInDatePicker && (
                <DateTimePicker 
                  value={checkInDate} 
                  mode="date" 
                  display="default" 
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setCheckInDate(selectedDate);
                    setShowCheckInDatePicker(false);
                  }} 
                />
              )}

              {/* Check-In Time */}
              <TouchableOpacity onPress={() => setShowCheckInTimePicker(true)} style={styles.dateInput}>
                <Text>Check-In Time: {checkInTime.toLocaleTimeString()}</Text>
              </TouchableOpacity>

              {showCheckInTimePicker && (
                <DateTimePicker 
                  value={checkInTime} 
                  mode="time" 
                  display="default" 
                  onChange={(event, selectedTime) => {
                    if (selectedTime) setCheckInTime(selectedTime);
                    setShowCheckInTimePicker(false);
                  }} 
                />
              )}

              {/* Check-Out Date */}
              <TouchableOpacity onPress={() => setShowCheckOutDatePicker(true)} style={styles.dateInput}>
                <Text>Check-Out Date: {checkOutDate.toDateString()}</Text>
              </TouchableOpacity>

              {showCheckOutDatePicker && (
                <DateTimePicker 
                  value={checkOutDate} 
                  mode="date" 
                  display="default" 
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setCheckOutDate(selectedDate);
                    setShowCheckOutDatePicker(false);
                  }} 
                />
              )}

              {/* Confirmation Number */}
              <PaperInput
                label="Confirmation Number"
                value={confirmationAccommodationNumber}
                onChangeText={setConfirmationAccommodationNumber}
                mode="outlined"
                style={styles.inputField}
              />
            </List.Accordion>
          </View>

  

          {/* Save Trip Button */}
          <PaperButton 
             mode="contained" 
             onPress={() => {
             // Save the trip details
            saveTrip();
          }} 
        style={styles.saveButton}
>
         Save Trip
        </PaperButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  inputField: {
    marginBottom: 15,
  },
  dateInput: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  accordion: {
    backgroundColor: 'white',
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  addPlanButton: {
    marginTop: 20,
    padding: 8,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
    padding: 8,
  },
});
