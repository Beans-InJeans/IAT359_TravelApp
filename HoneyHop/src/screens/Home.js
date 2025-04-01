import { View, Text, Image, StatusBar, StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useFonts } from 'expo-font';

export default function Home({ navigation }) {
  //load brand font before rendering
  const [fontsLoaded] = useFonts({
    'BricolageGrotesque-ExtraBold': require('../../assets/fonts/BricolageGrotesque-ExtraBold.ttf'),
  });

  if (!fontsLoaded) return null; 

  return (
    <View style={styles.container}>
      {/* style logo and header*/}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/HoneyHop-Logo.png')} style={styles.logo} />
        <Text style={styles.header}>HoneyHop</Text>
      </View>

      <StatusBar style="auto" />

      <View style={styles.buttonContainer}></View>
      <PaperButton
        mode="contained"
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Login
      </PaperButton>

      <PaperButton
        mode="contained"
        onPress={() => navigation.navigate('SignUp')}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Sign Up
      </PaperButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe850',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 30,
  },
  logo: {
    width: 50, 
    height: 50, 
    marginRight: 5, 
    resizeMode: 'contain', 
  },
  header: {
    fontSize: 45,
    fontFamily: 'BricolageGrotesque-ExtraBold',
    fontWeight: '800',
    color: '#000000',
  },
  
  button: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f75b00',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
