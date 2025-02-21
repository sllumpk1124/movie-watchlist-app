import React, { useState } from "react";
import { signupUser } from "../Services/api";
import { useNavigate } from "react-router-dom";

/**
 * Signup page component
 */
const Signup = () => {
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  /**
   * Handles input changes dynamically
   */
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission for signup
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser(credentials);

      if (res && res.token) { 
        localStorage.setItem("token", res.token);
        console.log("✅ Signup successful, token received:", res.token);
        navigate("/search"); // Redirect to search page
      } else {
        console.error("❌ Unexpected response structure:", res);
        alert("Signup failed. Unexpected response.");
      }
    } catch (error) {
      console.error("❌ Signup error:", error.response?.data || error.message);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          className="form-control"
          placeholder="Username"
          required
          value={credentials.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          className="form-control mt-2"
          placeholder="Email"
          required
          value={credentials.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          className="form-control mt-2"
          placeholder="Password"
          required
          value={credentials.password}
          onChange={handleChange}
        />
        <button className="btn btn-primary mt-3" type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;