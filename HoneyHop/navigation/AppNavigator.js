import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import App from '../App';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';


const Stack = createStackNavigator();

function AppNavigator() {
    return(
        <Stack.Navigator initialRouteName="App">
            <Stack.Screen name="App" component={AppScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}

export default AppNavigator; 