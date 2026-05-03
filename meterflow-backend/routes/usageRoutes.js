const express = require("express");
const router = express.Router();
const { getUsage } = require("../controllers/usageController");

router.get("/:apiKey", getUsage);

module.exports = router;