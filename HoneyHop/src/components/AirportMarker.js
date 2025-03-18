import React from 'react';
import { Marker } from 'react-native-maps';

const AirportMarker = ({ location }) => {
  if (!location) return null;

  return (
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
      title={location.name}
    />
  );
};

export default AirportMarker;
