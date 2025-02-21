import React, { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../Services/api";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([]); // Store trending movies

  /** Load trending movies on page load */
  useEffect(() => {
    const loadTrendingMovies = async () => {
      const trendingMovies = await fetchTrendingMovies();
      setMovies(trendingMovies.slice(0, 4)); // Limit to 4 movies
    };
    loadTrendingMovies();
  }, []);

  return (
    <Container className="mt-4 text-center">
      <h2 className="mb-3">🎬 Welcome to Movie Watchlist</h2>

      {/* Login / Signup Buttons */}
      <div className="mb-4">
        <Link to="/login" className="btn btn-primary me-2">
          Login
        </Link>
        <Link to="/signup" className="btn btn-success">
          Signup
        </Link>
      </div>

      {/* Trending Movies */}
      <Row>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Col key={movie.id} md={6} lg={3} className="mb-4">
              <Card>
                {movie.poster_path ? (
                  <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="text-center p-4">No Image</div>
                )}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-muted">No trending movies available.</p>
        )}
      </Row>
    </Container>
  );
};

export default Home;