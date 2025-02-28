const axios = require("axios");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Check if API key is properly loaded
if (!TMDB_API_KEY) {
  console.error("❌ ERROR: TMDB API key is missing. Please check your .env file.");
  process.exit(1);
}

/**
 * Fetch movies from TMDb based on a search query.
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
        page,
        language: "en-US",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching movies:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Fetch trending movies from TMDB API.
 * @returns {Promise<Array>} - The trending movies array or an empty array on error.
 */
const fetchTrendingMovies = async () => {
  try {
    console.log("✅ Fetching trending movies from TMDB...");
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    });

    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error("Invalid trending movies response from TMDB.");
    }

    return { results: response.data.results }; 
  } catch (error) {
    console.error("❌ Error fetching trending movies:", error.response?.data || error.message);
    return { results: [] };
  }
};

/**
 * Fetch movie details including title, description, release date, and cast.
 * @param {number} movieId - The ID of the movie to fetch.
 * @returns {Promise<Object|null>} - The movie details or null on error.
 */
const fetchMovieDetails = async (movieId) => {
  try {
    console.log(`✅ Fetching movie details for ID: ${movieId}`);

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        append_to_response: "credits",
      },
    });

    console.log("✅ Raw Movie Details Response:", response.data); // Debugging log

    if (!response.data || !response.data.title) {
      throw new Error("Invalid movie details response.");
    }

    return {
      title: response.data.title,
      overview: response.data.overview || "No description available.",
      release_date: response.data.release_date || "Unknown",
      cast: response.data.credits?.cast?.length
        ? response.data.credits.cast.slice(0, 5).map((actor) => actor.name).join(", ")
        : "No cast available.",
    };
  } catch (error) {
    console.error("❌ Error fetching movie details:", error.response?.data || error.message);
    return {
      title: "Movie Details",
      overview: "No description available.",
      release_date: "Unknown",
      cast: "No cast available.",
    };
  }
};

/**
 * Search for movies based on a query.
 * @param {string} query - The search term.
 * @returns {Promise<Object|null>} - Search results or null on error.
 */
const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: "en-US",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error searching movies:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Corrected module exports (no duplicates)
module.exports = {
  fetchMovies,
  searchMovies,
  fetchMovieDetails,
  fetchTrendingMovies,
};