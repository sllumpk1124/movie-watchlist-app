const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
};

startServer();