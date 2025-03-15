import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Timeline() {
  const route = useRoute();
  const tripData = route.params?.tripData;

  if (!tripData) {
    return (
      <View style={styles.container}>
        <Text>No trip data available</Text>
      </View>
    );
  }

  console.log(tripData.accommodationName);

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
              name="airplane-takeoff"
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
});
