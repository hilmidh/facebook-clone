import PostModel from "../models/postModel.js";
import { ObjectId } from "mongodb"

export const postTypeDefs = `#graphql
    type Post{
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        comments: [Comment]
        likes: [Like]
       
    }

    type Comment{
        content: String
        username: String
    }

    type Like{
        username: String
    }

    type Query{
        getPosts: [Post]
    }

    type Mutation{
        AddPost(newPost: PostInput): Post
    }
        
    input PostInput{
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
    }

`;

export const postResolvers = {
  Query: {
    getPosts: async function () {
      const posts = await PostModel.find();
      return posts
    },
  },
  Mutation: {
    AddPost: async function(_, args) {
        const {newPost} = args
        if(!newPost.authorId){
            throw new Error("authorId is required")
        }

        if(!newPost.content){
            throw new Error("content is required")
        }
        newPost.authorId = new ObjectId(newPost.authorId)
        console.log(newPost)
        const post = await PostModel.create(newPost)
        return post 
    }
  }
};
