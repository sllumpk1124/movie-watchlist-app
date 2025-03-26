import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Navigation bar component for the app.
 * Adjusts displayed links based on authentication status.
 *
 * Props:
 * - isAuthenticated (boolean): whether the user is logged in
 * - username (string): currently logged in user's username
 * - setIsAuthenticated (function): setter to update auth state
 * - setUsername (function): setter to update username
 */
function Navbar({ isAuthenticated, username, setIsAuthenticated, setUsername }) {
  const navigate = useNavigate();

  // Optional: Auto-logout UI refresh if token is deleted elsewhere
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setUsername(null);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [setIsAuthenticated, setUsername]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        🎬 Movie Watchlist 🎬
      </Link>
      <div style={styles.links}>
        {isAuthenticated ? (
          <>
            <span style={styles.username}>Hello, {username}</span>
            <Link to="/search" style={styles.link}>
               Search
            </Link>
            <Link to="/watchlist" style={styles.link}>
               My Watchlist
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
               Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
               Login
            </Link>
            <Link to="/signup" style={styles.link}>
               Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#222",
    color: "#fff",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
  },
  logoutBtn: {
    backgroundColor: "#e63946",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  username: {
    color: "#ccc",
    fontSize: "1rem",
    marginRight: "1rem",
  },
};

export default Navbar;