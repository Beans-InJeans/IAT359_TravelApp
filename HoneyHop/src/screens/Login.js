import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../firebaseConfig';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { TextInput as PaperInput, Button as PaperButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
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

      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userPassword", password);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
        });
        console.log("User document created successfully.");
        navigation.navigate("List");
      } else {
        console.log("Document data:", docSnap.data());
        navigation.navigate("Timeline");
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
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 15,
    marginLeft: 50,
    marginRight: 50,
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

export default Login;
