import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importing MaterialCommunityIcons
import { firebase_auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import Svg, { Polygon } from 'react-native-svg';

export default function Timeline({ navigation }) {
  const Hexagon = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Svg height="40" width="40" viewBox="0 0 100 100">
        <Polygon
          points="50,5 95,25 95,75 50,95 5,75 5,25"
          fill="#FFE850"
          stroke="black"
          strokeWidth="8"
          transform="rotate(90 50 50)"
        />
      </Svg>
    </View>
  );

  
  const [tripData, setTripData] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchTripData();
    fetchPlans();
  }, []);

  async function fetchTripData() {
    try {
      const user = firebase_auth.currentUser;
      if (!user) return;
      
      const tripsCollectionRef = collection(doc(db, "users", user.uid), "trips");
      const querySnapshot = await getDocs(tripsCollectionRef);
      const trips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setTripData(trips[0] || {});
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }

  function fetchPlans() {
    const user = firebase_auth.currentUser;
    if (!user) return;

    const plansCollectionRef = collection(doc(db, "users", user.uid), "plans");
    onSnapshot(plansCollectionRef, (snapshot) => {
      const newPlans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Sort plans by date before setting them to state
      const sortedPlans = newPlans.sort((a, b) => {
        const dateA = new Date(a.date.seconds * 1000 || a.date);
        const dateB = new Date(b.date.seconds * 1000 || b.date);
        return dateA - dateB; // Sort in ascending order (chronologically)
      });
      setPlans(sortedPlans);
    });
  }

  function formatDate(date) {
    if (!date) return "No Date";
    if (date.seconds) date = new Date(date.seconds * 1000);
    else date = new Date(date);
    return date.toDateString();
  }

  function formatTime(time) {
    if (!time) return "";
    if (time.seconds) time = new Date(time.seconds * 1000);
    else time = new Date(time);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getPlanIcon(category) {
    switch (category) {
      case "food":
        return "food-fork-drink"; // Correct icon for Food category
      case "activity":
        return "run"; // Correct icon for Activity category
      default:
        return "calendar"; // Default icon for other categories
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tripData?.tripName || "Loading..."}</Text>
      <Text style={styles.dateRange}>{formatDate(tripData?.startDate)} - {formatDate(tripData?.endDate)}</Text>
  
      <ScrollView style={styles.timeline}>
        {/* Departure Flight */}
        <View style={styles.timelineEvent}>
        <View style={styles.timelineLine} /> {/* Timeline line */}
          <View style={[styles.timelineIconContainer, styles.flight]}>
            <Hexagon />
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="airplane-takeoff" size={24} color="black" />
            </View> {/* Closing the iconContainer View here */}
          </View> {/* Closing the timelineIconContainer View here */}
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Departure Flight</Text>
            <Text style={styles.eventDate}>{formatDate(tripData?.departureDate)} {formatTime(tripData?.departureTime)}</Text>
            {tripData?.airline && (
              <Text style={styles.eventDescription}>{tripData.airline} from {tripData.fromAirport} to {tripData.toAirport}</Text>
            )}
          </View>
        </View>
  
        {/* Hotel Check-In */}
        <View style={styles.timelineEvent}>
        <View style={styles.timelineLine} /> {/* Timeline line */}
          <View style={[styles.timelineIconContainer, styles.hotelCheckIn]}>
            <Hexagon />
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="bed" size={24} color="black" />
            </View> {/* Closing the iconContainer View here */}
          </View> {/* Closing the timelineIconContainer View here */}
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Check-In at {tripData?.accommodationName || "No Accommodation"}</Text>
            <Text style={styles.eventDate}>{formatDate(tripData?.checkInDate)} {formatTime(tripData?.checkInTime)}</Text>
            <Text style={styles.eventDescription}>{tripData?.accommodationAddress || "No Address"}</Text>
          </View>
        </View>
  
        {/* Activity */}
        {plans.map((plan) => (
          <View key={plan.id} style={styles.timelineEvent}>
            <View style={styles.timelineLine} /> {/* Timeline line */}
            <View style={[styles.timelineIconContainer, styles.activity]}>
              <Hexagon />
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={getPlanIcon(plan.category)} size={24} color="black" />
              </View> {/* Closing the iconContainer View here */}
            </View> {/* Closing the timelineIconContainer View here */}
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{plan.activityTitle}</Text>
              <Text style={styles.eventDate}>{formatDate(plan.date)} {formatTime(plan.time)}</Text>
              <Text style={styles.eventDescription}>{plan.location}</Text>
            </View>
          </View>
        ))}

      <View style={styles.timelineEvent}>
          <View style={[styles.timelineIconContainer, styles.flight]}>
            <Hexagon />
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="airplane-takeoff" size={24} color="black" />
            </View> {/* Closing the iconContainer View here */}
          </View> {/* Closing the timelineIconContainer View here */}
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Return Flight</Text>
            <Text style={styles.eventDate}>{formatDate(tripData?.returnDate)} {formatTime(tripData?.returnTime)}</Text>
            {tripData?.airline && (
              <Text style={styles.eventDescription}>{tripData.airline} from {tripData.toAirport} to {tripData.fromAirport}</Text>
            )}
          </View>
        </View>
      </ScrollView>
  
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
    //borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    
    zIndex: 2,
  },
  eventContent: {
    marginLeft: 50,
    paddingLeft: 10,
    //borderLeftWidth: 2,
    //borderLeftColor: '#ddd',
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
    backgroundColor: '#F75B00',
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
  iconContainer: {
    position: 'absolute', // Position the icon inside the hexagon
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the icon is above the hexagon
  },
  timelineLine: {
    width: 4, // Width of the line
    height: '140%', // Full height between the events
    backgroundColor: 'black', // Black color for the line
    position: 'absolute',
    top: 40, // Adjust the top to start from the center of the hexagon
    left: '5%',
    //transform: [{ translateX: -1 }], // Center the line
    zIndex: 0, // Make sure it’s under the icon
  },  
});
