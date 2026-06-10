import React, { useState } from "react";
import Form from "react-bootstrap/Form";

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

      if (data.user_id) {
        localStorage.setItem("userId", data.user_id);
        onLoginSuccess(data.user_id);
      }
    } catch (err) {
      setError("Cannot connect to backend server.");
    }
  };

  return (
    <div className="auth-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#1e6091" }}>
      <div className="auth-card" style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", boxShadow: "0px 8px 24px rgba(0,0,0,0.2)", width: "100%", maxWidth: "400px", textAlign: "center" }}>
        
        {/* Sliding Tabs Layout */}
        <div className="auth-tabs" style={{ display: "flex", borderRadius: "8px", overflow: "hidden", marginBottom: "25px", border: "1px solid #ddd" }}>
          <button style={{ flex: 1, padding: "10px", border: "none", cursor: "default", fontWeight: "bold", backgroundColor: "#1a365d", color: "#fff" }}>
            Login
          </button>
          <button onClick={onSwitchToSignup} style={{ flex: 1, padding: "10px", border: "none", cursor: "pointer", fontWeight: "bold", backgroundColor: "#f8f9fa", color: "#333" }}>
            Signup
          </button>
        </div>

        <h2 style={{ marginBottom: "20px", color: "#333" }}>Login Form</h2>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Form.Control type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "12px" }} />
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "12px" }} />
          
          <button type="submit" style={{ padding: "12px", backgroundColor: "#1a365d", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>
            Login
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "15px", fontWeight: "500" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;