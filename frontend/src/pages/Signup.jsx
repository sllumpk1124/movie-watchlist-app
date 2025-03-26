import React, { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";


const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
/**
 * Signup page component
 */
const Signup = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    // Password must be at least 8 characters
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
  
    // Password must include at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must include at least one letter and one number.");
      return;
    }
  
    setLoading(true);
  
    try {
      const userData = await signupUser({ username, email, password });
      if (!userData) throw new Error("Signup failed");
      onSignupSuccess?.(userData); // ✅ Call parent update if provided
      navigate("/search");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;