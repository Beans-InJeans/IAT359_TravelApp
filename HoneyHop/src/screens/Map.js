import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';

export default function MapScreen({ route }) {
  const { city, latitude, longitude } = route.params; // Get passed data
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
      // Set region to center the map on the city's coordinates
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,  // zoom level
        longitudeDelta: 0.0421, // zoom level
      });
    }
  }, [latitude, longitude]);

  if (!region) {
    return (
      <View style={styles.container}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        region={region} // Use the region state to center the map
      >
        {/* OpenStreetMap Tile Layer */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          zIndex={1}
        />
        {/* Marker to show the city's position */}
        <Marker
          coordinate={{ latitude, longitude }}
          title={city}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Ensures the map fills the container
  },
});
