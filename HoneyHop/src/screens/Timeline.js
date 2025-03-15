import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';  // Used to access the passed tripData
import { MaterialCommunityIcons } from '@expo/vector-icons';  // Icon library

export default function Timeline() {
  const route = useRoute();  // Access the route params
  const tripData = route.params?.tripData;

  if (!tripData) {
    return (
      <View style={styles.container}>
        <Text>No trip data available</Text>
      </View>
    );
  }

  // Function to format events chronologically and display a vertical timeline
  const events = [
    {
      title: 'Departure Flight',
      date: tripData.departureDate ? new Date(tripData.departureDate) : null,
      time: tripData.departureTime ? new Date(tripData.departureTime) : null, // Ensure valid Date
      description: `${tripData.airline} from ${tripData.fromAirport} to ${tripData.toAirport}`,
      type: 'flight',
    },
    {
      title: 'Hotel Check-in',
      date: tripData.hotelCheckIn ? new Date(tripData.hotelCheckIn) : null,
      description: tripData.hotelName ? `Check-in at ${tripData.hotelName}` : null,
      type: 'hotel',
    },
    {
      title: 'City Tour',
      date: tripData.activityDate ? new Date(tripData.activityDate) : null,
      description: tripData.activityName ? `Activity: ${tripData.activityName}` : null,
      type: 'activity',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Trip Name */}
      <Text style={styles.title}>{tripData.tripName}</Text>

      {/* Date Range */}
      <Text style={styles.dateRange}>
        {tripData.startDate ? tripData.startDate.toDateString() : ''} - {tripData.endDate ? tripData.endDate.toDateString() : ''}
      </Text>

      {/* Timeline Section */}
      <ScrollView style={styles.timeline}>
        <View style={styles.timelineContainer}>
          {events.map((event, index) => {
            // Skip rendering event if no valid date or description
            if (!event.date && !event.description) return null;

            return (
              <View key={index} style={styles.timelineEvent}>
                <View style={[styles.timelineIconContainer, styles[event.type]]}>
                  <MaterialCommunityIcons
                    name={event.type === 'flight' ? 'airplane-takeoff' : event.type === 'hotel' ? 'home-city' : 'map'}
                    size={24}
                    color="white"
                  />
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {/* Only render date and time if valid */}
                  {event.date && (
                    <Text style={styles.eventDate}>
                      {event.date.toDateString()}
                      {event.time && ` at ${event.time.toLocaleTimeString()}`}
                    </Text>
                  )}
                  {/* Only render description if valid */}
                  {event.description && (
                    <Text style={styles.eventDescription}>{event.description}</Text>
                  )}
                </View>
              </View>
            );
          })}
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
  timelineContainer: {
    position: 'relative',
    paddingVertical: 20,
  },
  timelineEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,  // Space for each event
  },
  timelineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
    zIndex: 2,  // Make sure the icon stays on top of the line
  },
  flight: {
    backgroundColor: '#3498db',
  },
  hotel: {
    backgroundColor: '#2ecc71',
  },
  activity: {
    backgroundColor: '#f39c12',
  },
  eventContent: {
    marginLeft: 50, // To leave space for the vertical line and icon
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
