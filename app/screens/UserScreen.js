import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { gql, useQuery } from "@apollo/client";

const GET_USER = gql`
  query GetSignedInUser {
    getSignedInUser {
      email
      _id
      name
      username
      followingData {
        name
        username
      }
      followersData {
        name
        username
      }
    }
  }
`;

export default function UserScreen() {
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext);

  const { data, loading, error } = useQuery(GET_USER);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error....</Text>;
  }

  const user = data?.getSignedInUser;

  return (
    <View style={styles.container}>
      {/* Account Card */}
      <Pressable
        style={styles.card}
        onPress={() => {
          navigation.navigate("UserDetailScreen"),
            { name: user?.name, id: user?._id };
        }}
      >
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", // Default Facebook-like avatar
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.name || "Unknown User"}</Text>
          <Text style={styles.email}>{user?.email || "No Email"}</Text>
        </View>
      </Pressable>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5", // Facebook-like background
    padding: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: "100%",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#4267B2", // Facebook blue
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
