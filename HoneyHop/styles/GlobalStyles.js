import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10,
    width: 200,
  },
  button: {
    backgroundColor: "green",
    padding: 9,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default GlobalStyles;