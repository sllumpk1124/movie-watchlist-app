import React, { useEffect, useState } from "react";
import { fetchTrendingMovies, searchMovies } from "../services/api";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import SearchBar from "../components/SearchBar";

const WelcomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTrendingMovies = async () => {
      const data = await fetchTrendingMovies();
      console.log("Trending Movies:", data);
      setMovies(data || []);
      setLoading(false);
    };

    getTrendingMovies();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    const results = await searchMovies(query);
    setMovies(results);
    setLoading(false);
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Trending Movies</h1>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Loader */}
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* No Movies */}
      {!loading && movies.length === 0 && (
        <Alert variant="info" className="text-center">
          No movies found.
        </Alert>
      )}

      {/* Movies */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {movies.map((movie) => (
          <Col key={movie.id}>
            <Card className="h-100 shadow-sm bg-dark text-white">
              {movie.poster_path ? (
                <Card.Img
                  variant="top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ height: "400px", objectFit: "cover" }}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center bg-secondary" style={{ height: "400px" }}>
                  <span>No Image</span>
                </div>
              )}
              <Card.Body>
                <Card.Title className="text-center">{movie.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WelcomePage;