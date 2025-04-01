import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Image } from "react-native";
import Home from "../src/screens/Home";
import Login from "../src/screens/Login";
import SignUp from "../src/screens/SignUp";
import Timeline from "../src/screens/Timeline";
import Map from "../src/screens/Map";
import List from "../src/screens/List";
import Plan from "../src/screens/Plan";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TimelineMapTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Timeline" component={Timeline} />
            <Tab.Screen name="Map" component={Map} />
        </Tab.Navigator>
    );
}

function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerTintColor: "#000", // Gold text/icons
                headerTitleAlign: "right", // Align the logo to the right
                headerRight: () => (
                    <View>
                        <Image
                            source={require("../assets/HoneyHop-Logo.png")}
                            style={{ width: 100, height: 30, resizeMode: "contain" }}
                        />
                    </View>
                ),
                // Conditionally set headerStyle based on screen
                headerStyle: {
                    backgroundColor: 
                        route.name === "Home" || route.name === "Login" || route.name === "SignUp" 
                        ? "#ffe850" // Yellow color
                        : "#FAFAFA", // Light gray color for other screens
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTitle: "", // Hide the title
            })}
        >
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
