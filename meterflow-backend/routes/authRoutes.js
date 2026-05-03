const express = require("express");
const router = express.Router();
const { signup, getApiKey } = require("../controllers/authController");

router.post("/signup", signup);
router.get("/apikey/:email", getApiKey);

module.exports = router;