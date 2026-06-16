import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import "../App.css";
import { Link } from "react-router-dom";

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Signup failed");
        return;
      }

      setMessage("Account created successfully! Switching to Login...");
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } catch (err) {
      setError("Cannot connect to backend server.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Sliding Tabs Layout using CSS Classes */}
        <div className="auth-tabs">
          <Link
  to="/"
  className="auth-tab-btn auth-tab-inactive"
  style={{ textDecoration: "none" }}
>
  Login
</Link>
          <button className="auth-tab-btn auth-tab-active" style={{ cursor: "default" }}>
            Signup
          </button>
        </div>

        <h2 className="auth-title">Signup Form</h2>
        
        <form onSubmit={handleSignup} className="auth-form">
          <Form.Control type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="auth-input" />
          
          <button type="submit" className="auth-submit-btn">
            Signup
          </button>
        </form>

        {message && <p style={{ color: "green", marginTop: "15px", fontWeight: "500" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "15px", fontWeight: "500" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Signup;