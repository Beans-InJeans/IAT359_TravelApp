import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { firebase_auth } from "./src/firebaseConfig";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppNavigator from './navigation/AppNavigator';

// Import screens
import Home from './src/screens/Home';
import LogIn from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import List from './src/screens/List';
import TimelineScreen from './src/screens/Timeline';
import Map from './src/screens/Map';
import Plan from './src/screens/Plan';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const TimelineTabs = () => {
//   return (
//     <Tab.Navigator initialRouteName='TimelineTab'>
//       <Tab.Screen
//         name='TimelineTab'
//         component={TimelineScreen}
//         options={{
//           tabBarIcon: () => <Ionicons name="list-outline" size={24} />,
//         }}
//       />
//       <Tab.Screen 
//         name='Map'
//         component={Map}
//         options={{
//           tabBarIcon: () => <Ionicons name="map-outline" size={24} />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

/*
 * Only runs once on first render
 * Listens for authentication state (onAuthStateChanged)
 */
export default function App() {
  const[user, setUser] = useState(null);

  useEffect(() => {
    // Unsubscribe prevents memory leaks
    const unsubscribe = onAuthStateChanged(firebase_auth, (user) => {
      if (user) {
        console.log("User logged in:", user.email);
        setUser(user); 
      } else {
        console.log("No user logged in.");
        setUser(null);  
      }
    });

    // Clean up the listener on unmount to prevent memory leaks
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="Login" component={LogIn}/>
        <Stack.Screen name='List' component={List}/>
        <Stack.Screen name='Timeline' component={TimelineScreen}/>
        <Stack.Screen name='Map' component={Map}/>
        <Stack.Screen name='Plan' component={Plan}/>
      </Stack.Navigator> */}
      <AppNavigator user={user}/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
