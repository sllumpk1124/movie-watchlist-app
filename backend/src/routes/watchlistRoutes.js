const express = require("express");
const { Watchlist, User, Movie } = require("../db");
const authenticateJWT = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Fetch user's watchlist with movie details
 */
router.get("/", authenticateJWT, async (req, res) => {
  try {
    console.log("🛠 Fetching Watchlist for User ID:", req.user.id); // Debugging log

    const watchlist = await Watchlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: Movie }], // Ensure full movie details are included
    });

    console.log("📋 Watchlist Retrieved:", watchlist); // Debugging log

    res.json(watchlist);
  } catch (error) {
    console.error("❌ Error fetching watchlist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Adds a movie to the user's watchlist.
 */
router.post("/", authenticateJWT, async (req, res) => {
  const { movieId, title, description, release_date, poster_path } = req.body;
  const userId = req.user.id;

  // 🚨 Ensure movieId is valid
  if (!movieId) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  console.log("Add to Watchlist Request Received:", { userId, movieId, title });

  try {
    let movie = await Movie.findByPk(movieId);

    // Ensure movieId is explicitly set
    if (!movie) {
      movie = await Movie.create({
        id: movieId, // Explicitly set ID
        title,
        description,
        release_date,
        poster_path,
      });
    }

    const [watchlistItem, created] = await Watchlist.findOrCreate({
      where: { userId, movieId },
      defaults: { userId, movieId },
    });

    if (!created) {
      console.log("⚠️ Movie already in watchlist:", movieId);
      return res.status(200).json({ message: "Movie is already in your watchlist" });
    }

    console.log("✅ Movie added successfully:", watchlistItem);
    res.status(201).json({ message: "Movie added to watchlist successfully!", watchlistItem });
  } catch (error) {
    console.error("❌ Error adding movie to watchlist:", error);
    res.status(500).json({ error: "Server error" });
  }
});
/**
 * Toggle watched status of a movie in the watchlist
 */
router.put("/:movieId/toggle", authenticateJWT, async (req, res) => {
  try {
    const { movieId } = req.params;
    console.log("🔄 Toggling Watch Status for Movie ID:", movieId);

    const watchlistItem = await Watchlist.findOne({ where: { userId: req.user.id, movieId } });

    if (!watchlistItem) {
      return res.status(404).json({ error: "Movie not found in watchlist" });
    }

    // Toggle watched status
    watchlistItem.watched = !watchlistItem.watched;
    await watchlistItem.save();

    res.json({ message: "Watch status updated", watched: watchlistItem.watched });
  } catch (error) {
    console.error("❌ Error toggling watch status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Removes a movie from the watchlist.
 */
/**
 * Remove a movie from the user's watchlist.
 */
router.delete("/:movieId", authenticateJWT, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    console.log("Delete Request Received:", { userId, movieId });

    // Find and delete the movie from the watchlist
    const deleted = await Watchlist.destroy({ where: { userId, movieId } });

    if (!deleted) {
      return res.status(404).json({ error: "Movie not found in watchlist" });
    }

    res.json({ message: "Movie removed from watchlist successfully" });
  } catch (error) {
    console.error("❌ Error deleting from watchlist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;