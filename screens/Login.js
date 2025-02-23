import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


return (
  <View style={styles.container}>
    <Text style={styles.text}>Username</Text>
    <TextInput  
        style={styles.input} 
        placeholder='Enter username'
        onChangeText={text => setUsername(text)}    
        value={username}
    />
    <Text style={styles.text}>Password</Text>
    <TextInput  
        style={styles.input} 
        placeholder='Enter password'
        onChangeText={text => setPassword(text)}    
        value={password}
    />
    <Text style={styles.text}>Confirm Login</Text>
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('Home')}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <Text style={styles.text}>Login with FaceID</Text>
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('Home')}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({          // Add this 
});
