const express = require("express");
const WordService = require("../services/word-service");

module.exports = (database) => {
  const router = express.Router();
  const wordService = new WordService(database);
  wordService.init();

  router.post("/", async (req, res) => {
    const result = await wordService.addWord(req.body);
    result.success
      ? res.status(201).json(result)
      : res.status(400).json(result);
  });

  router.get("/", async (req, res) => {
    const limit = Number(req.query.limit) || 50;
    const words = await wordService.getAllWords(limit);
    res.json(words);
  });

  router.get("/search", async (req, res) => {
    if (!req.query.q) {
      return res.status(400).json({ error: "Query param 'q' required" });
    }
    const words = await wordService.searchWords(req.query.q);
    res.json(words);
  });

  router.get("/review", async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const words = await wordService.getWordsForReview(limit);
    res.json(words);
  });

  router.patch("/review", async (req, res) => {
    const { word, isCorrect } = req.body;

    if (!word || typeof isCorrect !== "boolean") {
      return res.status(400).json({ error: "word & isCorrect required" });
    }

    const found = await wordService.searchWords(word);
    if (!found.length) {
      return res.status(404).json({ error: "Word not found" });
    }

    await wordService.updateWordStats(found[0], isCorrect);
    res.json({ success: true });
  });

  router.delete("/:word", async (req, res) => {
    const deleted = await wordService.deleteWord(req.params.word);
    deleted
      ? res.json({ success: true })
      : res.status(404).json({ error: "Word not found" });
  });

  router.get("/stats", async (req, res) => {
    const stats = await wordService.getStats();
    res.json(stats);
  });

  return router;
};
