import React, { useState } from "react";
import { 
  View, Text, Keyboard, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, StyleSheet 
} from "react-native";
import { TextInput as PaperInput, Button as PaperButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { db } from '../firebaseConfig';
import { collection, addDoc, doc } from "firebase/firestore";
import { firebase_auth } from "../firebaseConfig"; // Ensure Firebase auth is properly imported

export default function Plan() {
  const navigation = useNavigation();

  // State for inputs
  const [category, setCategory] = useState("food");
  const [activityTitle, setActivityTitle] = useState(""); // New Input Field
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Date & Time picker states
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const closePickers = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    Keyboard.dismiss();
  };

  const savePlan = async () => {
    if (!firebase_auth) {
        console.log("Firebase Auth not initialized.");
        return;
    }

    const user = firebase_auth.currentUser;
    if (!user) {
        console.log("No user is logged in.");
        return;
    }

    console.log("Current user UID: ", user.uid);

    const planDetails = {
        category,
        activityTitle, 
        location,
        notes,
        date,
        time,
    };

    try {
        const userRef = doc(db, 'users', user.uid);
        const plansCollectionRef = collection(userRef, 'plans');

        await addDoc(plansCollectionRef, planDetails);
        console.log("Plan details saved successfully.");

        // Navigate to Timeline screen after saving
        navigation.navigate('TimelineMapTabs', { planData: planDetails });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closePickers}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Header */}
          <Text style={styles.header}>Add Your Plan</Text>

          {/* Category Picker */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Choose Category:</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setCategory(category === "food" ? "activity" : "food")}
            >
              <Text style={styles.pickerText}>{category === "food" ? "Food" : "Activity"}</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Title Input (New) */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Activity Title:</Text>
            <PaperInput
              label="Enter Activity Title"
              value={activityTitle}
              onChangeText={setActivityTitle}
              mode="outlined"
              style={styles.inputField}
            />
          </View>

          {/* Location Input */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Location:</Text>
            <PaperInput
              label="Enter Location"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={styles.inputField}
            />
          </View>

          {/* Notes Input */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Notes:</Text>
            <PaperInput
              label="Enter Notes"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              style={[styles.inputField, styles.textArea]}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Date Picker */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Select Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                  setShowDatePicker(false);
                }}
              />
            )}
          </View>

          {/* Time Picker (New) */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Select Time:</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateInput}>
              <Text>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  if (selectedTime) setTime(selectedTime);
                  setShowTimePicker(false);
                }}
              />
            )}
          </View>

          {/* Save Plan Button */}
          <PaperButton
            mode="contained"
            onPress={savePlan}
            style={styles.saveButton}
          >
            Save Plan
          </PaperButton>

        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  inputField: {
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateInput: {
    padding: 10,
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    backgroundColor: "#FFF",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

