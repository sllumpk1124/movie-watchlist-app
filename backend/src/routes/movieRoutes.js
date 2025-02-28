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
const { fetchMovies, fetchMovieDetails, fetchTrendingMovies } = require("../services/tmdbService");
const express = require("express");

const router = express.Router();

/**
 * @route   GET /api/movies/trending
 * @desc    Fetches a list of trending movies from TMDB API
 * @access  Public
 */
router.get("/trending", async (req, res) => {
  try {
    console.log("✅ Fetching trending movies...");
    const trendingMovies = await fetchTrendingMovies();

    if (!trendingMovies || !Array.isArray(trendingMovies.results)) {
      return res.status(404).json({ error: "No trending movies found" });
    }

    res.status(200).json(trendingMovies.results);
  } catch (error) {
    console.error("❌ Error fetching trending movies:", error.message);
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

    const searchResults = await fetchMovies(query);
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
    console.log(`✅ Fetching details for movie ID: ${id}`);

    const movieDetails = await fetchMovieDetails(id);
    if (!movieDetails) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json(movieDetails);
  } catch (error) {
    console.error("❌ Error fetching movie details:", error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

module.exports = router;