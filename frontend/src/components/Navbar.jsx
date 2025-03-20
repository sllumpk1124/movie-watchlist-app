import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const MyNavbar = ({ isAuthenticated, username }) => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          {/* Navbar Brand */}
          <Navbar.Brand as={Link} to="/">Movie Watchlist</Navbar.Brand>

          {/* Navigation Links (Always Visible) */}
          <Nav className="me-auto">
            {isAuthenticated && <Nav.Link as={Link} to="/search">Search</Nav.Link>}
            {isAuthenticated && <Nav.Link as={Link} to="/watchlist">Watchlist</Nav.Link>}
          </Nav>

          {/* User Greeting & Authentication Links */}
          <Nav className="align-items-center">
            {isAuthenticated && username && (
              <Navbar.Text className="me-3 text-light">
                Hello, <strong>{username}</strong>
              </Navbar.Text>
            )}
            {isAuthenticated ? (
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* ✅ Show welcome message only for non-logged-in users */}
      {!isAuthenticated && (
        <Container className="text-center mt-4">
          <h4 className="text-light">🎬 Welcome to Movie Watchlist!</h4>
          <p className="text-muted">
            Please <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link> to get started.
          </p>
        </Container>
      )}
    </>
  );
};

export default MyNavbar;