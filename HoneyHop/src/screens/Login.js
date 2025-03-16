import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth, db } from '../firebaseConfig';
import * as LocalAuthentication from 'expo-local-authentication';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {  
    try {
      const userCredential = await signInWithEmailAndPassword(firebase_auth, email, password);
      const user = userCredential.user;
      console.log("Logged in successfully.");

      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log("No such document!");
        await setDoc(docRef, {
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
        });
        console.log("User document created successfully.");
        navigation.navigate("List");
      } else {
        console.log("Document data:", docSnap.data());
        navigation.navigate("List");
      }

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
