const { usageLogs } = require("../data/store");

exports.getUsage = (req, res) => {
  const logs = usageLogs.filter(
    log => log.apiKey === req.params.apiKey
  );

  res.json(logs.slice(-50));
};