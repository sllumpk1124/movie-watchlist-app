import React, { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "../services/api";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    getWatchlist(setWatchlist);
  }, []);

  return (
    <Container>
      <h2 className="text-center mt-4">🎬 Your Watchlist</h2>
      <Row>
        {watchlist.length === 0 ? (
          <p className="text-center">No movies in watchlist.</p>
        ) : (
          watchlist.map((item) => (
            <Col key={item.movieId} md={4} lg={3}>
              <Card className="mb-3 shadow-sm border-0" style={{ width: "100%", maxWidth: "230px" }}>
                <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w200${item.Movie.poster_path}`} />
                <Card.Body>
                  <Card.Title className="text-center">{item.Movie.title}</Card.Title>
                  <Card.Text className="text-muted text-center">
                    Released: {item.Movie.release_date}
                  </Card.Text>
                  <div className="d-flex justify-content-center">
                    <Button variant="danger" onClick={() => removeFromWatchlist(item.movieId, setWatchlist)}>
                      ❌ Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default WatchlistPage;