import { getDB } from "../config/mongodb.js";

export default class PostModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("posts");

    return collection;
  }

  static async find(obj) {
    const collection = this.getCollection();
    const users = await collection.find(obj).toArray();

    return users;
  }

  static async findOne(obj) {
    const collection = this.getCollection();
    const user = await collection.findOne(obj);

    return user;
  }

  static async create(payload) {
    const collection = this.getCollection();
    const data = await collection.insertOne(payload);
    // console.log(data);
    return "Success add new user";
  }
}
