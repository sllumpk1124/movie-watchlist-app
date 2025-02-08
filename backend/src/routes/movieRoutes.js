const express = require("express");
const { fetchMovies } = require("../services/tmdbService");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query is required" });

  const movies = await fetchMovies(query);
  res.json(movies);
});

module.exports = router;