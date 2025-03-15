import React, { useState } from 'react';
import { 
  View, Text, Keyboard, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput as PaperInput, Button as PaperButton, List } from 'react-native-paper';
import GlobalStyles from '../../styles/GlobalStyles';

export default function TripPlanner() {
  const [tripName, setTripName] = useState('');
  const [accommodation, setAccommodation] = useState('');
  
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

          {/* Start Date */}
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={GlobalStyles.dateInput}>
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
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={GlobalStyles.dateInput}>
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
            style={{ backgroundColor: 'white', marginVertical: 10 }}
          >
            {/* Departure Date */}
            <TouchableOpacity onPress={() => setShowDepartureDatePicker(true)} style={GlobalStyles.dateInput}>
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
            <TouchableOpacity onPress={() => setShowDepartureTimePicker(true)} style={GlobalStyles.dateInput}>
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
              style={{ marginTop: 10 }}
            />

            {/* From Airport */}
            <PaperInput
              label="From Airport"
              value={fromAirport}
              onChangeText={setFromAirport}
              mode="outlined"
              style={{ marginTop: 10 }}
            />

            {/* To Airport */}
            <PaperInput
              label="To Airport"
              value={toAirport}
              onChangeText={setToAirport}
              mode="outlined"
              style={{ marginTop: 10 }}
            />

            {/* Flight Number */}
            <PaperInput
              label="Flight Number"
              value={flightNumber}
              onChangeText={setFlightNumber}
              mode="outlined"
              style={{ marginTop: 10 }}
            />

            {/* Confirmation Number */}
            <PaperInput
              label="Confirmation Number"
              value={confirmationNumber}
              onChangeText={setConfirmationNumber}
              mode="outlined"
              style={{ marginTop: 10 }}
            />

            {/* Terminal */}
            <PaperInput
              label="Terminal"
              value={terminal}
              onChangeText={setTerminal}
              mode="outlined"
              style={{ marginTop: 10, marginBottom: 10 }}
            />
          </List.Accordion>

          {/* Accommodation Details Dropdown Section */}
          <List.Accordion
            title="Accommodation Details"
            expanded={expandedAccommodation}
            onPress={() => setExpandedAccommodation(!expandedAccommodation)}
            style={{ backgroundColor: 'white', marginVertical: 10 }}
          >
            {/* Accommodation Name */}
            <PaperInput
              label="Accommodation Name"
              value={accommodationName}
              onChangeText={setAccommodationName}
              mode="outlined"
              style={{ marginTop: 10 }}
            />

            {/* Check-In Date */}
            <TouchableOpacity onPress={() => setShowCheckInDatePicker(true)} style={GlobalStyles.dateInput}>
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
            <TouchableOpacity onPress={() => setShowCheckInTimePicker(true)} style={GlobalStyles.dateInput}>
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
            <TouchableOpacity onPress={() => setShowCheckOutDatePicker(true)} style={GlobalStyles.dateInput}>
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
              style={{ marginTop: 10, marginBottom: 10 }}
            />
          </List.Accordion>

          {/* Save Button */}
          <PaperButton 
            mode="contained" 
            onPress={() => console.log({ tripName, startDate, endDate, departureDate, departureTime, airline, fromAirport, toAirport, flightNumber, confirmationNumber, terminal, accommodationName, checkInDate, checkInTime, checkOutDate, confirmationAccommodationNumber })} 
            style={{ marginTop: 20, padding: 8 }}
          >
            Save Trip
          </PaperButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
