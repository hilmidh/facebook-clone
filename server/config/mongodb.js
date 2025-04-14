import { MongoClient } from "mongodb";

const uri = process.env.mongoDB

export const client = new MongoClient(uri)

let db = null

function connect() {
  try {
    db = client.db("gc01_DB")
  } catch (err) {
    console.log(err, "err connect to mongodb")
  }
}

export function getDB() {
  if (!db) connect()

  return db
}
