/**
 * Authentication Routes
 * ---------------------
 * Handles user authentication operations, including:
 * - User Signup
 * - User Login
 *
 * Uses JWT for authentication and password hashing for security.
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const User = db.User;
const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Registers a new user
 * @access  Public
 * @body    {string} username - The username of the new user
 *          {string} email - The email of the new user
 *          {string} password - The user's password
 */
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Remove password from the response (for security)
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        };

        // Generate JWT token with user details
        const token = jwt.sign(userResponse, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        console.log("✅ User signed up successfully:", userResponse);
        res.status(201).json({ token, user: userResponse });

    } catch (error) {
        console.error("❌ Signup error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Logs in an existing user and returns a JWT token
 * @access  Public
 * @body    {string} email - The user's email
 *          {string} password - The user's password
 */

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // ✅ Correctly compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, user });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;