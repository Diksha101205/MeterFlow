const { users } = require("../data/store");

module.exports = (req, res, next) => {
  const apiKey = req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({ error: "API Key required" });
  }

  const user = users.find(u => u.apiKey === apiKey);

  if (!user) {
    return res.status(403).json({ error: "Invalid API Key" });
  }

  req.user = user;
  next();
};