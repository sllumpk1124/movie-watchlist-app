import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SearchPage from "./pages/SearchPage";
import WatchlistPage from "./pages/WatchlistPage";
import Navbar from "./components/Navbar";

/**
 * Function to check if the user is logged in
 */
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

/**
 * App Component - Defines all routes
 */
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default Route - Redirect to Welcome Page */}
        <Route path="/" element={<WelcomePage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/search" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated() ? <Navigate to="/search" /> : <Signup />} />

        {/* Protected Routes - Only accessible when logged in */}
        <Route path="/search" element={<ProtectedRoute element={<SearchPage />} />} />
        <Route path="/watchlist" element={<ProtectedRoute element={<WatchlistPage />} />} />

        {/* Catch-All Route - Redirect to Welcome Page if path is unknown */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;