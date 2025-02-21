const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetch trending movies from TMDb API.
 */
router.get("/trending", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    });

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No trending movies found" });
    }

    res.json({
      results: data.results.slice(0, 12), // Get first 12 trending movies
    });
  } catch (error) {
    console.error("❌ Error fetching trending movies:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

/**
 * Fetch movies from TMDb based on search query and page number.
 * Limits results to 12 movies per page.
 */
router.get("/search", async (req, res) => {
  try {
    const { query, page } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Ensure valid page number
    const pageNumber = Math.max(1, parseInt(page) || 1);

    // API request to TMDb
    const { data } = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page: pageNumber,
        language: "en-US",
        include_adult: false,
      },
    });

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }

    res.json({
      results: data.results.slice(0, 12), // Limit to 12 movies per page
      current_page: pageNumber,
      total_pages: Math.ceil(data.total_results / 12),
      total_results: data.total_results,
    });
  } catch (error) {
    console.error("❌ Error fetching movies:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

/**
 * Fetch full movie details including title, description, release date, and cast.
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch movie details
    const { data: movieDetails } = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        append_to_response: "credits",
      },
    });

    if (!movieDetails) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({
      id: movieDetails.id,
      title: movieDetails.title,
      description: movieDetails.overview || "No description available.",
      release_date: movieDetails.release_date || "Unknown",
      cast: movieDetails.credits?.cast?.slice(0, 5).map(actor => actor.name) || [],
      poster_path: movieDetails.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
        : null,
    });
  } catch (error) {
    console.error("❌ Error fetching movie details:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

module.exports = router;