import { useNavigation } from "@react-navigation/native";
import { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import * as SecureStore from 'expo-secure-store';
import AuthContext from "../context/AuthContext";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";

const LOGIN = gql`
query login($newLogin: LoginInput) {
  login(newLogin: $newLogin)
}
`

export default function LoginScreen() {
  const { isSignedIn, setIsSignedIn} = useContext(AuthContext)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [handleLogin, { data, loading, error }] = useLazyQuery(LOGIN, {
    onCompleted: async (result) => {
      await SecureStore.setItemAsync("access_token", result.login);
      setIsSignedIn(true)
    }
  })

  const onSubmit = () => {
    handleLogin({
      variables: {
        newLogin: {
          username,
          password
        }
      }
    })
    // console.log(username, password)
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facebook</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        autoCapitalize="none"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        <Text style={styles.registerButtonText}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
      {/* <Button
        title="Get Token"
        onPress={cekToken}
      /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4267B2", // Facebook blue
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4267B2", // Facebook blue
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButtonText: {
    color: "#4267B2", // Facebook blue
    fontSize: 16,
    fontWeight: "bold",
  },
});
