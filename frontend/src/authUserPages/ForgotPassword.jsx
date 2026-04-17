import { useState } from "react";
import { useSelector } from "react-redux";
import "./Cyberpunk.css";

export function ForgotPassword() {
  const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);

    const res = await fetch(`${host}/forgot-password`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="cyber-container">
      <h2 className="cyber-title">Forgot Password</h2>
      <form className="cyber-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="cyber-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="cyber-button">Send Link</button>
      </form>
      {message && <p className="cyber-message">{message}</p>}
    </div>
  );
}