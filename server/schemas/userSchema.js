import UserModel from "../models/userModel.js";
import { hash, compare } from "../helpers/bcrypt.js";
import { signToken } from "../helpers/jwt.js";
import { ObjectId } from "mongodb";

export const userTypeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String
        email: String
        password: String
        followersData: [UserFollow]
        followingData: [UserFollow]
    }

    type UserFollow{
        _id: ID
        username: String
        name: String
    }

    type Query {
        getUsers: [User]
        login(newLogin: LoginInput): String
        searchUser(search: SearchInput):[User]
        getUserById(id: ID): User
        getSignedInUser: User
    }

    input SearchInput {
        keyword:String
    }

    input UserInput {
        name:String
        username: String
        email: String
        password: String
    }

    input LoginInput {
        username: String
        password: String
    }

    type Mutation {
        register(newUser: UserInput): String
    }
`;

export const userResolvers = {
  Query: {
    getUsers: async function () {
      const users = await UserModel.find();

      return users;
    },
    login: async function (_, args) {
      const { newLogin } = args;
      const checkUsername = await UserModel.findOne({
        username: newLogin.username,
      });
      if (!checkUsername) {
        throw new Error("Invalid username/password");
      }

      // console.log(checkUsername);
      const validPassword = compare(newLogin.password, checkUsername.password);

      if (!validPassword) {
        throw new Error("Invalid username/password");
      }
      const token = signToken({ id: checkUsername._id });

      //   console.log(checkUsername._id)
      //   console.log(token)
      return token;
    },
    searchUser: async function (_, args) {
      const { search } = args;
      console.log(search);
      const data = await UserModel.find({
        $or: [
          { name: { $regex: search.keyword, $options: "i" } },
          { username: { $regex: search.keyword, $options: "i" } },
        ],
      });
      return data;
    },
    getUserById: async function (_, args) {
      //belum yang menampilkan yang follow
      const { id } = args;
      const user = await UserModel.findOne({ _id: new ObjectId(id) });

      return user;
    },
    getSignedInUser: async function (_, __, contextValue) {
      const user = await contextValue.auth();
      return user
    }
  },
  Mutation: {
    register: async function (_, args) {
      const { newUser } = args;

      if (!newUser.username) {
        throw new Error("Username is required");
      }
      if (!newUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
        throw new Error("A valid email is required.");
      }
      if (!newUser.password || newUser.password.length < 5) {
        throw new Error(
          "Password is required and must be at least 5 characters long."
        );
      }

      const existingUsername = await UserModel.findOne({
        username: newUser.username,
      });
      if (existingUsername) {
        throw new Error(
          "Username is already taken. Please choose a different one."
        );
      }

      const existingEmail = await UserModel.findOne({ email: newUser.email });
      if (existingEmail) {
        throw new Error(
          "Email is already registered. Please use a different email."
        );
      }

      newUser.password = hash(newUser.password);
      //   console.log(newUser, "<<<<<<<<<<<ARGGSSSS");

      const message = await UserModel.create(newUser);

      return message;
    },
  },
};
