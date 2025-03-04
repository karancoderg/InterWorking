const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken } = require("../config/jwt");

// ✅ Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.json({ token: generateToken(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check password securely
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({ token: generateToken(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Google OAuth Callback
exports.googleAuthCallback = async (req, res) => {
    try {
        const { id, displayName, emails } = req.user;
        let user = await User.findOne({ googleId: id });

        if (!user) {
            user = new User({ googleId: id, name: displayName, email: emails[0].value });
            await user.save();
        }

        res.json({ token: generateToken(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
