import React, { useState, useEffect, use } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { ActivityIndicator } from 'react-native-paper';
import { firebase_auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";

// Use react-native-maps and OpenStreetMap API to display map
export default function MapScreen() {
  const [city, setCity] = useState(null);                   // City name
  const [airport, setAirport] = useState(null);             // To airport address
  const [accommodation, setAccommodation] = useState(null); // Accommodation address

  // Coordinates
  const [airportCoordinates, setAirportCoordinates] = useState(null);
  const [accommodationCoordinates, setAccommodationCoordinates] = useState(null);
  const [region, setRegion] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Data from FireStore
  const [tripData, setTripData] = useState([]);
  const [plans, setPlans] = useState([]);

  // On first render, fetch flight, accommodation, and plan details
  useEffect(() => {
    fetchTripData();  // Flights, accommodation
    fetchPlans();     // Food, activity
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (tripData?.tripName) {
        // Get the coordinates from city name
        const coordinates = await fetchCityCoordinates(tripData.tripName);
        if (coordinates) {
          console.log("City coordinates:", coordinates);
          setRegion({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setLoading(false);  // Set loading to false once the region is set
        } else {
          console.log("City coordinates not found.");
        }
      }
    };

    fetchCoordinates();
  }, [tripData]);

  useEffect(() => {
    if (airport) {
      // Fetch airport coordinates when airport address is available
      const fetchAndSetAirportCoords = async () => {
        const coordinates = await fetchAirportCoordinates();
        if (coordinates) {
          setAirportCoordinates(coordinates);
          console.log("Airport coordinates set.");
          setLoading(false);
        } else {
          console.log("No coordinates found for the airport.");
        }
      };
  
      fetchAndSetAirportCoords();
    }
  }, [airport]);

  useEffect(() => {
    if (accommodation) {
      // Fetch accommodation coordinates when accommodation address is available
      const fetchAndSetAccommodationCoords = async () => {
        const coordinates = await fetchAccommodationCoordinates();
        if (coordinates) {
          setAccommodationCoordinates(coordinates);
          console.log("Accommodation coordinates set.");
          setLoading(false);
        } else {
          console.log("No coordinates found for accommodation.");
        }
      };
  
      fetchAndSetAccommodationCoords();
    }
  }, [accommodation]);

  // Get coordinates from city name
  async function fetchCityCoordinates() {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
    }
  }

  // Get airport coordinates from airport address
  async function fetchAirportCoordinates() {
    try {
      if (airport) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(airport)}`);
        const data = await response.json();

        if (data.length > 0) {
          return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          };
        }
      } else {
        console.log("Airport address is empty.");
      }
    } catch (error) {
      console.error("Error fetching airport coordinates: ", error);
    }
  }

  // Get airport coordinates from airport address
  async function fetchAccommodationCoordinates() {
    try {
      if (airport) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(accommodation)}`);
        const data = await response.json();

        if (data.length > 0) {
          return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          };
        }
      } else {
        console.log("Accommodation address is empty.");
      }
    } catch (error) {
      console.error("Error fetching accommodation coordinates: ", error);
    }
  }

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
      
      const firstTrip = trips[0] || {};
      setTripData(firstTrip);
      setCity(firstTrip.tripName);
      console.log("city set: ", city);
      setAirport(firstTrip.toAirport);
      console.log("Airport set: ", airport);
      setAccommodation(firstTrip.accommodationAddress);
      console.log("Accommodation set: ", accommodation);
      
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
      setPlans(newPlans);
    });
  }

  if (loading || !region) {
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
          coordinate={{ 
            latitude: region.latitude, 
            longitude: region.longitude }}
          title={city}
        />

      {airportCoordinates && (
        <Marker
          coordinate={{
            latitude: airportCoordinates.latitude,
            longitude: airportCoordinates.longitude,
          }}
          title={airport} // Set the title for the marker (airport name)
        />
      )}

      {accommodationCoordinates && (
        <Marker
          coordinate={{
            latitude: accommodationCoordinates.latitude,
            longitude: accommodationCoordinates.longitude,
          }}
          title={accommodation} // Set the title for the marker (airport name)
        />
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
