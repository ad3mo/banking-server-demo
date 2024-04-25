const express = require("express");
const router = express.Router();
const billPaymentController = require("../controllers/billPaymentController");
const { verifyToken } = require("../../middlewares/authMiddleware");

// Pay bills
router.post("/pay", verifyToken, billPaymentController.payBill);
router.get(
  "/billhistory",
  verifyToken,
  billPaymentController.getTransactionHistory
);

module.exports = router;
