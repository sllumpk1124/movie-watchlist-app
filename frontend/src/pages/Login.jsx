import React, { useState } from "react";
import { loginUser } from "../Services/api";
import { useNavigate } from "react-router-dom";

/**
 * Login page component
 */
const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  /**
   * Handles form submission for login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(credentials);
      localStorage.setItem("token", res.token);
      navigate("/search"); // Redirect to Search Page after login
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          required
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
        <input
          type="password"
          className="form-control mt-2"
          placeholder="Password"
          required
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button className="btn btn-success mt-3" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;