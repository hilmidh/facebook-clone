import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen";
import UserDetailScreen from "./screens/UserDetailScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SearchUser from "./screens/searchScreen";
import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import AuthContext from "./context/AuthContext";
import client from "./config/apollo";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const BerandaNavigator = () => {
  return (
    <View style={styles.tabContainer}>
      {/* Facebook Title */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Facebook</Text>
      </View>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#fff" }, // White tab background
          tabBarIndicatorStyle: { backgroundColor: "#4267B2" }, // Facebook blue indicator
          tabBarLabelStyle: { color: "#4267B2", fontWeight: "bold" }, // Facebook blue text
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchUser} />
        <Tab.Screen name="Account" component={UserNavigator} />
      </Tab.Navigator>
    </View>
  );
};

const UserNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="BerandaNavigator"
              component={BerandaNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "#4267B2", // Facebook blue
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
