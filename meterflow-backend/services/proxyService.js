const axios = require("axios");
const { usageLogs } = require("../data/store");

module.exports = async (url, apiKey) => {
  try {
    const response = await axios.get(url);

    usageLogs.push({
      apiKey,
      url,
      status: response.status,
      timestamp: new Date(),
    });

    return response.data;
  } catch (err) {
    usageLogs.push({
      apiKey,
      url,
      status: 500,
      timestamp: new Date(),
    });

    throw err;
  }
};