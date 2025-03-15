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

  const events = [
    {
      title: 'Departure Flight',
      date: tripData.departureDate ? new Date(tripData.departureDate) : null,
      time: tripData.departureTime ? new Date(tripData.departureTime) : null,
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
      title: 'Hotel Check-out',
      date: tripData.hotelCheckOut ? new Date(tripData.hotelCheckOut) : null,
      description: `Leaving ${tripData.hotelName}`,
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
      <Text style={styles.title}>{tripData.tripName}</Text>
      <Text style={styles.dateRange}>
        {tripData.startDate ? new Date(tripData.startDate).toDateString() : ''} - {tripData.endDate ? new Date(tripData.endDate).toDateString() : ''}
      </Text>

      <ScrollView style={styles.timeline}>
        <View style={styles.timelineContainer}>
          {events.map((event, index) => {
            if (!event.date && !event.description) return null;

            return (
              <View key={index} style={styles.timelineEvent}>
                <View style={[styles.timelineIconContainer, styles[event.type]]}>
                  <MaterialCommunityIcons
                    name={
                      event.type === 'flight' ? 'airplane-takeoff' :
                      event.type === 'hotel' ? 'bed' :
                      'map'
                    }
                    size={24}
                    color="white"
                  />
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.date && (
                    <Text style={styles.eventDate}>
                      {event.date.toDateString()}
                      {event.time && ` at ${event.time.toLocaleTimeString()}`}
                    </Text>
                  )}
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
  hotel: {
    backgroundColor: '#9b59b6',
  },
  activity: {
    backgroundColor: '#f39c12',
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