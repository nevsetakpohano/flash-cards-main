const express = require("express");
const db = require("./database");
const createWordRouter = require("./api/word.routes");

const app = express();
app.use(express.json());

app.use("/api/words", createWordRouter(db));

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 API running at http://localhost:${PORT}`),
);

module.exports = app;
