import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from "react-native-maps";
import GlobalStyles from '../../styles/GlobalStyles';

export default function Map() {
  return (
    <View style={GlobalStyles.container}>
      <MapView 
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      />
    </View>
  );
}