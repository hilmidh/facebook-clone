import { ObjectId } from "mongodb";
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
    AddFollow: async function (_, args, contextValue) {
      const user = await contextValue.auth();
      const { newFollow } = args;
      newFollow.followerId = user._id;
      newFollow.followingId = new ObjectId(newFollow.followingId);
      newFollow.createdAt = new Date();
      newFollow.updatedAt = new Date();
      //   console.log(newFollow);
      const validate = await FollowModel.find({
        $and: [
          { followerId: user._id },
          { followingId: newFollow.followingId },
        ],
      });
    //   console.log(validate, "<<<<<<<<<<<<<,")

    //   console.log(newFollow)

      if (validate.length > 0) {
        throw new Error("You already follow this account");
      }
      const data = await FollowModel.create(newFollow);
      return data;
    },
  },
};
