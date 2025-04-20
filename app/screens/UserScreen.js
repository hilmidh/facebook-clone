import { useNavigation } from "@react-navigation/native";
import { View, Text, Button } from "react-native";
import * as SecureStore from "expo-secure-store"
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function UserScreen() {
  const navigation = useNavigation()
  const { setIsSignedIn } = useContext(AuthContext)

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token")
    setIsSignedIn(false)
  }

  return (
    <View>
      <Text>UserScreen</Text>
      <Button
        title="Detail"
        onPress={() => navigation.navigate("UserDetailScreen", {
          name: "Udin",
          id: 100
        })}
      />
      <Button
        title="Logout"
        onPress={handleLogout}
      />
    </View>
  )
}
