import React, { useState } from "react";
import { 
  View, Text, Keyboard, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, StyleSheet 
} from "react-native";
import { TextInput as PaperInput, Button as PaperButton, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

export default function Plan() {
  const navigation = useNavigation();

  // State for inputs
  const [category, setCategory] = useState("food");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Date picker states
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const closePickers = () => {
    setShowStartDatePicker(false);
    Keyboard.dismiss();
  };

  const savePlan = () => {
    const planDetails = {
      category,
      location,
      notes,
      startDate,
    };

    // Save plan details (store in state or local storage if needed)
    console.log(planDetails);

    // Navigate to the Timeline screen with the plan data
    navigation.navigate("Timeline", { planData: planDetails });
  };

  return (
    <TouchableWithoutFeedback onPress={closePickers}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Header Title */}
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

          {/* Start Date Picker */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Start Date:</Text>
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
          </View>

          {/* Save Plan Button */}
          <PaperButton
            mode="contained"
            onPress={savePlan}
            style={styles.saveButton}
          >
            Save Plan
            <MaterialCommunityIcons name="check" size={20} color="white" />
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
