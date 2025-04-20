import { useNavigation } from "@react-navigation/native";
import { View, Text, Button } from "react-native";

export default function UserScreen() {
  const navigation = useNavigation()

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
    </View>
  )
}
