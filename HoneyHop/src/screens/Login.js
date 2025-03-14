import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../firebaseConfig';

export default function Login({navigation}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(firebase_auth, email, password);
      console.log("Logged in successfully.");
      navigation.navigate("List");
    } catch {
      console.error(error.message);
    }
  }

  return (
    <View style = {GlobalStyles.container}>
      <Text style = {GlobalStyles.text}>Username</Text>
      <TextInput  
          style={GlobalStyles.input} 
          placeholder='Enter username'
          onChangeText={text => setUsername(text)}    
          value={username}
      />
      <Text style={GlobalStyles.text}>Password</Text>
      <TextInput  
          style={GlobalStyles.input} 
          placeholder='Enter password'
          onChangeText={text => setPassword(text)}    
          value={password}
      />
      <TouchableOpacity
        style={GlobalStyles.button}
        onPress={handleLogin}>
        <Text style={GlobalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={GlobalStyles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={GlobalStyles.buttonText}>Login with FaceID</Text>
      </TouchableOpacity>
    </View>
  );  
}

const styles = StyleSheet.create({          // Add this 
});
