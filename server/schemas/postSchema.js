import PostModel from "../models/postModel.js";
import { ObjectId } from "mongodb";
import redis from "../config/redis.js";

export const postTypeDefs = `#graphql
    type Post{
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
        Author: Author
    }

    type Author{
        username: String
        name: String
    }

    type Comment{
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }

    type Like{
        username: String
        createdAt: String
        updatedAt: String
    }

    type Query{
        getPosts: [Post]
        getPostById(id: ID): Post
    }

    type Mutation{
        AddPost(newPost: PostInput): String
        AddComment(newComment: CommentInput): String
        LikePost(postId: ID): String
    }

    input CommentInput{
        content: String
        postId: ID
    }
        
    input PostInput{
        content: String
        tags: [String]
        imgUrl: String
    }

`;

export const postResolvers = {
  Query: {
    getPosts: async function (_, __, contextValue) {
      await contextValue.auth();
      // const posts = await PostModel.find();
      // return posts;
      const cachedPosts = await redis.get("posts");
      // console.log(cachedPosts);
      if (cachedPosts) return JSON.parse(cachedPosts);

      const posts = await PostModel.find();

      await redis.set("posts", JSON.stringify(posts));

      return posts;
    },
    getPostById: async function (_, args, contextValue) {
      await contextValue.auth();
      const post = await PostModel.findOne({ _id: new ObjectId(args.id) });
      return post;
    },
  },
  Mutation: {
    AddPost: async function (_, args, contextValue) {
      const user = await contextValue.auth();
      const { newPost } = args;
      // if (!newPost.authorId) {
      //   throw new Error("authorId is required");
      // }

      if (!newPost.content) {
        throw new Error("content is required");
      }
      newPost.createdAt = new Date();
      newPost.updatedAt = new Date();
      newPost.comments = [];
      newPost.likes = [];
      newPost.authorId = new ObjectId(user._id);
      // console.log(newPost);
      const data = await PostModel.create(newPost);
      await redis.del("posts");
      return data;
    },
    AddComment: async function (_, args, contextValue) {
      const user = await contextValue.auth();
      const { newComment } = args;
      // console.log(newComment)
      if (!newComment.content) {
        throw new Error("comment is required");
      }
      // if (!newComment.username) {
      //   throw new Error("username is required");
      // }

      await PostModel.updateOne(
        { _id: new ObjectId(newComment.postId) },
        {
          $set: { updatedAt: new Date() },
          $push: {
            comments: {
              content: newComment.content,
              username: user.username,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }
      );
      return "Success add new comment";
    },
    LikePost: async function (_, args, contextValue) {
      const user = await contextValue.auth();
      const { username, postId } = args;
      // console.log(username, postId)
      // if (!username) {
      //   throw new Error("username is required");
      // }
      await PostModel.updateOne(
        { _id: new ObjectId(postId) },
        {
          $set: { updatedAt: new Date() },
          $push: {
            likes: {
              username: user.username,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }
      );
      return "Success liking post";
    },
  },
};
