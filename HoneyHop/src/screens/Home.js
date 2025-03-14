import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';  
import GlobalStyles from '../../styles/GlobalStyles';

export default function Home() {
  const navigation = useNavigation(); 

  return (
    <View style={GlobalStyles.container}>
      <Text>Welcome to HoneyHop</Text>
      <StatusBar style="auto" />
      <TouchableOpacity 
        style={GlobalStyles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={GlobalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('SignUp')}
        style={GlobalStyles.button}  
      >
        <Text style={GlobalStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
});
