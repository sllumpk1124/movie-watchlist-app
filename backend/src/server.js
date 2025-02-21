/**
 * Server setup for the Movie Watchlist API.
 * - Initializes an Express server with necessary middleware.
 * - Loads environment variables.
 * - Connects to the database.
 * - Sets up API routes for authentication, movies, and watchlist.
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();

// Middleware setup
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Export `app` first for testing purposes
module.exports = app;

// Start the server only in non-test environments
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}