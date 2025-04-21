import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from "./schemas/userSchema.js";
import { postResolvers, postTypeDefs } from "./schemas/postSchema.js";
import { followResolvers, followTypeDefs } from "./schemas/followSchema.js";
import { verifyToken } from "../server/helpers/jwt.js";
import { ObjectId } from "mongodb";
import UserModel from "./models/userModel.js";

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
});

const { url } = await startStandaloneServer(server, {
  // introspection: true,
  listen: { port: 3000 },
  context: async ({ req }) => {
    // const operationName = req.body.operationName;

    // // Allow introspection queries to bypass authentication
    // if (operationName === "IntrospectionQuery") {
    //   return {};
    // }
    const auth = async () => {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        throw new Error("Invalid token");
      }

      const [, token] = bearerToken.split(" ");
      if (!token) {
        throw new Error("Invalid token");
      }

      const data = verifyToken(token);
      // res.json(data)
      // console.log(data);

      const user = await UserModel.findOne({ _id: new ObjectId(data.id) });
      if (!user) {
        throw new Error("Invalid token");
      }
      // res.json(user)
      return user;
    };
    return { auth };
  },
});

console.log(`🚀  Server ready at: ${url}`);
