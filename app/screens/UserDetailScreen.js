import { View, Text } from "react-native";

export default function UserDetailScreen({ route }) {
  const { name, id } = route.params

  return (
    <View>
      <Text>UserDetailScreen</Text>
      <Text>Id: {id}</Text>
      <Text>Name: {name}</Text>
    </View>
  )
}
