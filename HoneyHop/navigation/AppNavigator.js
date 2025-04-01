import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Image } from "react-native";
import Home from "../src/screens/Home";
import Login from "../src/screens/Login";
import SignUp from "../src/screens/SignUp";
import Timeline from "../src/screens/Timeline";
import Map from "../src/screens/Map";
import List from "../src/screens/List";
import Plan from "../src/screens/Plan";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Bottom tab navigation for timeline and map
function TimelineMapTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Timeline" component={Timeline} />
            <Tab.Screen name="Map" component={Map} />
        </Tab.Navigator>
    );
}

//Stack navigation for the app
function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerTintColor: "#000", 
                headerTitleAlign: "right", 
                headerRight: () => (
                    <View>
                        <Image
                            source={require("../assets/HoneyHop-Logo.png")}
                            style={{ width: 100, height: 30, resizeMode: "contain" }}
                        />
                    </View>
                ),
                //Conditionally set headerStyle based on screen
                headerStyle: {
                    backgroundColor: 
                        route.name === "Home" || route.name === "Login" || route.name === "SignUp" 
                        ? "#ffe850" 
                        : "#FAFAFA", 
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTitle: "", 
            })}
        >
            {/* Define stack screens */}
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
