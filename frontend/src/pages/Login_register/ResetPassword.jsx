import { useState } from "react";
import "./Login.css";

export function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);

  // ✅ Step 1: Send Code
  const handleSendCode = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to send code");
      }

      setIsError(false);
      setMessage("Recovery code sent to your email");
      setShowPopup(true);

      setStep(2);

    } catch (err) {
      setIsError(true);
      setMessage(err.message);
      setShowPopup(true);
    }
  };

  // ✅ Step 2: Reset Password
  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Reset failed");
      }

      setIsError(false);
      setMessage("Password reset successfully!");
      setShowPopup(true);

      // optional: go back to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err) {
      setIsError(true);
      setMessage(err.message);
      setShowPopup(true);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card">
        <h2>RECOVER PASSWORD</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="button" onClick={handleSendCode}>
              Send Recovery Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter Code"
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button type="button" onClick={handleReset}>
              Reset Password
            </button>
          </>
        )}

        <p className="link">
          <a href="/login">Back to Login</a>
        </p>
      </form>

      {/* 🔴 Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{isError ? "Error" : "Success"}</h3>
            <p>{message}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}