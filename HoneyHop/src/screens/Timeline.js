import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, addDoc, onSnapshot } from "firebase/firestore";

export default function Timeline({navigation}) {
  const route = useRoute();
  const [tripData, setTripData] = useState([]);
  
  // Fetch trips from Firestore when the component mounts
  useEffect(() => {
    if (route.params?.tripData) {
      setTripData(route.params.tripData);
    } else {
      fetchTripData();
    }
  }, [route.params?.tripData]);

  // Fetch trip data from Firestore
  async function fetchTripData() {
    try {
      const querySnapshot = await getDocs(collection(db, "trips"));
      const trips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTripData(trips);
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
  
  // const [tripData, setTripData] = useState([]);

  // // Fetch trips from Firestore when the component mounts
  // useEffect(() => {
  //   fetchTripData();
  // }, []);

  // // Fetch trip data from Firestore
  // async function fetchTripData() {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "trips"));
  //     const trips = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setTripData(trips); // Store the fetched trips
  //     console.log("Fetch from Firestore successful:", trips); // Log successful fetch
  //   } catch (error) {
  //     console.error("Error fetching trips:", error);
  //   }
  // }

  // if (tripData.length === 0) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>No trips available</Text>
  //     </View>
  //   );
  // }

  // Extract accommodation data (if exists)
  const accommodations = tripData.accommodations || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tripData.tripName}</Text>
      <Text style={styles.dateRange}>
        {tripData.startDate ? new Date(tripData.startDate).toDateString() : ''} - {tripData.endDate ? new Date(tripData.endDate).toDateString() : ''}
      </Text>

      <ScrollView style={styles.timeline}>
        {/* Flight Check In Card */}
        <View style={styles.timelineEvent}>
          <View style={[styles.timelineIconContainer, styles.flight]}>
            <MaterialCommunityIcons
              name="airplane-takeoff"
              size={24}
              color="white"
            />
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Departure Flight</Text>
            {tripData.departureDate && (
              <Text style={styles.eventDate}>
                {new Date(tripData.departureDate).toDateString()}
                {tripData.departureTime && ` at ${new Date(tripData.departureTime).toLocaleTimeString()}`}
              </Text>
            )}
            {tripData.airline && tripData.fromAirport && tripData.toAirport && (
              <Text style={styles.eventDescription}>
                {tripData.airline} from {tripData.fromAirport} to {tripData.toAirport}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.timelineEvent}>
          <View style={[styles.timelineIconContainer, styles.hotelCheckIn]}>
            <MaterialCommunityIcons
              name="bed"
              size={24}
              color="white"
            />
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Check-In at {tripData.accommodationName}</Text>
            {tripData.checkInDate && (
              <Text style={styles.eventDate}>
                {new Date(tripData.checkInDate).toDateString()}
                {tripData.checkInDate && ` at ${new Date(tripData.checkInDate).toLocaleTimeString()}`}
              </Text>
            )}
            {tripData.airline && tripData.fromAirport && tripData.toAirport && (
              <Text style={styles.eventDescription}>
                {tripData.airline} from {tripData.fromAirport} to {tripData.toAirport}
              </Text>
            )}
          </View>
        </View>

      </ScrollView>
      {/* Floating Action Button */}
      <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('Plan')} 
    >
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
});
