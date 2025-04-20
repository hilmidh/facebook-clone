import React, { use, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { gql, useQuery } from "@apollo/client";

const GET_POST = gql`
query GetPosts {
  getPosts {
    _id
    authorId
    content
    imgUrl
    tags
    comments {
      username
      content
    }
    likes {
      username
    }
    createdAt
    Author {
      username
      name
    }
  }
}
`

export default function HomeScreen() {
  const [apa, setAp] = useState("VKAAAA")
  const [posts, setPosts] = useState([
    {
      id: "1",
      username: "John Doe",
      caption: "Enjoying a sunny day at the beach!",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Beach_at_Fort_Lauderdale.jpg/1200px-Beach_at_Fort_Lauderdale.jpg", // Replace with actual image URL
    },
    {
      id: "2",
      username: "Jane Smith",
      caption: "Had an amazing dinner last night!",
      image: "https://via.placeholder.com/300x200", // Replace with actual image URL
    },
    {
      id: "3",
      username: "Alice Johnson",
      caption: "Exploring the mountains!",
      image: "https://via.placeholder.com/300x200", // Replace with actual image URL
    }
  ]);

  const {data, loading, error} = useQuery(GET_POST)

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", // Default Facebook-like avatar
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{item.username}</Text>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.image }} style={styles.postImage} />

      {/* Caption */}
      <Text style={styles.caption}>{item.caption}</Text>

      {/* Like and Comment Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <Text>loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.postsList}
      /> */}
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Facebook-like background
  },
  postsList: {
    padding: 10,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionText: {
    color: "#4267B2", // Facebook blue
    fontWeight: "bold",
  },
});