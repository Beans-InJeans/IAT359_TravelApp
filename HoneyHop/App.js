import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { firebase_auth } from "./src/firebaseConfig";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import Home from './src/screens/Home';
import LogIn from './src/screens/Login';
import SignUp from './src/screens/SignUp';

const Stack = createStackNavigator();

export default function App() {
  const[user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebase_auth, (user) => {
      if (user) { console.log("user", user.email); }
      setUser(user);
    });
  }, []);  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="Login" component={LogIn}/>
      </Stack.Navigator>
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
