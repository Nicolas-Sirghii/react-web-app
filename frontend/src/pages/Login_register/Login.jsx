import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      // ❗ handle invalid credentials
      if (!data.token || data.token === "Invalid Credentials") {
        throw new Error("Invalid email or password");
      }

      // ✅ success
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("username", data.username);

      navigate("/message");

    } catch (err) {
      setError(err.message);
      setShowPopup(true);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>LOGIN</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p className="link">
          <a href="/forgot-password">Forgot Password?</a>
        </p>

        <p className="link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>

      {/* 🔴 POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Login Error</h3>
            <p>{error}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

