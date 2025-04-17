import { getDB } from "../config/mongodb.js";

export default class PostModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("posts");

    return collection;
  }

  static async find(obj) {
    const collection = this.getCollection();
    const posts = await collection.find(obj).toArray();

    return posts;
  }

  static async findOne(payload) {
    const collection = this.getCollection();
    const post = await collection.findOne(payload);

    return post;
  }

  static async create(payload) {
    const collection = this.getCollection();
    const data = await collection.insertOne(payload);
    // console.log(data);
    return "Success add new user";
  }

  static async updateOne(filter, payload){
    const collection = this.getCollection();
    await collection.updateOne(filter, payload)
    return "Success updating post"
  }
}
