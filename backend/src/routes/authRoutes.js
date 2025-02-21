const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
require("dotenv").config();

const router = express.Router();

// User Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("🔍 Received Signup Request:", req.body); // Debugging

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({ username, email, password: hashedPassword });

    console.log("✅ User created:", newUser.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;