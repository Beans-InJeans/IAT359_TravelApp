import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Touchable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase_auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where, addDoc, onSnapshot, doc } from "firebase/firestore";

export default function Timeline({ navigation }) {
  const [tripData, setTripData] = useState([]);

  useEffect(() => {
    fetchTripData();
  }, []);

  // Fetch trip data from Firestore for the current user
  async function fetchTripData() {
    try {
      const user = firebase_auth.currentUser;
      if (!user) {
        console.log("No user is logged in");
        return;
      }

      // Reference to the user's trips collection
      const tripsCollectionRef = collection(doc(db, "users", user.uid), "trips");
      
      const querySnapshot = await getDocs(tripsCollectionRef);
      const trips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTripData(trips);
      
      // Debug log to check if trips are successfully retrieved
      console.log("Trips fetched successfully:", trips);
      setTripData(trips[0]); // Update state with the first trip
      
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }

  if (tripData.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No trips available</Text>
      </View>
    );
  }
// Function to properly format dates
function formatDate(date) {
  if (!date) return "No Date"; // Handle missing dates

  // Check if Firestore Timestamp, then convert
  if (date.seconds) {
    date = new Date(date.seconds * 1000);
  } else {
    date = new Date(date);
  }

  return date.toDateString(); // Output: "Mon, Mar 16 2025"
}

function formatTime(time) {
  if (!time) return ""; // Handle missing times

  // Check if Firestore Timestamp, then convert
  if (time.seconds) {
    time = new Date(time.seconds * 1000);
  } else {
    time = new Date(time);
  }

  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Output: "10:00 AM"
}

async function fetchCityCoordinates(tripName) {

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(tripName)}`);
    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error("Error fetching city coordinates:", error);
  }

  return null;
}

const goToMap = async () => {
  if (!tripData?.tripName) {
    console.log("No city specified");
    return;
  }

  const coordinates = await fetchCityCoordinates(tripData.tripName);
  if (coordinates) {
    console.log("Coordinates fetched:", coordinates);
    navigation.navigate('Map',{ city: tripData.tripName, ...coordinates });
  } else {
    console.log("City coordinates not found");
  }
};

return (
  <View style={styles.container}>
    <Text style={styles.title}>{tripData?.tripName || "Loading..."}</Text>
    <Text style={styles.dateRange}>
      {formatDate(tripData?.startDate)} - {formatDate(tripData?.endDate)}
    </Text>

    <ScrollView style={styles.timeline}>
      {/* Flight Check-In Card */}
      <View style={styles.timelineEvent}>
        <View style={[styles.timelineIconContainer, styles.flight]}>
          <MaterialCommunityIcons name="airplane-takeoff" size={24} color="white" />
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>Departure Flight</Text>
          <Text style={styles.eventDate}>
            {formatDate(tripData?.departureDate)} {formatTime(tripData?.departureTime)}
          </Text>
          {tripData?.airline && tripData?.fromAirport && tripData?.toAirport && (
            <Text style={styles.eventDescription}>
              {tripData.airline} from {tripData.fromAirport} to {tripData.toAirport}
            </Text>
          )}
        </View>
      </View>

      {/* Hotel Check-In */}
      <View style={styles.timelineEvent}>
        <View style={[styles.timelineIconContainer, styles.hotelCheckIn]}>
          <MaterialCommunityIcons name="bed" size={24} color="white" />
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>Check-In at {tripData?.accommodationName || "No Accommodation"}</Text>
          <Text style={styles.eventDate}>
            {formatDate(tripData?.checkInDate)} {formatTime(tripData?.checkInTime)}
          </Text>
        </View>
      </View>
    </ScrollView>

   {/* Updated Map Button */}
   <TouchableOpacity onPress={goToMap} style={styles.mapButton}>
        <Text style={styles.mapButtonText}>View on Map</Text>
      </TouchableOpacity>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Plan')}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dateRange: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  timeline: {
    flex: 1,
  },
  timelineEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  timelineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
  },
  flight: {
    backgroundColor: '#3498db',
  },
  hotelCheckIn: {
    backgroundColor: '#9b59b6',
  },
  hotelCheckOut: {
    backgroundColor: '#8e44ad',
  },
  eventContent: {
    marginLeft: 50,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
    paddingTop: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 16,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  }
);
