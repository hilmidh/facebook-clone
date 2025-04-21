import { getDB } from "../config/mongodb.js";

export default class PostModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("posts");

    return collection;
  }

  static async find() {
    const collection = this.getCollection();
    const posts = await collection.aggregate([
      {$sort: {createdAt: -1}},
      {$lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "Author"
      }},
      { $unwind: { path: '$Author' } }
    ]).toArray();

    // console.log(posts)

    return posts;
  }

  static async findOne(filter) {
    const collection = this.getCollection();
    const post = await collection.aggregate([
      {$match: filter},
      {$lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "Author"
      }},
      { $unwind: { path: '$Author' } }
    ]).toArray();

    return post[0];
  }

  static async create(payload) {
    const collection = this.getCollection();
    await collection.insertOne(payload);
    // console.log(data);
    return "Success add new post";
  }

  static async updateOne(filter, payload){
    const collection = this.getCollection();
    await collection.updateOne(filter, payload)
    return "Success updating post"
  }
}
