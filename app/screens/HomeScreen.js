import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
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
`;

export default function HomeScreen() {
  const { data, loading, error } = useQuery(GET_POST);

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
        <Text style={styles.username}>{item.Author.name}</Text>
      </View>
      {/* Caption */}
      <Text style={styles.caption}>{item.content}</Text>

      {/* Post Image */}
      <Image source={{ uri: item.imgUrl }} style={styles.postImage} />

      {/* Like and Comment Buttons */}
      <View style={styles.actions}>
        <View style={styles.actions}>
          <Icon
            name="thumbs-up"
            size={16}
            color="#4267B2"
            style={styles.icon}
          />
          <Text style={styles.actionText}>
            {item.likes.length}
          </Text>
        </View>
        <View>
          <Text style={styles.actionText}>
            {item.comments.length === 0
              ? "0 Comment"
              : item.comments.length === 1
              ? "1 Comment"
              : `${item.comments.length} Comments`}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) return <Text>loading...</Text>;
  if (error) return <Text>Error..</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data.getPosts}
        keyExtractor={(data) => data._id}
        renderItem={renderPost}
        contentContainerStyle={styles.postsList}
      />
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
    height: 500,
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
    color: "#575757",
  },
  icon: {
    marginRight: 5,
  },
});
