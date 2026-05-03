const express = require("express");
const router = express.Router();
const proxyController = require("../controllers/proxyController");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

router.get("/", apiKeyMiddleware, proxyController.handleProxy);

module.exports = router;