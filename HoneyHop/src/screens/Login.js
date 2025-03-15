import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../firebaseConfig';
import * as LocalAuthentication from 'expo-local-authentication';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {  
    try {
      await signInWithEmailAndPassword(firebase_auth, email, password);
      console.log("Logged in successfully.");
      navigation.navigate("List");
    } catch (error) {
      console.error(error.message);
      Alert.alert("Login failed", "Invalid email or password.");
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={GlobalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={GlobalStyles.text}>Email</Text>
      <TextInput
        style={GlobalStyles.input}
        placeholder='Enter email'
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={GlobalStyles.text}>Password</Text>
      <TextInput
        style={GlobalStyles.input}
        placeholder='Enter password'
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity
        style={GlobalStyles.button}
        onPress={handleLogin}>
        <Text style={GlobalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;
