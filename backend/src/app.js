const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Default route
app.get("/", (req, res) => res.send("Movie Watchlist API is running!"));

module.exports = app;