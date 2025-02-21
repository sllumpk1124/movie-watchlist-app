import React, { useState } from "react";
import { searchMovies } from "../Services/api";
import MovieCard from "../components/MovieCard"; // Ensure correct import
import { Form, Button, Container, Row, Col } from "react-bootstrap";

/**
 * Search Page Component - Allows users to search for movies
 */
const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  /**
   * Handles movie search
   */
  const handleSearch = async (page = 1) => {
    if (!query) return;

    try {
      const response = await searchMovies(query, page);
      setMovies(response.results || []);
      setTotalPages(response.total_pages || 0);
      setCurrentPage(page);
      setSearchPerformed(true);
      setError("");
    } catch (err) {
      setError("Failed to fetch movies");
    }
  };

  /**
   * Handles pagination navigation
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleSearch(newPage);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Search Movies</h2>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(1);
        }}
        className="d-flex mb-4"
      >
        <Form.Control
          type="text"
          placeholder="Enter movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="me-2"
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </Form>

      {error && <p className="text-danger">{error}</p>}

      <Row>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Col key={movie.id} md={4} lg={3} className="mb-4">
              <MovieCard movie={movie} />
            </Col>
          ))
        ) : searchPerformed ? (
          <p className="text-center text-muted">No movies found. Try another search.</p>
        ) : null}
      </Row>

      {/* Pagination Buttons */}
      {searchPerformed && totalPages > 1 && (
        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;