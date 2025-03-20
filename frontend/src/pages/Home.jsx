import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  // Redirect logged-in users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/search"); // Or any default logged-in route
    }
  }, [navigate]);

  return (
    <Container className="text-center py-5">
      <h1 className="mb-4">Welcome to Movie Watchlist!</h1>
      <p className="mb-4">Please login or sign up to get started.</p>

      {/* Show buttons only if no form is being shown */}
      {!showLogin && !showSignup && (
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button variant="primary" size="lg" onClick={() => setShowLogin(true)} className="me-3">
              Login
            </Button>
            <Button variant="success" size="lg" onClick={() => setShowSignup(true)}>
              Sign Up
            </Button>
          </Col>
        </Row>
      )}

      {/* Show Login form if selected */}
      {showLogin && (
        <div className="mt-4">
          <Login />
          <Button variant="link" onClick={() => { setShowLogin(false); }}>
            Back
          </Button>
        </div>
      )}

      {/* Show Signup form if selected */}
      {showSignup && (
        <div className="mt-4">
          <Signup />
          <Button variant="link" onClick={() => { setShowSignup(false); }}>
            Back
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;