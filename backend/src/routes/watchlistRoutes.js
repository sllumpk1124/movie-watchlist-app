/**
 * Watchlist Routes
 * ----------------
 * Provides API endpoints for managing a user's watchlist:
 * - Adding a movie to the watchlist
 * - Retrieving a user's watchlist
 * - Removing a movie from the watchlist
 *
 * Routes require authentication via JWT.
 */

const express = require("express");
const { Watchlist, Movie } = require("../models");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/**
 * @route   POST /api/watchlist
 * @desc    Adds a movie to the user's watchlist
 * @access  Private (Requires authentication)
 * @body    {number} movieId - The ID of the movie to add
 */
router.post("/", authenticate, async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.user.userId;

        // Check if movie is already in watchlist
        const existingEntry = await Watchlist.findOne({ where: { userId, movieId } });
        if (existingEntry) {
            return res.status(400).json({ error: "Movie already in watchlist" });
        }

        // Add movie to watchlist
        const watchlistEntry = await Watchlist.create({ userId, movieId });
        res.status(201).json(watchlistEntry);
    } catch (error) {
        console.error("Error adding movie to watchlist:", error);
        res.status(500).json({ error: "Failed to add movie to watchlist" });
    }
});

/**
 * @route   GET /api/watchlist
 * @desc    Retrieves the authenticated user's watchlist
 * @access  Private (Requires authentication)
 */
router.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch watchlist movies along with their details
        const watchlist = await Watchlist.findAll({
            where: { userId },
            include: [Movie],
        });

        res.status(200).json(watchlist);
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        res.status(500).json({ error: "Failed to fetch watchlist" });
    }
});

/**
 * @route   DELETE /api/watchlist/:movieId
 * @desc    Removes a movie from the user's watchlist
 * @access  Private (Requires authentication)
 * @param   {number} movieId - The ID of the movie to remove
 */
router.delete("/:movieId", authenticate, async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.userId;

        await Watchlist.destroy({ where: { userId, movieId } });

        res.status(200).json({ message: "Movie removed from watchlist" });
    } catch (error) {
        console.error("Error removing movie from watchlist:", error);
        res.status(500).json({ error: "Failed to remove movie from watchlist" });
    }
});

module.exports = router;