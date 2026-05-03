const { users } = require("../data/store");
const { v4: uuidv4 } = require("uuid");

exports.signup = (req, res) => {
  const { email } = req.body;

  const apiKey = uuidv4();
  const user = { email, apiKey };

  users.push(user);

  res.json(user);
};

exports.getApiKey = (req, res) => {
  const user = users.find(u => u.email === req.params.email);
  res.json(user || {});
};