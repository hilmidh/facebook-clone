import FollowModel from "../models/followModel.js";

export const followTypeDefs = `#graphql
    type Follow{
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    input FollowInput{
        followingId: ID
        followerId: ID
    }

    type Mutation{
        AddFollow(newFollow: FollowInput): String
    }

    type Query{
        getFollows: [Follow]
    }
`;

export const followResolvers = {
  Query: {
    getFollows: async function () {
      const follows = null;
    },
  },
  Mutation: {
    AddFollow: async function (_, args) {
      const { newFollow } = args;
      newFollow.createdAt = new Date()
      newFollow.updatedAt = new Date()
      console.log(newFollow);
      const data = await FollowModel.create(newFollow);
      return data
    },
  },
};
