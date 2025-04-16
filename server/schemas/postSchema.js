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
        AddComment(newComment: CommentInput): String
        LikePost(username:String, postId: ID): String
    }

    input CommentInput{
        content: String
        username: String
        postId: ID
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
    AddPost: async function(_, args, contextValue) {
        await contextValue.auth()
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
    },
    AddComment: async function (_, args, contextValue) {
        await contextValue.auth()
        const {newComment} = args
        // console.log(newComment)
        if(!newComment.content){
            throw new Error("comment is required")
        }
        if(!newComment.username){
            throw new Error("username is required")
        }

        await PostModel.updateOne({_id: new ObjectId(newComment.postId)}, { $push: { comments: { content: newComment.content, username: newComment.username } } })
        return "Success add new comment"
    },
    LikePost: async function (_, args) {
        const {username, postId} = args
        // console.log(username, postId)
        if(!username){
            throw new Error("username is required")
        }
        await PostModel.updateOne({_id: new ObjectId(postId)}, {$push: {likes: {username}}})
        return "Success liking post"
    }
  }
};
