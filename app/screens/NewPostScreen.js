import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { gql, useMutation } from "@apollo/client";

const ADD_POST = gql`
mutation AddPost($newPost: PostInput) {
  AddPost(newPost: $newPost) 
}
`

export default function NewPostScreen({ navigation }) {
  const [content, setContent] = useState(""); // State for post content
  const [imgUrl, setImgUrl] = useState(""); // State for post image (optional)

  const [addPost, { loading: addPostLoading, error: addPostError }] = useMutation(ADD_POST, {
    onCompleted: () => {
      Alert.alert("Success", "Your post has been added!");
      navigation.goBack(); // Navigate back to the previous screen
    },
  });

  const handleAddPost = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Post content cannot be empty!");
      return;
    }

    const payload = {
      content,
      imgUrl
    };

    addPost({
      variables: {
        newPost: payload,
      },
    }).catch((err) => {
      console.error("Error adding post:", err.message);
      Alert.alert("Error", "Failed to add post. Please try again.");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Post</Text>

      {/* Post Content Input */}
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imgUrl}
        onChangeText={(text) => setImgUrl(text)}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.postButton} onPress={handleAddPost}>
        <Text style={styles.postButtonText}>POST</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  imageUploadText: {
    marginLeft: 10,
    color: "#4267B2",
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: "#4267B2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
