import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Cyberpunk.css";

export function RecoverPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // 🚨 If no token → block page
  if (!token) {
    return (
      <div className="cyber-container">
        <h2 className="cyber-title">Invalid Access</h2>
        <p className="cyber-message">
          This page cannot be accessed directly.  
          Please use the password recovery link sent to your email.
        </p>
        <button className="cyber-button" onClick={() => navigate("/forgot-password")}>
          Go to Forgot Password
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setMessage("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/recover-password", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Something went wrong");
        return;
      }

      setMessage("Password successfully updated");

      // optional redirect after success
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="cyber-container">
      <h2 className="cyber-title">Recover Password</h2>

      <form className="cyber-form" onSubmit={handleSubmit}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          className="cyber-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Repeat New Password"
          className="cyber-input"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        <label className="cyber-checkbox">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        <button type="submit" className="cyber-button">
          Change Password
        </button>
      </form>

      {message && <p className="cyber-message">{message}</p>}
    </div>
  );
}