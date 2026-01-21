const request = require("supertest");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const createWordRouter = require("../api/word.routes");

let app;
let mongo;
let client;
let database;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  client = new MongoClient(mongo.getUri());
  await client.connect();

  database = {
    getCollection: async (name) => client.db("test").collection(name),
  };

  app = express();
  app.use(express.json());
  app.use("/api/words", createWordRouter(database));
});

afterAll(async () => {
  await client.close();
  await mongo.stop();
});

describe("Words API (integration)", () => {
  test("POST /api/words", async () => {
    const res = await request(app)
      .post("/api/words")
      .send({ word: "hello", translation: "привіт" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/words", async () => {
    const res = await request(app).get("/api/words");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].word).toBe("hello");
  });

  test("DELETE /api/words/:word", async () => {
    const res = await request(app).delete("/api/words/hello");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
