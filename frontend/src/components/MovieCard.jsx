import React, { useState } from "react";
import { fetchMovieDetails, addToWatchlist } from "../Services/api"; // Ensure correct imports
import { Card, Button, Modal } from "react-bootstrap";

/**
 * MovieCard component - Displays movie information with a modal for detailed info
 */
const MovieCard = ({ movie }) => {
  const [show, setShow] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);

  /**
   * Fetches additional movie details when "More Info" is clicked
   */
  const handleMoreInfo = async () => {
    try {
      console.log(`🔄 Fetching details for movie ID: ${movie.id}...`);
      const details = await fetchMovieDetails(movie.id);
      
      if (!details || !details.title) {
        throw new Error("Movie details not found");
      }
  
      console.log("✅ Movie details:", details);
      setMovieDetails(details);
    } catch (error) {
      console.error("❌ Error fetching movie details:", error.message);
      setMovieDetails({ title: "Error", overview: "Movie details not available." });
    }
  };

  /**
   * Handles adding movie to watchlist
   */
  const handleAddToWatchlist = async () => {
    try {
      const response = await addToWatchlist(movie);
      if (response) {
        alert("Movie added to watchlist!");
      } else {
        alert("Movie already in watchlist or an error occurred.");
      }
    } catch (error) {
      alert("Error adding movie.");
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Img
        variant="top"
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "https://via.placeholder.com/300"}
        alt={movie.title}
        style={{ height: "400px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Button variant="info" className="me-2" onClick={handleMoreInfo}>
          More Info
        </Button>
        <Button variant="success" onClick={handleAddToWatchlist}>
          Add to Watchlist
        </Button>
      </Card.Body>

      {/* Movie Details Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{movieDetails?.title || "Movie Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Description:</strong> {movieDetails?.description || "No description available."}</p>
          <p><strong>Release Date:</strong> {movieDetails?.release_date || "Unknown"}</p>
          <p><strong>Cast:</strong> {movieDetails?.cast?.join(", ") || "No cast available."}</p>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default MovieCard;