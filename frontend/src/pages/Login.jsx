import React, { useState } from "react";
import { loginUser } from "../Services/api";
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
      const userData = await loginUser({ email, password });

      if (!userData || !userData.token) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("token", userData.token);
      console.log("✅ Login successful:", userData);
      navigate("/");
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;