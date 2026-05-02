require("dotenv").config();
const axios = require("axios");

let cachedToken = null;

async function getToken() {
  if (cachedToken) return cachedToken;

  const res = await axios.post(
    "http://20.207.122.201/evaluation-service/auth",
    {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLL,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }
  );

  console.log("AUTH RESPONSE:", res.data); 

  cachedToken = res.data.access_token; 
  return cachedToken;
}

module.exports = getToken;