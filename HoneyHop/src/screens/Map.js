import React, { useState, useEffect, use } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { ActivityIndicator } from 'react-native-paper';
import { firebase_auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import * as Location from 'expo-location';  // For getting current location
import axios from 'axios';                  // For HTTP requests

// Use react-native-maps and OpenStreetMap API to display map
export default function MapScreen() {
  const [city, setCity] = useState(null);                   // City name
  const [airport, setAirport] = useState(null);             // To airport address
  const [accommodation, setAccommodation] = useState(null); // Accommodation address
  const [planNames, setPlanNames] = useState([]);           // Plan name
  const [planLocations, setPlanLocations] = useState([]);   // Plan address

  // For current location
  const [location, setLocation] = useState(null);
  const API_KEY = '86d37fb6c5548c2258c7beade20375f9';

  // Coordinates
  const [airportCoordinates, setAirportCoordinates] = useState(null);
  const [accommodationCoordinates, setAccommodationCoordinates] = useState(null);
  const [planCoordinates, setPlanCoordinates] = useState([]);
  const [region, setRegion] = useState(null);

  // Loading states
  const [isCityLoading, setIsCityLoading] = useState(true);
  const [isAirportLoading, setIsAirportLoading] = useState(true);
  const [isAccommodationLoading, setIsAccommodationLoading] = useState(true);
  const [isPlansLoading, setIsPlansLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // Data from FireStore
  const [tripData, setTripData] = useState([]);
  const [plans, setPlans] = useState([]);

  // On first render, fetch flight, accommodation, and plan details
  useEffect(() => {
    fetchTripData();  // Flights, accommodation
    fetchPlans();     // Food, activity

    /* 
     * Gets device location
     * This is a self-executing async function. It runs as soon as it's defined.
     */
    (async () => {
      // Asks user for permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      // In case the user denies access
      if (status !== 'granted') {
        console.log("Location permission granted.")
        return;
      } else {
        console.log("Location permission denied.");
      }

      // Gets current longitude and latitude using expo-location library
      // Note: Android Studio provides a mock location
      let loc = await Location.getCurrentPositionAsync({});
      console.log("Current location: ", loc);
      
    })();
  }, []);

  // Get city coordinates and set map region
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (tripData?.tripName && !region) {
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
          setIsCityLoading(false);  // Set loading to false once the region is set
          checkLoadingStates();
        } else {
          console.log("City coordinates not found.");
        }
      }
    };

    // Prevent unnecessary calls if region already set
    if (!region && tripData?.tripName) {
      fetchCoordinates();
    }
  }, [tripData]);


  // Get and set airport coordinates
  useEffect(() => {
    // Only fetch if airport coordinates aren't already set
    if (airport) {
      const fetchAndSetAirportCoords = async () => {
        const coordinates = await fetchAirportCoordinates();
        if (coordinates) {
          setAirportCoordinates(coordinates);
          console.log("Airport coordinates set: ", airportCoordinates);
          setIsAirportLoading(false);
          checkLoadingStates();
        } else {
          console.log("No coordinates found for the airport.");
        }
      };
  
      fetchAndSetAirportCoords();
    }
  }, [airport]);

  // Get and set accommodation coordinates
  useEffect(() => {
    // Only fetch if accommodation coordinates aren't already set
    if (accommodation) {
      const fetchAndSetAccommodationCoords = async () => {
        const coordinates = await fetchAccommodationCoordinates();
        if (coordinates) {
          setAccommodationCoordinates(coordinates);
          console.log("Accommodation coordinates set: ", accommodationCoordinates);
          setIsAccommodationLoading(false);
          checkLoadingStates();
        } else {
          console.log("No coordinates found for accommodation.");
        }
      };
  
      fetchAndSetAccommodationCoords();
    }
  }, [accommodation]);

  // // Get and set plan coordinates
  useEffect(() => {
    if (planLocations.length > 0 && planCoordinates.length === 0) {
      const fetchAndSetPlanCoords = async () => {
        const coordinates = await fetchPlanCoordinates();
        if (coordinates.length > 0) {
          setPlanCoordinates(coordinates);
          console.log("Plan coordinates set: ", {planCoordinates});
          setIsPlansLoading(false);
          checkLoadingStates();
        } else {
          console.log("No coordinates found for plans.");
        }
      };

      fetchAndSetPlanCoords();
    }
  }, [planLocations]);

  // A simple function that enforces a delay
  const delay = ms => new Promise(resolve => {
    console.log(`Delaying for ${ms}ms`);
    setTimeout(resolve, ms);
  });

  // Set loading to false after all data is fetched
  const checkLoadingStates = () => {
    // if (!isCityLoading && !isAirportLoading && !isAccommodationLoading && !isPlansLoading) {
    //   setLoading(false);
    // }
    if (!isCityLoading && !isAirportLoading && !isAccommodationLoading) {
      setLoading(false);
    }
  };

  // Fetch coordinates from city name
  async function fetchCityCoordinates() {
    try {
      // await delay(1000);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (data.length > 0) {
        console.log("Data returned by fetchCityCoordinates: ", data);
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
    }
  }

  // Fetch airport coordinates from airport address or name
  async function fetchAirportCoordinates() {
    try {
      if (airport) {
        // await delay(1000);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(airport)}`);
        const data = await response.json();

        if (data.length > 0) {
          console.log("Data returned by fetchAirportCoordinates: ", data);
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

  // Fetch accommodation coordinates from address or name
  async function fetchAccommodationCoordinates() {
    try {
      if (accommodation) {
        // await delay(1000);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(accommodation)}`);
        const data = await response.json();

        if (data.length > 0) {
          console.log("Data returned by fetchAccommodationCoordinates: ", data);
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

  // // Fetch plan coordinates from address or name
  async function fetchPlanCoordinates() {
    let coordinates = [];
    for (const loc of planLocations) {
      try {
        if (loc) {
          // Wait for the delay before making the fetch call
          await delay(1000);
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc)}`);
          const data = await response.json();

          if (data.length > 0) {
            const coords = {
              latitude: parseFloat(data[0].lat),
              longitude: parseFloat(data[0].lon),
            };
            coordinates.push(coords);
          }
        } else {
          console.log("Location is empty.");
        }
      } catch (error) {
        console.error("Error fetching plan coordinates: ", error);
      }
    }

    console.log("Plan coordinates returned: ", {coordinates});
    return coordinates;
  }

  // Fetch all trip data (City, accommodation, flights) from FireStore
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

  // // Fetch all plans (food, acitivities) from FireStore
  function fetchPlans() {
    const user = firebase_auth.currentUser;
    if (!user) return;

    const plansCollectionRef = collection(doc(db, "users", user.uid), "plans");
    onSnapshot(plansCollectionRef, (snapshot) => {
      const newPlans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Get the object array from FireStore and put it into plans
      console.log("Plans fetched: ", newPlans);
      setPlans(newPlans);
      console.log("Plans set: ", plans);

      // Get the plan name from each plan in the array and put it in planNames
      const names = newPlans.map((plan) => plan.activityTitle); 
      setPlanNames(names);

      // Get the plan location from each plan in the array and put it in planLocations
      const locations = newPlans.map((plan) => plan.location); 
      setPlanLocations(locations);
      
      // Check names and locations
      console.log("Plan names and locations set: ", { names, locations });
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

      {planCoordinates && planCoordinates.length > 0 && planNames && planNames.length > 0 && (
        planCoordinates.map((coords, index) => (
          <Marker
            key={index} // Ensure unique key for each Marker
            coordinate={{
              latitude: coords.latitude,
              longitude: coords.longitude,
            }}
            title={planNames[index]} // Use the title from the planNames array
          />
        ))
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
