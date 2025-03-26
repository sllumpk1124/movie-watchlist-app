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
 * @desc    Registers a new user and returns a JWT token
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

        // Check if email and username already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          return res.status(400).json({ error: "Username already taken" });
}

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email: email.toLowerCase().trim(), 
            password: hashedPassword,
        });
        
        // Only sign the user's ID into the token 
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Return non-sensitive user data in the response
        const userResponse = {
          id: newUser.id,
          username: newUser.username,
        };

        // Return token and user
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

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Correctly compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Prepare safe user response (omit password)
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        // Generate JWT token with user details
        const token = jwt.sign(userResponse, process.env.JWT_SECRET, { expiresIn: "1h" });

       ;

        // Return token and user
        res.json({ token, user: userResponse });

    } catch (error) {
        console.error("❌ Login error:", error.message);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;