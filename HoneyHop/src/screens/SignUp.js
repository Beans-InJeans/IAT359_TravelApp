import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from "../firebaseConfig";
import GlobalStyles from "../../styles/GlobalStyles";

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const handleSignUp = async() => {
        try {
            await createUserWithEmailAndPassword(firebase_auth, email, password);
            console.log("User created successfully.");
            navigation.navigate("List");
        } catch (error) {
            console.error(error.message);
        }
    }

    return(
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.header} >Sign Up</Text>
            <TextInput
                style={GlobalStyles.input}
                onChangeText={text => setFirstname(text)}    
                value={firstname}
                placeholder='First Name'
            />
            <TextInput
                style={GlobalStyles.input}
                onChangeText={text => setLastname(text)}
                value={lastname}
                placeholder='Last Name'
            />
            <TextInput
                style={GlobalStyles.input}
                onChangeText={text => setEmail(text)}
                value={email}
                placeholder='Email'
            />
            <TextInput
                style={GlobalStyles.input}
                onChangeText={text => setUsername(text)}
                value={username}
                placeholder='Username'
            />
            <TextInput
                style={GlobalStyles.input}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder='Password'
                secureTextEntry
            />
            <TouchableOpacity style={GlobalStyles.button} onPress={handleSignUp}>
                <Text style={GlobalStyles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}