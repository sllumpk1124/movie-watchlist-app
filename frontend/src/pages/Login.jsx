import React, { useState } from "react";
import { loginUser } from "../services/api";

/**
 * Login page component.
 */
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login for:", username); // ✅ Check if input is captured

    try {
      const { data } = await loginUser({ username, password });
      console.log("Login success:", data); // ✅ Check if login works
      localStorage.setItem("token", data.token);
      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;