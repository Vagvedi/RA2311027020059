const axios = require("axios");
const getToken = require("../logging_middleware/auth");
const Log = require("../logging_middleware/logger");

const BASE_URL = "http://20.207.122.201/evaluation-service";

async function fetchDepots(token) {
  const res = await axios.get(`${BASE_URL}/depots`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.depots;
}

async function fetchVehicles(token) {
  const res = await axios.get(`${BASE_URL}/vehicles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.vehicles;
}

function knapsack(tasks, capacity) {
  const n = tasks.length;

  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for (let w = 0; w <= capacity; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          Impact + dp[i - 1][w - Duration]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = capacity;
  let selected = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(tasks[i - 1]);
      w -= tasks[i - 1].Duration;
    }
  }

  selected.reverse();

  const totalDuration = selected.reduce((sum, t) => sum + t.Duration, 0);

  return {
    maxImpact: dp[n][capacity],
    selectedTasks: selected,
    totalDuration,
  };
}

async function runScheduler() {
  try {
    const token = await getToken();

    await Log("backend", "info", "service", "Fetching depots");
    const depots = await fetchDepots(token);

    await Log("backend", "info", "service", "Fetching vehicles");
    const vehicles = await fetchVehicles(token);

    const results = [];

    for (let depot of depots) {
      const capacity = depot.MechanicHours;

      await Log(
        "backend",
        "info",
        "service",
        `Running knapsack for depot ${depot.ID} with capacity ${capacity}`
      );

      const result = knapsack(vehicles, capacity);

      if (result.totalDuration > capacity) {
        await Log(
          "backend",
          "error",
          "service",
          `Capacity exceeded for depot ${depot.ID}`
        );
      }

      await Log(
        "backend",
        "info",
        "service",
        `Depot ${depot.ID} → Impact: ${result.maxImpact}, Duration: ${result.totalDuration}/${capacity}`
      );

      // 🔥 Final structured output
      results.push({
        depotId: depot.ID,
        maxImpact: result.maxImpact,
        totalDuration: result.totalDuration,
        utilization:
          ((result.totalDuration / capacity) * 100).toFixed(2) + "%",
        selectedTasks: result.selectedTasks,
      });
    }

    await Log(
      "backend",
      "info",
      "service",
      "Scheduler completed successfully"
    );

    return results;

  } catch (err) {
    console.error(err);

    await Log(
      "backend",
      "error",
      "service",
      `Scheduler failed: ${err.message}`
    );

    throw err;
  }
}

module.exports = runScheduler;