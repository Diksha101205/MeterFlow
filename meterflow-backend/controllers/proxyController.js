const proxyService = require("../services/proxyService");

exports.handleProxy = async (req, res) => {
  try {
    const data = await proxyService(req.query.url, req.user.apiKey);
    res.json(data);
  } catch {
    res.status(500).json({ error: "API failed" });
  }
};