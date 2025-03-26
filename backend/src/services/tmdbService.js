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
 * Retries on rate-limiting (HTTP 429).
 *
 * @param {string} query - The movie search term.
 * @param {number} page - The page number for pagination.
 * @param {number} retries - Number of retry attempts for rate-limiting.
 * @returns {Promise<Object|null>} - The movie data from TMDb or null on error.
 */
const fetchMovies = async (query, page = 1, retries = 3) => {
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
    const status = error.response?.status;
    const retryAfter = error.response?.headers["retry-after"];

    // Handle TMDB rate limit (HTTP 429)
    if (status === 429 && retries > 0) {
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000; // Fallback to 2s
      console.warn(` Rate limited. Retrying in ${waitTime / 1000}s... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return fetchMovies(query, page, retries - 1);
    }

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

    // ✅ Only log detailed response data in development
    if (process.env.NODE_ENV !== "production") {
      console.log("📦 Raw Movie Details Response:", response.data);
    }

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

    if (error.response?.status === 404 || error.response?.data?.status_code === 34) {
      return { success: false, status_code: 34 };
    }

    return null;
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