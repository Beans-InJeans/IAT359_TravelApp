import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to HoneyHop</Text>
      <StatusBar style="auto" />

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
    backgroundColor: '#FAFAFA',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
