require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = require("./app");
const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes"); 
const watchlistRoutes = require("./routes/watchlistRoutes"); 

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

// Authentication Middleware (Optional)
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user;
    next();
  });
};

// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/movies", movieRoutes); 
app.use("/api/watchlist", watchlistRoutes);

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));