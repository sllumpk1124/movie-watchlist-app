/**
 * Main application setup for the Movie Watchlist API.
 * - Initializes Express with middleware.
 * - Loads environment variables.
 * - Connects to the database.
 * - Registers authentication, movies, and watchlist routes.
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { connectDB } = require("./db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses incoming JSON requests

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);

/**
 * Connects to the database and starts the server.
 */
const startServer = async () => {
  await connectDB();
};

startServer();

module.exports = app;