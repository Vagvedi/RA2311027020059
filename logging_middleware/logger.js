const axios = require("axios");
const getToken = require("./auth");

async function Log(stack, level, pkg, message) {
  const token = await getToken();

  await axios.post(
    "http://20.207.122.201/evaluation-service/logs",
    {
      stack,
      level,
      package: pkg,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

module.exports = Log;