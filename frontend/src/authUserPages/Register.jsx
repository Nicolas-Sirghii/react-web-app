import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Login.css";

export function Register() {
  const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // username: "",
    email: "",
    password: "",
    confirmPassword: "", // ✅ NEW
  });

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);

  // ✅ show password toggle
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❗ check passwords match
    if (form.password !== form.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch(`${host}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }), // ✅ don't send confirmPassword
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setIsError(false);
      setMessage("Account created successfully!");
      setShowPopup(true);

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
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        {/* 🔑 PASSWORD */}
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={handleChange}
          required
        />

        {/* 🔑 CONFIRM PASSWORD */}
        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        {/* 👁 TOGGLE */}
        <label className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Passwords
        </label>

        <button type="submit">Create Account</button>

        <p className="link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>

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