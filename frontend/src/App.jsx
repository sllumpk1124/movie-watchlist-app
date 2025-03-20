import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import WatchlistPage from "./pages/WatchlistPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // ✅ Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    setIsAuthenticated(!!token);
    if (token && storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // ✅ Automatically log out users when the token expires
  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("tokenExpiration");
      if (expirationTime && new Date().getTime() > expirationTime) {
        console.log("🔴 Token expired, logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("username");
        setIsAuthenticated(false);
        setUsername(null);
        navigate("/login");
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
      {/* ✅ Pass authentication status & username to Navbar */}
      <Navbar isAuthenticated={isAuthenticated} username={username} />
      <Routes>
        {/* ✅ Redirect "/" to search for logged-in users, otherwise show welcome message */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/search" : "/"} replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;