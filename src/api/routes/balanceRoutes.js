const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balanceController");
const { verifyToken } = require("../../middlewares/authMiddleware");

// Get the current balance
router.get("/", verifyToken, balanceController.getBalance);

module.exports = router;
