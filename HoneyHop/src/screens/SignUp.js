import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from "../firebaseConfig";

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
        <View>
            <Text>Sign Up</Text>
            <TextInput
                // onChangeText={onChangeText}
                value={firstname}
                placeholder='First Name'
            />
            <TextInput
                // onChangeText={onChangeText}
                value={lastname}
                placeholder='Last Name'
            />
            <TextInput
                // onChangeText={onChangeText}
                value={email}
                placeholder='Email'
            />
            <TextInput
                // onChangeText={onChangeText}
                value={username}
                placeholder='Username'
            />
            <TextInput
                // onChangeText={onChangeText}
                value={password}
                placeholder='Password'
                secureTextEntry
            />
            <TouchableOpacity onPress={handleSignUp}>
                <Text>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}