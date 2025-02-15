const express = require("express");
const { Watchlist, Movie } = require("../db"); // Import models
const router = express.Router();

/**
 * @route   POST /api/watchlist
 * @desc    Add a movie to the user's watchlist
 * @access  Private
 */
router.post("/", async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const movie = await Movie.findByPk(movieId);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    const watchlistItem = await Watchlist.create({ userId, movieId });
    res.status(201).json(watchlistItem);
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   GET /api/watchlist/:userId
 * @desc    Get all movies in a user's watchlist
 * @access  Private
 */
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const watchlist = await Watchlist.findAll({
        where: { userId },
        include: [{
          model: Movie,
          attributes: ['id', 'title', 'poster_path', 'overview'] 
      }]
    });
  
      if (!watchlist.length) {
        return res.status(404).json({ error: "No movies found in watchlist" });
      }
  
      res.json(watchlist);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  module.exports = router;