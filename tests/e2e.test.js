const request = require("supertest");

jest.mock("../services/word-service", () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn(),

    addWord: jest.fn().mockResolvedValue({
      success: true,
      id: "mock-id-123",
    }),

    getAllWords: jest
      .fn()
      .mockResolvedValue([{ word: "hello", translation: "привіт" }]),

    searchWords: jest
      .fn()
      .mockResolvedValue([{ word: "hello", translation: "привіт" }]),

    deleteWord: jest.fn().mockResolvedValue(true),

    getWordsForReview: jest.fn().mockResolvedValue([]),

    updateWordStats: jest.fn().mockResolvedValue(true),

    getStats: jest.fn().mockResolvedValue({
      totalWords: 1,
      totalAttempts: 0,
      totalCorrect: 0,
      successRate: 0,
      avgDifficulty: 1,
    }),
  }));
});


const express = require("express");
const createWordRouter = require("../api/word.routes");

describe("E2E (mocked): Words API", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    const fakeDatabase = {};

    app.use("/api/words", createWordRouter(fakeDatabase));
  });

  test("POST /api/words", async () => {
    const res = await request(app)
      .post("/api/words")
      .send({ word: "hello", translation: "привіт" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBe("mock-id-123");
  });

  test("GET /api/words", async () => {
    const res = await request(app).get("/api/words");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].word).toBe("hello");
  });

  test("GET /api/words/search?q=hel", async () => {
    const res = await request(app).get("/api/words/search?q=hel");

    expect(res.status).toBe(200);
    expect(res.body[0].translation).toBe("привіт");
  });

  test("DELETE /api/words/:word", async () => {
    const res = await request(app).delete("/api/words/hello");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/words/stats", async () => {
    const res = await request(app).get("/api/words/stats");

    expect(res.status).toBe(200);
    expect(res.body.totalWords).toBe(1);
  });
});
