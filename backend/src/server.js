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

//  Middleware setup
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Backend is running!" });
});

// Connect to Database before setting up routes
connectDB().then(() => {
  // Define API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/movies", movieRoutes);
  app.use("/api/watchlist", watchlistRoutes);

  // Handle invalid API routes
  app.use("*", (req, res) => {
    res.status(404).json({ error: "❌ Route not found" });
  });

  // Start the server unless in a test environment
  const PORT = process.env.PORT || 5000;
  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  }
});

// Export `app` for testing purposes
module.exports = app;