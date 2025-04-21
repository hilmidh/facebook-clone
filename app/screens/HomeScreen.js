import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { gql, useQuery, useMutation } from "@apollo/client";

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

const LIKE_POST = gql`
  mutation LikePost($postId: ID) {
    LikePost(postId: $postId)
  }
`;

export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useQuery(GET_POST);

  // Fetch signed-in user
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER);

  const [handleLike, { loading: likeLoading, error: likeError }] = useMutation(
    LIKE_POST,
    {
      refetchQueries: [{ query: GET_POST }],
      awaitRefetchQueries: true,
    }
  );
  // Handle loading and error states
  if (postLoading || userLoading) return <Text>Loading...</Text>;
  if (likeLoading) return <Text>Liking...</Text>;
  if (postError || userError)
    return <Text>Error: {postError?.message || userError?.message}</Text>;

  // Extract user data
  const user = userData?.getSignedInUser;

  if (likeError) {
    console.log(likeError);
  }

  const renderPost = ({ item }) => (
    <Pressable
      style={styles.postCard}
      onPress={() => {
        navigation.navigate("PostScreen", { post: item, id: item._id });
      }}
    >
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
        <TouchableOpacity
          style={styles.actions}
          onPress={() => {
            handleLike({
              variables: {
                postId: item._id,
              },
            });
          }}
        >
          <Icon
            name="thumbs-up"
            size={16}
            color={
              item.likes
                .map((e) => e.username)
                .find((el) => el === user.username)
                ? "#4267B2"
                : ""
            }
            style={styles.icon}
          />
          <Text style={styles.actionText}>{item.likes.length}</Text>
        </TouchableOpacity>
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
    </Pressable>
  );

  // if (loading) return <Text>loading...</Text>;
  // if (error) return <Text>Error..</Text>;
  // console.log(data)

  return (
    <View style={styles.container}>
      <Pressable style={styles.addPostCard} onPress={() => {
          navigation.navigate("NewPostScreen")
        }}>
        <Text
          style={styles.addPostInput}
        >What's on your mind?</Text>
        <TouchableOpacity style={styles.addPostButton} onPress={() => {
          navigation.navigate("NewPostScreen")
        }}>
          <Text style={styles.addPostButtonText}>Post</Text>
        </TouchableOpacity>
      </Pressable>

      <FlatList
        data={postData?.getPosts || []}
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
    height: 300,
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
  addPostCard: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  addPostInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  addPostButton: {
    backgroundColor: "#4267B2",
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  addPostButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
