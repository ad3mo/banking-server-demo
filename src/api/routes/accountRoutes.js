const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const { verifyToken } = require("../../middlewares/authMiddleware");

// create a new account
router.post("/", verifyToken, accountController.createAccount);

// get account details
router.get("/", verifyToken, accountController.getAccountDetails);

// update account details
router.put("/", verifyToken, accountController.updateAccount);

module.exports = router;
