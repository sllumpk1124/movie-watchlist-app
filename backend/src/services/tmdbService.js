const axios = require("axios");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Check if API key is properly loaded
if (!TMDB_API_KEY) {
  console.error("❌ ERROR: TMDB API key is missing. Please check your .env file.");
  process.exit(1); // Stop execution if API key is missing
}

/**
 * Fetch movies from TMDb based on a search query with pagination.
 * @param {string} query - The movie search term.
 * @param {number} page - The page number for pagination.
 * @returns {Promise<Object|null>} - The movie data from TMDb or null on error.
 */
const fetchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page, // Add pagination support
        language: "en-US", // Ensure English language results
      },
    });

    return response.data; // Return API response data
  } catch (error) {
    console.error(
      "❌ Error fetching movies from TMDb:",
      error.response?.data || error.message
    );
    return null; // Return null on failure
  }
};

/**
 * Fetch movie details including title, description, release date, and cast.
 * @param {number} movieId - The ID of the movie to fetch.
 * @returns {Promise<Object|null>} - The movie details or null on error.
 */
const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US", // Ensure English details
        append_to_response: "credits", // Get cast information
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching movie details:",
      error.response?.data || error.message
    );
    return null; // Return null if movie details couldn't be fetched
  }
};

// Export functions for use in routes
module.exports = { fetchMovies, fetchMovieDetails };