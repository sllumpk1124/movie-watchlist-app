import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

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
 * Logs in a user and stores their authentication token.
 * @param {Object} credentials - The user's login credentials (email, password).
 * @returns {Object} The authenticated user data.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    const { token, user } = response.data;
    if (token) {
      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // Expires in 1 hour
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime);
      localStorage.setItem("username", user.username);
    }
    return user;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Signs up a new user and stores their authentication token.
 * @param {Object} credentials - The user's signup credentials.
 * @returns {Object} The newly created user data.
 */
export const signupUser = async (credentials) => {
  try {
    const response = await API.post("/auth/signup", credentials);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
    }
    return user;
  } catch (error) {
    console.error("❌ Signup failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches a list of trending movies.
 * @returns {Array} List of trending movies.
 */
export const fetchTrendingMovies = async () => {
  try {
    console.log("🟢 Fetching trending movies...");
    const response = await API.get("/movies/trending");
    return response.data.results || [];
  } catch (error) {
    console.error("❌ Error fetching trending movies:", error.response?.data || error.message);
    return [];
  }
};

/**
 * Searches for movies by query.
 * @param {string} query - The search term.
 * @returns {Array} List of search results.
 */
export const searchMovies = async (query) => {
  try {
    console.log(`🟢 Searching movies for query: "${query}"`);
    const response = await API.get(`/movies/search?query=${query}`);
    return response.data.results || [];
  } catch (error) {
    console.error("❌ Error searching movies:", error.response?.data || error.message);
    return [];
  }
};

/**
 * Fetches details for a specific movie.
 * @param {string} movieId - The ID of the movie.
 * @returns {Object|null} Movie details or null if not found.
 */
export const fetchMovieDetails = async (movieId) => {
  try {
    console.log(`🟢 Fetching movie details for ID: ${movieId}`);
    const response = await API.get(`/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching movie details:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Adds a movie to the watchlist with a default "must-watch" status.
 * @param {string} movieId - The ID of the movie.
 * @returns {Object|null} The added watchlist entry or null if failed.
 */
export const addToWatchlist = async (movie, setWatchlist) => {
  try {
    console.log(`🟢 Attempting to add movie ${movie.id} to watchlist...`);

    const response = await API.post("/watchlist", {
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      watched: false, // Default to must-watch
    });

    console.log("✅ Movie added to watchlist:", response.data);

    // ✅ Update watchlist state to trigger UI update
    if (setWatchlist) {
      setWatchlist((prev) => [...prev, response.data]);
    }

    alert(`✅ "${movie.title}" added to your watchlist!`);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding movie to watchlist:", error.response?.data || error.message);
    alert("❌ Failed to add movie to watchlist.");
    return null;
  }
};
/**
 * Fetches the user's watchlist.
 * @returns {Array} List of movies in the watchlist.
 */
export const getWatchlist = async (setWatchlist) => {
  try {
    console.log("🟢 Fetching watchlist...");
    const response = await API.get("/watchlist");

    if (!response.data || !Array.isArray(response.data)) {
      console.warn("⚠️ No movies found in watchlist.");
      setWatchlist([]); // Ensure UI updates
      return [];
    }

    console.log("✅ Watchlist fetched:", response.data);
    setWatchlist(response.data); // ✅ Updates UI

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching watchlist:", error.response?.data || error.message);
    setWatchlist([]); // Ensure UI clears when error occurs
    return [];
  }
};

/**
 * Removes a movie from the watchlist.
 * @param {string} watchlistId - The ID of the watchlist entry.
 * @returns {boolean} True if deleted successfully, false otherwise.
 */
export const removeFromWatchlist = async (movieId, setWatchlist) => {
  try {
    console.log(`🟢 Removing movie ${movieId} from watchlist...`);

    await API.delete(`/watchlist/${movieId}`);

    console.log("✅ Movie removed from watchlist");

    // ✅ Remove the movie from the UI
    if (setWatchlist) {
      setWatchlist((prev) => prev.filter((item) => item.movieId !== movieId));
    }
  } catch (error) {
    console.error("❌ Error removing movie from watchlist:", error.response?.data || error.message);
  }
};

export default API;