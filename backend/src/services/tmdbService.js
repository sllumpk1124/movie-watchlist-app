const axios = require("axios");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const fetchMovies = async (query) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query },
    });
    return response.data.results;
  } catch (error) {
    console.error("❌ Error fetching movies:", error);
    return [];
  }
};

module.exports = { fetchMovies };