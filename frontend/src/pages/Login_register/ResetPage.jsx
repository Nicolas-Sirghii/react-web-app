import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Auth.css";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const host = localStorage.getItem("api") || "http://localhost:8000";

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${host}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail);
      }

      setMessage("Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleReset}>
        <h2>NEW PASSWORD</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}