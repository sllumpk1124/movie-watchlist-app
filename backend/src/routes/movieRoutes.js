/**
 * Movie Routes
 * ------------
 * Provides API endpoints for retrieving movie-related data:
 * - Fetching trending movies
 * - Searching for movies by keyword
 * - Retrieving details of a specific movie
 *
 * Data is fetched from the TMDB API.
 */

const express = require("express");
const tmdbService = require("../services/tmdbService");

const router = express.Router();

/**
 * @route   GET /api/movies/trending
 * @desc    Fetches a list of trending movies from TMDB API
 * @access  Public
 */
router.get("/trending", async (req, res) => {
    try {
        const movies = await tmdbService.getTrendingMovies();
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        res.status(500).json({ error: "Failed to fetch trending movies" });
    }
});

/**
 * @route   GET /api/movies/search
 * @desc    Searches for movies based on a query from TMDB API
 * @access  Public
 * @query   {string} query - The search term
 */
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        const searchResults = await tmdbService.searchMovies(query);
        res.status(200).json(searchResults);
    } catch (error) {
        console.error("Error searching movies:", error);
        res.status(500).json({ error: "Failed to fetch search results" });
    }
});

/**
 * @route   GET /api/movies/:id
 * @desc    Retrieves details for a specific movie from TMDB API
 * @access  Public
 * @param   {string} id - The ID of the movie
 */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const movieDetails = await tmdbService.getMovieDetails(id);

        if (!movieDetails) {
            return res.status(404).json({ error: "Movie not found" });
        }

        res.status(200).json(movieDetails);
    } catch (error) {
        console.error("Error fetching movie details:", error);
        res.status(500).json({ error: "Failed to fetch movie details" });
    }
});

module.exports = router;