import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { ActivityIndicator } from 'react-native-paper';
import { firebase_auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";

// Use react-native-maps and OpenStreetMap API to display map
export default function MapScreen() {
  // const { city, latitude, longitude, airport } = route.params;  
  const [city, setCity] = useState(null);                   // City name
  const [airport, setAirport] = useState(null);             // To airport address
  const [accommodation, setAccommodation] = useState(null); // Accommodation address
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tripData, setTripData] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchTripData();
    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (tripData?.tripName) {
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
      setAccommodation(firstTrip.accommodationAddress);
      
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

  // (async () => {
  //   const goToMap = async () => {
  //     if (!tripData?.tripName) {
  //       console.log("No city specified.");
  //       return;
  //     }
      
  //     const coordinates = await fetchCityCoordinates(tripData.tripName);
  //     if (coordinates) {
  //       console.log("Coordinates fetched: ", coordinates);
  //     } else {
  //       console.log("City coordinates not found.");
  //     }
  //   };
  
  //   await goToMap();
  // })();  

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
