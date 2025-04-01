import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../firebaseConfig';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { DefaultTheme, Provider as PaperProvider, TextInput as PaperInput, Button as PaperButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

//sets theme for the app, defining primary colours
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black', 
    background: '#ffe850', 
  },
};

const Login = ({ navigation }) => {

  //state hooks for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {

    //function to retrieve stored email and password using biometric authentication
    const getEmailFromStore = async () => {
      try {
        const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
        console.log("Biometric available: ", hasBiometrics);

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        console.log("Biometric enrolled: ", isEnrolled);

        console.log("Attempting authentication...");

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate for login details",
        });
        
        if (result.success) {
          console.log("Biometric successful");

          const storedEmail = await AsyncStorage.getItem("userEmail");
          const storedPassword = await AsyncStorage.getItem("userPassword");

          if (storedEmail && storedPassword) {
            setEmail(storedEmail);
            setPassword(storedPassword);
            console.log(storedEmail);
          } else {
            console.log("Email not found in AsyncStorage");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    getEmailFromStore();
  }, []);

  const handleLogin = async () => {  
    try {
      const userCredential = await signInWithEmailAndPassword(firebase_auth, email, password);
      const user = userCredential.user;
      console.log("Logged in successfully.");

      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      //store login credentials locally for future biometric authentication
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userPassword", password);

      //if user document does not exist, create a new one
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
        });
        console.log("User document created successfully.");
        navigation.reset({
          index: 0,
          routes: [
            { name: 'List' },
          ]
        });
      } else {
        console.log("Document data:", docSnap.data());
        navigation.reset({
          index: 1,
          routes: [
            { name: 'List' },
            { name: 'TimelineMapTabs' }
          ]
        });
      }

    } catch (error) {
      console.error(error.message);
      Alert.alert("Login failed", "Invalid email or password.");
    }
  };
  
  return (
    <PaperProvider theme={theme}>
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
        label="Password"
        mode="outlined"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
        style={styles.input}
      />

      <PaperButton
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Login
      </PaperButton>
    </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe850',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 15,
    marginLeft: 50,
    marginRight: 50,
    width: "80%",
    backgroundColor: '#fef3ad',
  },
  button: {
    marginTop: 10,
    width: "80%",
    borderRadius: 8,
    backgroundColor: '#f75b00',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Login;
