import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const GET_POST = gql`
  query GetPostById($getPostById: ID) {
    getPostById(id: $getPostById) {
      Author {
        username
        name
      }
      _id
      authorId
      content
      createdAt
      comments {
        username
        content
      }
      imgUrl
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($newComment: CommentInput) {
    AddComment(newComment: $newComment)
  }
`;

export default function PostScreen({ route }) {
  const { id } = route.params; // Get the post ID passed from the previous screen
  const [post, setPost] = useState(null); // Initialize post state
  const [comment, setComment] = useState("");
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useQuery(GET_POST, { variables: { getPostById: id } });

  const [handleComment, { loading: commentLoading, error: commentError }] =
    useMutation(ADD_COMMENT, {
      onCompleted: (result) => {
        setComment(""); // Clear the comment input
      },
      refetchQueries: [{ query: GET_POST }],
      awaitRefetchQueries: true,
    });

  const onSubmit = () => {
    if (!comment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    const payload = {
      content: comment,
      postId: id,
    };

    handleComment({
      variables: {
        newComment: payload,
      },
    }).catch((err) => {
      console.error("Error adding comment:", err.message);
    });
  };
  // Use useEffect to set the post state when postData changes
  useEffect(() => {
    if (postData && postData.getPostById) {
      setPost(postData.getPostById);
    }
  }, [postData]);

  if (postLoading) {
    return <Text>Loading...</Text>;
  }

  if (postError) {
    return <Text>Error: {postError.message}</Text>;
  }

  if (!post) {
    return <Text>Loading...</Text>;
  }

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", // Default avatar
        }}
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.username}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Post Author Info */}
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", // Default avatar
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{post.Author.name}</Text>
      </View>

      {/* Post Content */}
      <Text style={styles.caption}>{post.content}</Text>

      {/* Post Image */}
      <Image source={{ uri: post.imgUrl }} style={styles.postImage} />

      {/* Comments Section */}
      <FlatList
        data={post.comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderComment}
        contentContainerStyle={styles.commentsList}
        ListHeaderComponent={
          <Text style={styles.commentsHeader}>Comments</Text>
        }
      />

      {/* Add Comment Input */}
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSubmit}>
          <Icon name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 10,
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
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  actionText: {
    color: "#4267B2",
    fontWeight: "bold",
  },
  commentsList: {
    marginTop: 10,
  },
  commentsHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#4267B2",
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
});
