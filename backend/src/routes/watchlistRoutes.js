const express = require("express");
const { Watchlist, Movie } = require("../db");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/watchlist
 * @desc    Adds a movie to the user's watchlist. If the movie does not exist, it will be added first.
 * @access  Private (Requires authentication)
 */
router.post("/", authenticate, async (req, res) => {
    try {
        const { movieId, title, poster_path, release_date } = req.body;
        const userId = req.user.id;

        if (!movieId || !title) {
            return res.status(400).json({ error: "Movie ID and Title are required" });
        }

        console.log(`🟢 Adding movie ${movieId} to watchlist for user ${userId}`);

        let movie = await Movie.findByPk(movieId);
        if (!movie) {
            console.log("🔄 Movie not found in database. Adding to Movies table...");
            movie = await Movie.create({
                id: movieId,
                title,
                poster_path,
                release_date,
            });
        }

        const existingEntry = await Watchlist.findOne({ where: { userId, movieId } });
        if (existingEntry) {
            return res.status(400).json({ error: "Movie already in watchlist" });
        }

        const watchlistEntry = await Watchlist.create({ userId, movieId });

        console.log("✅ Movie added to watchlist:", watchlistEntry);
        res.status(201).json(watchlistEntry);
    } catch (error) {
        console.error("❌ Error adding movie to watchlist:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @route   GET /api/watchlist
 * @desc    Retrieves the authenticated user's watchlist with full movie details
 * @access  Private (Requires authentication)
 */
router.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const watchlist = await Watchlist.findAll({
            where: { userId },
            include: [{ model: Movie, attributes: ["id", "title", "poster_path", "release_date"] }],
        });

        if (!watchlist.length) {
            return res.status(200).json([]);
        }

        res.status(200).json(watchlist);
    } catch (error) {
        console.error("❌ Error fetching watchlist:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @route   DELETE /api/watchlist/:movieId
 * @desc    Removes a movie from the user's watchlist
 * @access  Private (Requires authentication)
 */
router.delete("/:movieId", authenticate, async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        await Watchlist.destroy({ where: { userId, movieId } });

        console.log(`✅ Movie ${movieId} removed from watchlist`);
        res.status(200).json({ message: "Movie removed from watchlist" });
    } catch (error) {
        console.error("❌ Error removing movie from watchlist:", error);
        res.status(500).json({ error: "Failed to remove movie from watchlist" });
    }
});

module.exports = router;