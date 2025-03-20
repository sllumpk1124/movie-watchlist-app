import React, { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";

/**
 * Signup page component
 */
const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🔄 Attempting signup...");
      const userData = await signupUser({ username, email, password }); // ✅ Token is stored inside signupUser
      
      if (!userData) {
        throw new Error("Signup failed");
      }

      console.log("✅ Signup successful:", userData);
      navigate("/search"); // ✅ Redirect to search page after signup
    } catch (error) {
      console.error("❌ Signup error:", error.message);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>} {/* ✅ Error display */}
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
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;