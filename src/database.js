const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "flashCards";

const client = new MongoClient(MONGO_URI);
let db;

async function getCollection(name) {
  if (!db) {
    await client.connect();
    db = client.db(DB_NAME);
    console.log("✅ MongoDB connected");
  }
  return db.collection(name);
}

async function close() {
  if (client) {
    await client.close();
    db = null;
    console.log("🔌 MongoDB disconnected");
  }
}

module.exports = {
  getCollection,
  close,
};
