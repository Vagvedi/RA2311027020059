const express = require("express");
const app = express();

const runScheduler = require("./scheduler");

app.get("/schedule", async (req, res) => {
  try {
    const result = await runScheduler();
    res.json(result);
  } catch (err) {
    res.status(500).send("Scheduler failed");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});