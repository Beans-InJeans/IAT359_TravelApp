import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import GlobalStyles from '../../styles/GlobalStyles';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
        {/* OSM Tile Layer inside MapView */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          zIndex={1}
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
    ...StyleSheet.absoluteFillObject, // Ensures map fills the container
  },
});
