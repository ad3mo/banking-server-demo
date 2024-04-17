const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../../middlewares/authMiddleware");

// Get a user by ID
router.get("/:id", verifyToken, userController.getUserById);

// Update a user's information
router.put("/:id", verifyToken, userController.updateUser);

// Delete a user
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
