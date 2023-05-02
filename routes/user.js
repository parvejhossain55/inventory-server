const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

// Register a new user
router.post("/register", UserController.register);

// Verify email on new User
router.get("/verify-email", UserController.verifyEmail);

// Log in an existing user
router.post("/login", UserController.login);

// Send a password reset email
router.post("/forgot-password", UserController.forgotPassword);

// Verify a password reset token
router.post("/verify-reset-token/:token", UserController.verifyResetToken);

// Change a user's password
router.post("/change-password/:token", UserController.changePassword);

// Update User Profile
router.put("/update-profile", isAuthenticated, UserController.updateProfile);

// Get Single User
router.get("/get-user", isAuthenticated, UserController.getUserById);
// Check User Is Authenticated
router.get("/auth-check", isAuthenticated, (req, res) => {
  res.json({ ok: true });
});

// Check User Is Admin
router.get("/admin-check", isAuthenticated, isAdmin, (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
