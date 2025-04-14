// import { ObjectId } from "mongodb"
import { getDB } from "../config/mongodb.js";

export default class UserModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("users");

    return collection;
  }

  static async find() {
    const collection = this.getCollection();
    const users = await collection.find().toArray();

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
