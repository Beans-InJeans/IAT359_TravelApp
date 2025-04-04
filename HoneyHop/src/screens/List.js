import React, { useEffect, useState } from 'react';
import { 
  View, Text, Keyboard, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, StyleSheet 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {  DefaultTheme, Provider as PaperProvider, TextInput as PaperInput, Button as PaperButton, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { db, firebase_auth } from '../firebaseConfig';
import { getFirestore, setDoc, doc, collection, getDocs, query, where, addDoc } from "firebase/firestore";

export default function TripPlanner() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'black', 
    },
  };

   const navigation = useNavigation(); 

  const [tripName, setTripName] = useState('');
  
  //date pickers
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  //flight details section
  const [expandedFlight, setExpandedFlight] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [returnTime, setReturnTime] = useState(new Date());
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);
  const [airline, setAirline] = useState('');
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [terminal, setTerminal] = useState('');

  //accommodation details section
  const [expandedAccommodation, setExpandedAccommodation] = useState(false);
  const [accommodationName, setAccommodationName] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [showCheckInDatePicker, setShowCheckInDatePicker] = useState(false);
  const [showCheckInTimePicker, setShowCheckInTimePicker] = useState(false);
  const [showCheckOutDatePicker, setShowCheckOutDatePicker] = useState(false);
  const [confirmationAccommodationNumber, setConfirmationAccommodationNumber] = useState('');

  
  //closing the pickers when they pop out
  const closePickers = () => {
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setShowDepartureDatePicker(false);
    setShowDepartureTimePicker(false);
    setShowReturnDatePicker(false);
    setShowReturnTimePicker(false);
    setShowCheckInDatePicker(false);
    setShowCheckInTimePicker(false);
    setShowCheckOutDatePicker(false);
    Keyboard.dismiss();
  };


  const saveTrip = async () => {
    //check if firebase auth is initialised
    if (!firebase_auth) {
      console.log("Firebase Auth not initialized.");
      return;
  }
    console.log("SaveTrip function called");

    //get the current user
    const user = firebase_auth.currentUser;
    if (!user) {
        console.log("No user is logged in.");
        return; 
    }

    console.log("Current user UID: ", user.uid);

    //define the trip details object
    const tripDetails = {
        tripName,
        startDate,
        endDate,
        departureDate,
        departureTime,
        returnDate,
        returnTime,
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
    };

    try {
        //get a reference to the user's document using the UID
        const userRef = doc(db, 'users', user.uid);

        console.log("Checking trips collection under userRef:", userRef);

        //get a reference to the 'trips' collection under the user
        const tripsCollectionRef = collection(userRef, 'trips');
        //fetch all existing trips under the user
        const tripsSnapshot = await getDocs(tripsCollectionRef);

        if (tripsSnapshot.empty) {
            console.log("No trips found in the collection.");
        } else {
            console.log("Trips collection contains the following documents:");
            tripsSnapshot.forEach(doc => {
                console.log(doc.id, " => ", doc.data());
            });
        }

        //add the trip details document to the 'trips' collection
        await addDoc(tripsCollectionRef, tripDetails);
        console.log("Trip details saved successfully.");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};


  return (
    <PaperProvider theme={theme}>
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

              {/* Return Date */}
              <TouchableOpacity onPress={() => setShowReturnDatePicker(true)} style={styles.dateInput}>
                <Text>Return Date: {returnDate.toDateString()}</Text>
              </TouchableOpacity>

              {showReturnDatePicker && (
                <DateTimePicker 
                  value={returnDate} 
                  mode="date" 
                  display="default" 
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setReturnDate(selectedDate);
                    setShowReturnDatePicker(false);
                  }} 
                />
              )}

              {/* Return Time */}
              <TouchableOpacity onPress={() => setShowReturnTimePicker(true)} style={styles.dateInput}>
                <Text>Return Time: {returnTime.toLocaleTimeString()}</Text>
              </TouchableOpacity>

              {showReturnTimePicker && (
                <DateTimePicker 
                  value={returnTime} 
                  mode="time" 
                  display="default" 
                  onChange={(event, selectedTime) => {
                    if (selectedTime) setReturnTime(selectedTime);
                    setShowReturnTimePicker(false);
                  }} 
                />
              )}
              
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
            console.log("SaveTrip button pressed");
          }} 
        style={styles.saveButton}
>
         Save Trip
        </PaperButton>
        <PaperButton 
             mode="contained" 
             onPress={() => navigation.navigate('TimelineMapTabs')} 
        style={styles.saveButton}
>
         See Itinerary
        </PaperButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </PaperProvider>
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
    backgroundColor: '#fffdf3',
  },
  dateInput: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fffdf3',
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
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: "100%",
    borderRadius: 8,
    backgroundColor: '#f75b00',
  },
});
