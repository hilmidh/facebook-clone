import { getDB } from "../config/mongodb.js";

export default class FollowModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("follows");

    return collection;
  }

  static async find(obj) {
    const collection = this.getCollection();
    const follows = await collection.find(obj).toArray();

    return follows;
  }

  static async create(payload) {
    const collection = this.getCollection();
    const data = await collection.insertOne(payload);
    // console.log(data);
    return "Success to follow a user";
  }
}
