const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transferController");
const { verifyToken } = require("../../middlewares/authMiddleware");

// Transfer money
router.post("/transfer", verifyToken, transferController.transferMoney);
router.get(
  "/transferhistory",
  verifyToken,
  transferController.getTransactionHistory
);

module.exports = router;
