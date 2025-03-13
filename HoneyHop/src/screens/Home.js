export default function Home() {
  
  return (
    <View style={styles.container}>
      <Text>Welcome to HoneyHop</Text>
      <StatusBar style="auto" />
      <TouchableOpacity><Text>Login</Text></TouchableOpacity>
      <TouchableOpacity><Text>Sign Up</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});