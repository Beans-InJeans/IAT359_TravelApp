import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';


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
    <Text style={GlobalStyles.text}>Confirm Login</Text>
    <TouchableOpacity
      style={GlobalStyles.button}
      onPress={() => navigation.navigate('Home')}>
      <Text style={GlobalStyles.buttonText}>Login</Text>
    </TouchableOpacity>
    <Text style={GlobalStyles.text}>Login with FaceID</Text>
    <TouchableOpacity
      style={GlobalStyles.button}
      onPress={() => navigation.navigate('Home')}>
      <Text style={GlobalStyles.buttonText}>Login</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({          // Add this 
});
