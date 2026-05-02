const axios = require("axios");
const getToken = require("./auth");

const BASE_URL = "http://20.207.122.201/evaluation-service";

async function Log(stack, level, pkg, message) {
  try {
    const token = await getToken();

    const res = await axios.post(
      `${BASE_URL}/logs`,
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

    console.log("LOG SUCCESS:", res.data);

  } catch (err) {
    console.error("LOG ERROR:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = Log;