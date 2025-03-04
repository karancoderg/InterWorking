const express = require("express");
const passport = require("passport");
const { registerUser, loginUser, googleAuthCallback } = require("../controllers/authController");

const router = express.Router();

// ✅ Register Route
router.post("/register", registerUser);

// ✅ Login Route
router.post("/login", loginUser);

// ✅ Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), googleAuthCallback);

module.exports = router;
