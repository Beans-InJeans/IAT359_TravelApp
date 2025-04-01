import React, { useState, useEffect, use } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { UrlTile, Marker, Callout } from 'react-native-maps';
import { ActivityIndicator } from 'react-native-paper';
import { firebase_auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import * as Location from 'expo-location';             

//use react-native-maps and OpenStreetMap API to display map
export default function MapScreen() {
  const [city, setCity] = useState(null);                  
  const [airport, setAirport] = useState(null);            
  const [accommodation, setAccommodation] = useState(null); 
  const [planNames, setPlanNames] = useState([]);       
  const [planLocations, setPlanLocations] = useState([]);   

  //coordinates
  const [airportCoordinates, setAirportCoordinates] = useState(null);
  const [accommodationCoordinates, setAccommodationCoordinates] = useState(null);
  const [planCoordinates, setPlanCoordinates] = useState([]);
  const [currentLoc, setCurrentLoc] = useState([]);
  const [region, setRegion] = useState(null);
  
  //loading states
  const [isCityLoading, setIsCityLoading] = useState(true);
  const [isAirportLoading, setIsAirportLoading] = useState(true);
  const [isAccommodationLoading, setIsAccommodationLoading] = useState(true);
  const [isPlansLoading, setIsPlansLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  //data from FireStore
  const [tripData, setTripData] = useState([]);
  const [plans, setPlans] = useState([]);

  //on first render, fetch flight, accommodation, and plan details
  useEffect(() => {
    fetchTripData(); 
    fetchPlans();    
  }, []);

  //on first render, get current location and set it
  useEffect(() => {

      (async () => {
        //asks user for permission to access location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log("Location permission denied.")
          return;
        }
  
        console.log("Location permission granted.");
  
        //gets current longitude and latitude using expo-location library
        let loc = await Location.getCurrentPositionAsync({});
        console.log("Current location: ", loc);
        setCurrentLoc(loc);
      })();
  }, [])

  //get city coordinates and set map region
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (tripData?.tripName && !region) {
        const coordinates = await fetchCityCoordinates(tripData.tripName);
        if (coordinates) {
          console.log("City coordinates:", coordinates);
          setRegion({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setIsCityLoading(false); 
          checkLoadingStates();
        } else {
          console.log("City coordinates not found.");
        }
      }
    };

    //prevent unnecessary calls if region already set
    if (tripData?.tripName) {
      fetchCoordinates();
    }
  }, [tripData]);


  //get and set airport coordinates
  useEffect(() => {
    //only fetch if airport coordinates aren't already set
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

  //get and set accommodation coordinates
  useEffect(() => {
    //only fetch if accommodation coordinates aren't already set
    if (accommodation) {
      const fetchAndSetAccommodationCoords = async () => {
        const coordinates = await fetchAccommodationCoordinates();
        if (coordinates) {
          console.log("Accommodation coordinates fetched: ", coordinates);
          setAccommodationCoordinates(coordinates);
          setIsAccommodationLoading(false);
          checkLoadingStates();
        } else {
          console.log("No coordinates found for accommodation.");
        }
      };
  
      fetchAndSetAccommodationCoords();
    }
  }, [accommodation]);

  //get and set plan coordinates
  useEffect(() => {
    if (planLocations.length > 0 && planCoordinates.length === 0) {
      const fetchAndSetPlanCoords = async () => {
        const coordinates = await fetchPlanCoordinates();
        if (coordinates.length > 0) {
          console.log("Plan coordinates fetched: ", coordinates);
          setPlanCoordinates(coordinates);
          setIsPlansLoading(false);
          checkLoadingStates();
        } else {
          console.log("No coordinates found for plans.");
        }
      };

      fetchAndSetPlanCoords();
    }
  }, [planLocations]);

  //function to format date for text
  function formatDate(date) {
    if (!date) return "No Date";
    if (date.seconds) date = new Date(date.seconds * 1000);
    else date = new Date(date);
    return date.toDateString();
  }

  //a simple function that enforces a delay
  const delay = ms => new Promise(resolve => {
    console.log(`Delaying for ${ms}ms`);
    setTimeout(resolve, ms);
  });

  //set loading to false after all data is fetched
  const checkLoadingStates = () => {
    console.log("City loading: ", isCityLoading);
    console.log("Airport loading: ", isAirportLoading);
    console.log("Accommodation loading: ", isAccommodationLoading);
    console.log("Plans loading: ", isPlansLoading);

    //read the current state using the callback form
    setLoading(
      !isCityLoading &&
      !isAirportLoading &&
      !isAccommodationLoading &&
      !isPlansLoading
    );
  };

  //fetch coordinates from city name
  async function fetchCityCoordinates() {
    try {
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

  //fetch airport coordinates from airport address or name
  async function fetchAirportCoordinates() {
    try {
      if (airport) {
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

  //fetch accommodation coordinates from address or name
  async function fetchAccommodationCoordinates() {
    try {
      if (accommodation) {
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

  //fetch plan coordinates from address or name
  async function fetchPlanCoordinates() {
    let coordinates = [];
    for (const loc of planLocations) {
      try {
        if (loc) {
          //wait for the delay before making the fetch call
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

  //fetch all trip data (City, accommodation, flights) from FireStore
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
      setAccommodation(firstTrip.accommodationName);
      console.log("Accommodation set: ", accommodation);
      
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }

  //fetch all plans (food, acitivities) from FireStore
  function fetchPlans() {
    const user = firebase_auth.currentUser;
    if (!user) return;

    const plansCollectionRef = collection(doc(db, "users", user.uid), "plans");
    onSnapshot(plansCollectionRef, (snapshot) => {
      const newPlans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      //get the object array from FireStore and put it into plans
      console.log("Plans fetched: ", newPlans);
      setPlans(newPlans);

      //get the plan name from each plan in the array and put it in planNames
      const names = newPlans.map((plan) => plan.activityTitle); 
      setPlanNames(names);

      //get the plan location from each plan in the array and put it in planLocations
      const locations = newPlans.map((plan) => plan.location); 
      setPlanLocations(locations);
      
      //check names and locations
      console.log("Plan names and locations set: ", { names, locations });
    });
  }

  //check loading states. If loading, show loading icon.
  if (loading || !region) {
    console.log ("Region state: ", region);
    console.log("Loading state: ", loading);
    console.log("Trip data: ", tripData);
    console.log("Plan data:", plans);
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

        {/* City marker */}
        <Marker
          coordinate={{ 
            latitude: region.latitude, 
            longitude: region.longitude }}
          title={city}
        />

      {/* Airport marker with arrival and departure date */}
      {airportCoordinates && (
        <Marker
          coordinate={{
            latitude: airportCoordinates.latitude,
            longitude: airportCoordinates.longitude,
          }}
          title={airport} // Set the title for the marker (airport name)
        >
          <Callout>
            <Text style={styles.calloutHeader}>{airport}</Text>
            <Text>{`Arrival date: ${formatDate(tripData?.departureDate)}`}</Text>
            <Text>{`Departure date: ${formatDate(tripData?.returnDate)}`}</Text>
          </Callout>
        </Marker>
      )}

      {/* Accommodation marker with check in and out date*/}
      {accommodationCoordinates && (
        <Marker
          coordinate={{
            latitude: accommodationCoordinates.latitude,
            longitude: accommodationCoordinates.longitude,
          }}
          title={accommodation} // Set the title for the marker (accommodation name)
        >
          <Callout>
            <Text style={styles.calloutHeader}>{accommodation}</Text>
            <Text>{`Check in: ${formatDate(tripData?.checkInDate)}`}</Text>
            <Text>{`Check out: ${formatDate(tripData?.checkOutDate)}`}</Text>
          </Callout>
       
        </Marker>
      )}

      {/* Plan markers with location, category, and notes */}
      {planCoordinates && planCoordinates.length > 0 && planNames && planNames.length > 0 && (
        planCoordinates.map((coords, index) => (
          <Marker
            key={index} //ensure unique key for each Marker
            coordinate={{
              latitude: coords.latitude,
              longitude: coords.longitude,
            }}
            title={planNames[index]} //use the title from the planNames array
          >
            <Callout>
              <Text style={styles.calloutHeader}>{planNames[index]}</Text>
              <Text>{`Location: ${plans[index]?.location}`}</Text>
              <Text>{`Category: ${plans[index]?.category}`}</Text>
              <Text>{`Notes: ${plans[index]?.notes}`}</Text>
            </Callout>
          </Marker>
        ))
      )}

      {/* Current location marker */}
      {currentLoc && (
        <Marker
          coordinate={{
            latitude: currentLoc.coords.latitude,
            longitude: currentLoc.coords.longitude,
          }}
          title="Current Location"
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
  calloutHeader: {
    fontWeight: 'bold',
  }
});
