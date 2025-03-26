import React, { useState, useEffect } from "react";
import { 
  fetchTrendingMovies, 
  searchMovies, 
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../services/api";
import { Card, Button, Container, Row, Col, Modal, Form } from "react-bootstrap";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const trending = await fetchTrendingMovies();
        setTrendingMovies(trending || []);
        await getWatchlist(setWatchlist);
      } catch (err) {
        console.error("❌ Error fetching initial data:", err);
        setError("Failed to load data.");
      }
    };
    loadInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const results = await searchMovies(query);

      if (results.length === 0) {
        setError("⚠️ No results found. Try another search.");
      }

      setMovies(results);
    } catch (err) {
      console.error("❌ Search failed:", err);
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowMoreInfo = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await addToWatchlist(movie, setWatchlist);
    } catch (err) {
      console.error("❌ Error adding to watchlist:", err);
      alert("Failed to add movie to watchlist.");
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await removeFromWatchlist(movieId, setWatchlist);
    } catch (err) {
      console.error("❌ Error removing from watchlist:", err);
      alert("Failed to remove movie from watchlist.");
    }
  };

  const isInWatchlist = (movieId) =>
    watchlist.some((item) => item.movieId === movieId);

  const renderMovieButtons = (movie) => {
    const inWatchlist = isInWatchlist(movie.id);
    return (
      <>
        <Button variant="info" className="me-2" onClick={() => handleShowMoreInfo(movie)}>
          More Info
        </Button>
        {inWatchlist ? (
          <Button variant="danger" onClick={() => handleRemoveFromWatchlist(movie.id)}>
            Remove from Watchlist
          </Button>
        ) : (
          <Button variant="success" onClick={() => handleAddToWatchlist(movie)}>
            Add to Watchlist
          </Button>
        )}
      </>
    );
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🎬 Search for a Movie</h2>

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

      {error && <p className="text-danger text-center">{error}</p>}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
          <p>Loading movies...</p>
        </div>
      )}

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
                    {renderMovieButtons(movie)}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
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
                    {renderMovieButtons(movie)}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

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