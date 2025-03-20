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
const router = express.Router();
const { fetchMovies, fetchMovieDetails, fetchTrendingMovies, getMovieDetails } = require("../services/tmdbService");

/**
 * @route   GET /api/movies/trending
 * @desc    Fetches a list of trending movies from TMDB API
 * @access  Public
 */
router.get("/trending", async (req, res) => {
  try {
    
    const trendingMovies = await fetchTrendingMovies();

    // Ensure the response contains a valid `results` array
    if (!trendingMovies || !trendingMovies.results || !Array.isArray(trendingMovies.results)) {
      console.error("❌ No trending movies found!");
      return res.status(404).json({ error: "No trending movies available" });
    }

    console.log("✅ Trending Movies Fetched:", trendingMovies.results.length);
    res.status(200).json({ results: trendingMovies.results }); // ✅ Ensure consistent response structure
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

    console.log(`✅ Searching movies for query: "${query}"`);
    const searchResults = await fetchMovies(query);

    if (!searchResults || !Array.isArray(searchResults.results)) {
      return res.status(404).json({ error: "No movies found" });
    }

    res.status(200).json({ results: searchResults.results });
  } catch (error) {
    console.error("❌ Error searching movies:", error.message);
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

    // Ensure 404 is returned if TMDB responds with an error
    if (!movieDetails || movieDetails.success === false || movieDetails.status_code === 34) {
      console.warn(`🚨 Movie ID ${id} not found in TMDB.`);
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json(movieDetails);
  } catch (error) {
    console.error("❌ Error fetching movie details:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

module.exports = router;