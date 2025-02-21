import React, { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../Services/api";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const WelcomePage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      const trendingMovies = await fetchTrendingMovies();
      setMovies(trendingMovies);
    };
    loadTrendingMovies();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center">🎬 Welcome to Movie Watchlist</h2>
      <p className="text-center">Sign up or log in to create your watchlist!</p>
      <Row>
        {movies.slice(0, 5).map((movie) => (
          <Col key={movie.id} md={4} lg={3} className="mb-4">
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
                <Button variant="info" as={Link} to="/login">
                  Login to Add to Watchlist
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WelcomePage;