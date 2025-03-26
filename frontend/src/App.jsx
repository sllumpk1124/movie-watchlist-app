import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import WatchlistPage from "./pages/WatchlistPage";
import WelcomePage from "./pages/WelcomePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    setIsAuthenticated(!!token);
    if (token && storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("tokenExpiration");
      if (expirationTime && new Date().getTime() > expirationTime) {
        console.log("🔴 Token expired, logging out...");
        localStorage.clear();
        setIsAuthenticated(false);
        setUsername(null);
        navigate("/login");
      }
    };
    const interval = setInterval(checkTokenExpiration, 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
      <Navbar
  isAuthenticated={isAuthenticated}
  username={username}
  setIsAuthenticated={setIsAuthenticated}
  setUsername={setUsername}
/>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/search" replace /> : <WelcomePage />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              onLoginSuccess={(user) => {
                setIsAuthenticated(true);
                setUsername(user.username);
                navigate("/search");
              }}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              onSignupSuccess={(user) => {
                setIsAuthenticated(true);
                setUsername(user.username);
              }}
            />
          }
        />
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