const axios = require("axios");
const getToken = require("../logging_middleware/auth");

const BASE_URL = "http://20.207.122.201/evaluation-service";

function getWeight(type) {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  return 1;
}

async function getPriorityNotifications(topN = 10) {
  const token = await getToken();

  const res = await axios.get(`${BASE_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const notifications = res.data.notifications;

  const scored = notifications.map(n => {
    const weight = getWeight(n.Type);
    const time = new Date(n.Timestamp).getTime();

    return {
      ...n,
      score: weight * 1000000000 + time
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}

module.exports = getPriorityNotifications;