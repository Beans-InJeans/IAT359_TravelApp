import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from "../firebaseConfig";
import GlobalStyles from "../../styles/GlobalStyles";
import { TextInput as PaperInput, Button as PaperButton } from "react-native-paper";

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(firebase_auth, email, password);
            console.log("User created successfully.");
            navigation.navigate("Login");
        } catch (error) {
            console.error(error.message);
            Alert.alert("Sign-Up Failed", error.message);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={GlobalStyles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <PaperInput
                label="First Name"
                mode="outlined"
                onChangeText={text => setFirstname(text)}
                value={firstname}
                style={styles.input}
            />
            <PaperInput
                label="Last Name"
                mode="outlined"
                onChangeText={text => setLastname(text)}
                value={lastname}
                style={styles.input}
            />
            <PaperInput
                label="Email"
                mode="outlined"
                onChangeText={text => setEmail(text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <PaperInput
                label="Username"
                mode="outlined"
                onChangeText={text => setUsername(text)}
                value={username}
                style={styles.input}
            />
            <PaperInput
                label="Password"
                mode="outlined"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
                style={styles.input}
            />
            <PaperButton
                mode="contained"
                onPress={handleSignUp}
                style={styles.button}
                labelStyle={styles.buttonText}
            >
                Sign Up
            </PaperButton>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 15,
        width: "80%",
    },
    button: {
        marginTop: 10,
        width: "80%",
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});

