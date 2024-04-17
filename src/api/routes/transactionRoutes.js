const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionContoller");
const { verifyToken } = require("../../middlewares/authMiddleware");

// Send money
router.post("/send", verifyToken, transactionController.sendMoney);

// Pay bills
router.post("/pay", verifyToken, transactionController.payBill);

// Get transaction history
router.get(
  "/history",
  verifyToken,
  transactionController.getTransactionHistory
);

module.exports = router;
