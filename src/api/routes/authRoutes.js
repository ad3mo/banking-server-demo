const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../../middlewares/authMiddleware");

// User registration
router.post("/register", authController.register);

// User login
router.post("/login", authController.login);

//logged in status
router.get("/status", verifyToken, authController.verifyUser);

module.exports = router;
