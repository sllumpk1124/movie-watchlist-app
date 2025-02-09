import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

/**
 * Fetch movies from the TMDB API.
 * @param {string} query - The movie title to search.
 * @returns {Promise} - A promise that resolves to the movie data.
 */
export const searchMovies = (query) => API.get(`/movies/search?query=${query}`);

/**
 * Register a new user.
 * @param {Object} userData - The user registration data.
 * @returns {Promise} - A promise that resolves to the API response.
 */
export const registerUser = (userData) => API.post("/auth/signup", userData);

/**
 * Log in a user.
 * @param {Object} userData - The user login data.
 * @returns {Promise} - A promise that resolves to the API response.
 */
export const loginUser = (userData) => API.post("/auth/login", userData);