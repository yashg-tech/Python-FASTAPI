import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import '../App.css'; 

interface LoginProps {
  onLoginSuccess: (userId: string) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid Credentials");
        return;
      }
            sessionStorage.setItem("userId",data.user_id);
            sessionStorage.setItem("token",data.access_token);
            sessionStorage.setItem("refresh_token",data.refresh_token);
           sessionStorage.setItem("role",data.role);

        onLoginSuccess(data.user_id); }
        
        catch (err) {
      setError("Cannot connect to backend server.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
    
        <div className="auth-tabs">
          <button className="auth-tab-btn auth-tab-active" style={{ cursor: "default" }}>
            Login
          </button>
          <button onClick={onSwitchToSignup} className="auth-tab-btn auth-tab-inactive">
            Signup
          </button>
        </div>

        <h2 className="auth-title">Login Form</h2>
        
        <form onSubmit={handleLogin} className="auth-form">
          <Form.Control type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="auth-input" />
          
          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "15px", fontWeight: "500" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;