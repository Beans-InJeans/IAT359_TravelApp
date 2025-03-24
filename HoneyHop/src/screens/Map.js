import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import AirportMarker from '../components/AirportMarker';
import { fetchCoordinates } from '../api/openAIP';
import { convertIataToIcao } from '../api/iataToIcao';
import { ActivityIndicator } from 'react-native-paper';

// Use react-native-maps and OpenStreetMap API to display map
export default function MapScreen({ route }) {
  const { city, latitude, longitude, airport } = route.params;  
  const [region, setRegion] = useState(null);
  const [airportLocation, setAirportLocation] = useState(null);  
  const [loading, setLoading] = useState(true);

  // Update latitude and longitute when they change
  useEffect(() => {
    if (latitude && longitude) {
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [latitude, longitude]);

  // Get ICAO code for airport and fetch corresponding coordinates 
  useEffect(() => {
    const loadAirport = async () => {
      try {
        if (!airport) {
          console.log("No airport provided.");
          setLoading(false);
          return;
        }

        console.log(`Fetching ICAO for airport: ${airport}`);
        const icao = await convertIataToIcao(airport);

        if (!icao) {
          console.log(`No ICAO found for airport: ${airport}`);
          setLoading(false);
          return;
        }

        console.log(`Fetching coordinates for ICAO: ${icao}`);
        const coords = await fetchCoordinates(icao);

        if (coords) {
          console.log(`Airport coordinates:`, coords);
          setAirportLocation({ ...coords, code: airport });
        } else {
          console.log(`No coordinates found for ICAO: ${icao}`);
        }
      } catch (error) {
        console.error("Error loading airport:", error);
      } finally {
        setLoading(false);   // ✅ Ensure loading stops
      }
    };

    loadAirport();
  }, [airport]);

  if (!region) {
    return (
      <View style={styles.container}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color='#000000' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        region={region}
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          zIndex={1}
        />

        <Marker
          coordinate={{ latitude, longitude }}
          title={city}
        />

        {airportLocation && (
          <AirportMarker location={airportLocation} />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
