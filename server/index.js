import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from './schemas/userSchema.js';


const server = new ApolloServer({
    typeDefs: [userTypeDefs],
    resolvers: [userResolvers],
  });

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
});

console.log(`🚀  Server ready at: ${url}`);
