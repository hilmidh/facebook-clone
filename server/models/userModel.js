import { getDB } from "../config/mongodb.js";

export default class UserModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("users");

    return collection;
  }

  static async find(obj) {
    const collection = this.getCollection();
    const users = await collection.find(obj).toArray();

    return users;
  }

  static async findOne(filter) {
    const collection = this.getCollection();
    const user = await collection
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'follows',
            localField: '_id',
            foreignField: 'followingId',
            as: 'followers'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'followers.followerId',
            foreignField: '_id',
            as: 'followersData'
          }
        },
        {
          $lookup: {
            from: 'follows',
            localField: '_id',
            foreignField: 'followerId',
            as: 'following'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'following.followingId',
            foreignField: '_id',
            as: 'followingData'
          }
        }
        
      ])
      .toArray();

      

    return user[0];
  }

  static async create(payload) {
    const collection = this.getCollection();
    const data = await collection.insertOne(payload);
    // console.log(data);
    return "Success add new user";
  }
}
