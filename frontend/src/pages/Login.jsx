import { useState } from "react";
import { loginUser } from "../services/api";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    

    if (!isValidEmail(credentials.email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    setLoading(true); 

    try {
      const user = await loginUser(credentials);
      onLoginSuccess(user);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-100">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

export default Login;