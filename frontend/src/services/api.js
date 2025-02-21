import axios from "axios";

// Set up API instance with base URL
const API = axios.create({ baseURL: "http://localhost:5000/api" });

/**
 * Automatically attach authorization token to requests
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Signup a new user
 * @param {Object} userData - { username, email, password }
 * @returns {Promise<Object>} - API response
 */
export const signupUser = async (credentials) => {
  try {
    const response = await API.post("/auth/signup", credentials);
    console.log("✅ Signup successful:", response.data); // Debugging
    return response.data; // Ensure response contains { token, user }
  } catch (error) {
    console.error("❌ Signup failed:", error.response?.data || error.message);
    throw error; // Throw error to be caught in Signup.jsx
  }
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - API response
 */
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch movies using TMDb API via backend
 * @param {string} query - Search term
 * @param {number} page - Page number
 * @returns {Promise<Object>} - API response
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await API.get(`/movies/search?query=${query}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error.response?.data || error.message);
    return { results: [], total_pages: 0 };
  }
};

/**
 * Fetch detailed movie information
 * @param {number} movieId - Movie ID from TMDb
 * @returns {Promise<Object>} - Movie details
 */
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await API.get(`/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Add a movie to the user's watchlist
 * @param {Object} movieData - { movieId, title, description, release_date, poster_path }
 * @returns {Promise<Object>} - API response
 */
export const addToWatchlist = async (movie) => {
  try {
    console.log("🛠 Sending Add to Watchlist Request:", movie); // Debugging

    const response = await API.post("/watchlist", {
      movieId: movie.id, // Ensure movieId is included
      title: movie.title,
      description: movie.overview, // Use "overview" from TMDB
      release_date: movie.release_date,
      poster_path: movie.poster_path,
    });

    console.log("✅ Watchlist Add Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding to watchlist:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Fetch the user's watchlist
 * @returns {Promise<Object[]>} - List of movies in the watchlist
 */
export const fetchWatchlist = async () => {
  try {
    const response = await API.get("/watchlist");
    return response.data;
  } catch (error) {
    console.error("Error fetching watchlist:", error.response?.data || error.message);
    return [];
  }
};

/**
 * Remove a movie from the user's watchlist.
 * @param {number} movieId - The ID of the movie to remove.
 * @returns {Promise<object>} - Server response.
 */
export const removeFromWatchlist = async (movieId) => {
  try {
    console.log(" Removing movie from watchlist:", movieId);

    const response = await API.delete(`/watchlist/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error removing movie from watchlist:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Toggle watched status for a movie in the watchlist
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} - Updated watchlist item
 */
export const toggleWatchedStatus = async (movieId) => {
  try {
    const response = await API.put(`/watchlist/${movieId}/toggle`);
    return response.data;
  } catch (error) {
    console.error("Error toggling watched status:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch trending movies from TMDb via backend
 * @returns {Promise<Object[]>} - Array of trending movies
 */
export const fetchTrendingMovies = async () => {
  try {
    const response = await API.get(`/movies/trending`);
    console.log("✅ Trending Movies API Response:", response.data);

    // Ensure it returns only 4 movies, without breaking other code
    return response.data.results ? response.data.results.slice(0, 4) : [];

  } catch (error) {
    console.error("❌ Error fetching trending movies:", error.response?.data || error.message);
    return [];
  }
};

export default API;