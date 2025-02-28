import React, { useState } from "react";
import { signupUser } from "../Services/api";
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
      const userData = await signupUser({ username, email, password });
  
      if (!userData) {
        throw new Error("Signup failed");
      }
  
      console.log("✅ Signup successful:", userData);
      navigate("/login");
    } catch (error) {
      console.error("❌ Signup error:", error.message);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* ✅ Display error message */}
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;