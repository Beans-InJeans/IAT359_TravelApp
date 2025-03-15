import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';  // Used to access the passed tripData

export default function Timeline() {
  const route = useRoute();  // Access the route params
  const { tripData } = route.params;  // Extract trip data

  // Function to format events chronologically and display a vertical timeline
  const events = [
    {
      title: 'Departure Flight',
      date: new Date(tripData.departureDate),
      time: new Date(tripData.departureTime),
      description: `${tripData.airline} from ${tripData.fromAirport} to ${tripData.toAirport}`,
      type: 'flight',
    },
    // Add more events here, like accommodation check-in/check-out or other plans
  ];

  return (
    <View style={styles.container}>
      {/* Trip Name */}
      <Text style={styles.title}>{tripData.tripName}</Text>

      {/* Date Range */}
      <Text style={styles.dateRange}>
        {tripData.startDate.toDateString()} - {tripData.endDate.toDateString()}
      </Text>

      {/* Timeline Section */}
      <ScrollView style={styles.timeline}>
        {events.map((event, index) => (
          <View key={index} style={styles.timelineEvent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>{event.date.toDateString()} at {event.time.toLocaleTimeString()}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>
        ))}
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
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 16,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#444',
  },
});
