import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

/**
 * Login page component
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🔄 Attempting login...");
      
      const userData = await loginUser({ email, password }); // ✅ loginUser stores token internally

      if (!userData) {
        throw new Error("Invalid credentials");
      }

      console.log("✅ Login successful:", userData);
      navigate("/search"); // Redirect to search after login
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      setError("Invalid credentials. Please try again."); // Show user-friendly error
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>} {/* ✅ Error display */}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;