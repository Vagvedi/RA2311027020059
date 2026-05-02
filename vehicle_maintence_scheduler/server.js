require("dotenv").config();
const express = require("express");
const Log = require("../logging_middleware/logger");
const runScheduler = require("./scheduler");

const app = express();

app.get("/test-log", async (req, res) => {
  try {
    await Log("backend", "info", "controller", "Log middleware working");
    res.send("Log sent successfully");
  } catch (e) {
    res.status(500).send("Logging failed");
  }
});

app.get("/schedule", async (req, res) => {
  try {
    const result = await runScheduler();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Scheduler failed");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});