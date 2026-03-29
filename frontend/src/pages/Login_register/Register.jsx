import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // reuse same styles + popup

export function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      // ❗ handle backend errors
      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      // ✅ success
      setIsError(false);
      setMessage("Account created successfully!");
      setShowPopup(true);

      // optional: redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setIsError(true);
      setMessage(err.message);
      setShowPopup(true);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>REGISTER</h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

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

        <button type="submit">Create Account</button>

        <p className="link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>

      {/* 🔴 Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{isError ? "Error" : "Success"}</h3>
            <p>{message}</p>
            <button onClick={() => setShowPopup(false)}>
              {isError ? "Close" : "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}