import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

/**
 * Navigation bar component
 */
const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /**
   * Handles user logout by clearing localStorage and redirecting to welcome page
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container className="d-flex flex-column align-items-center">
        {/* Centered Navbar Title */}
        <Navbar.Brand as={Link} to="/" className="mx-auto">
          🎬 Movie Watchlist 🎬
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Center Navigation Links */}
          <Nav className="mx-auto">
            {token ? (
              <>
                <Nav.Link as={Link} to="/search">Search Movies</Nav.Link>
                <Nav.Link as={Link} to="/watchlist">Watchlist</Nav.Link>
                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mx-2">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="mx-2">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;