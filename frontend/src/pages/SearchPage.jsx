import React, { useState, useEffect } from "react";
import { fetchTrendingMovies, searchMovies, addToWatchlist } from "../services/api";
import { Card, Button, Container, Row, Col, Modal, Form } from "react-bootstrap";

/**
 * SearchPage Component
 * --------------------
 * Allows users to search for movies, view trending movies, 
 * and add movies to their watchlist.
 */
const SearchPage = () => {
  // State for search input, search results, trending movies, and modal details
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches the top trending movies when the component mounts.
   */
  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        console.log("🔄 Fetching trending movies...");
        const movies = await fetchTrendingMovies();
        console.log("✅ Trending movies response:", movies);
        setTrendingMovies(movies || []);
      } catch (err) {
        console.error("❌ Error fetching trending movies:", err);
        setError("Failed to load trending movies. Please try again later.");
      }
    };

    loadTrendingMovies();
  }, []);

  /**
   * Handles movie search when the user submits the search form.
   * Calls the `searchMovies` API function to fetch results.
   * @param {Event} e - Form submission event.
   */
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevents page reload
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Searching movies for:", query);
      const results = await searchMovies(query);

      if (results.length === 0) {
        setError("⚠️ No results found. Try another search.");
      }

      console.log("✅ Search results:", results);
      setMovies(results); // ✅ Search results replace trending movies
    } catch (err) {
      console.error("❌ Search failed:", err);
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the movie details modal to display more information.
   * @param {Object} movie - The selected movie object.
   */
  const handleShowMoreInfo = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  /**
   * Adds a movie to the user's watchlist.
   * Calls `addToWatchlist` API function.
   * @param {Object} movie - The movie object to be added.
   */
  const handleAddToWatchlist = async (movie) => {
    try {
      console.log(`🟢 Adding movie "${movie.title}" to watchlist...`);
      await addToWatchlist(movie);
      alert(`✅ "${movie.title}" added to your watchlist!`);
    } catch (err) {
      console.error("❌ Error adding to watchlist:", err);
      alert("Failed to add movie to watchlist.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🎬 Search for a Movie</h2>

      {/* ✅ Search Bar - Wrapped in Form to Handle Enter Key */}
      <Form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
        <Form.Control
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control me-2"
          placeholder="Search for a movie..."
          style={{ width: "50%" }}
        />
        <Button variant="primary" type="submit">Search</Button>
      </Form>

      {/* ✅ Error Message */}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* ✅ Loading Indicator */}
      {loading && <p className="text-center">Loading...</p>}

      {/* ✅ Show Search Results First */}
      {movies.length > 0 ? (
        <>
          <h3 className="text-center">🔍 Search Results</h3>
          <Row>
            {movies.map((movie) => (
              <Col key={movie.id} md={6} lg={3} className="mb-3">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Button variant="info" className="me-2" onClick={() => handleShowMoreInfo(movie)}>
                      More Info
                    </Button>
                    <Button variant="success" onClick={() => handleAddToWatchlist(movie)}>
                      Add to Watchlist
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        // ✅ Show Trending Movies if No Search Results
        <>
          <h3 className="text-center">🔥 Trending Movies 🔥</h3>
          <Row>
            {trendingMovies.slice(0, 4).map((movie) => (
              <Col key={movie.id} md={6} lg={3} className="mb-3">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Button variant="info" className="me-2" onClick={() => handleShowMoreInfo(movie)}>
                      More Info
                    </Button>
                    <Button variant="success" onClick={() => handleAddToWatchlist(movie)}>
                      Add to Watchlist
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* ✅ Movie Details Modal */}
      {selectedMovie && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMovie.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Release Date:</strong> {selectedMovie.release_date}</p>
            <p>{selectedMovie.overview}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default SearchPage;