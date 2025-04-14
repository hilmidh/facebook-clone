import UserModel from "../models/userModel.js";
import { hash, compare } from "../helpers/bcrypt.js";
import { signToken, verifyToken } from "../helpers/jwt.js";

export const userTypeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String
        email: String
        password: String
    }

    type Query {
        getUsers: [User]
        login(newLogin: LoginInput): String
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

      console.log(checkUsername);
      const validPassword = compare(newLogin.password, checkUsername.password)

      if(!validPassword){
        throw new Error("Invalid username/password")
      }
      const token = signToken({id: checkUsername._id})

    //   console.log(checkUsername._id)
    //   console.log(token)
      return `Bearer ${token}`
    },
    //   getUser: async function(_, args) {
    //     const user = await UserModel.findOne(args.id)

    //     return user
    //   }
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
