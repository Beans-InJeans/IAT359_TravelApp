import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import App from '../App';
import Home from '../src/screens/Home';
import Login from '../src/screens/Login';
import SignUp from '../src/screens/SignUp';
import Timeline from '../src/screens/Timeline';
import Map from '../src/screens/Map';
import List from '../src/screens/List';
import Plan from '../src/screens/Plan';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TimelineMapTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Timeline" component={Timeline} />
            <Tab.Screen name="Map" component={Map} />
        </Tab.Navigator>
    )
}

function AppNavigator() {
    return(
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="List" component={List} />
            <Stack.Screen name="TimelineMapTabs" component={TimelineMapTabs} />
            <Stack.Screen name="Plan" component={Plan} />
        </Stack.Navigator>
    );
}

export default AppNavigator; 