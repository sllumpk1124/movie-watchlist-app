import React, { useEffect, useState } from "react";
import API from "../Services/api";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await API.get("/watchlist");
        setWatchlist(res.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };
    fetchWatchlist();
  }, []);

  /**
   * Toggles the watched status of a movie.
   */
  const toggleWatchedStatus = async (movieId) => {
    try {
      const res = await API.put(`/watchlist/${movieId}/toggle`);
      setWatchlist(
        watchlist.map((movie) =>
          movie.movieId === movieId ? { ...movie, watched: res.data.watched } : movie
        )
      );
    } catch (error) {
      console.error("Error toggling watched status:", error);
    }
  };

  /**
   * Deletes a movie from the watchlist.
   */
  const handleDelete = async (movieId) => {
    try {
      await API.delete(`/watchlist/${movieId}`);
      setWatchlist(watchlist.filter((movie) => movie.movieId !== movieId));
    } catch (error) {
      console.error("Error deleting movie from watchlist:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p className="text-center text-muted">Your watchlist is empty.</p>
      ) : (
        <Row>
          {watchlist.map((item) => (
            <Col key={item.id} md={4} lg={3} className="mb-4">
              <Card>
                {item.Movie.poster_path ? (
                  <Card.Img
                    variant="top"
                    src={`https://image.tmdb.org/t/p/w300${item.Movie.poster_path}`}
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="text-center p-4">No Image</div>
                )}
                <Card.Body>
                  <Card.Title>{item.Movie.title}</Card.Title>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant={item.watched ? "success" : "warning"}
                      onClick={() => toggleWatchedStatus(item.movieId)}
                    >
                      {item.watched ? "Watched" : "Will Watch"}
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(item.movieId)}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default WatchlistPage;