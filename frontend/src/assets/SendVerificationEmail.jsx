import React, { useState } from "react";

export function SendVerificationEmail() {
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessage("No login token found.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/send-verification-email", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <button onClick={handleSendEmail}>Send Verification Email</button>
      {message && <p>{message}</p>}
    </div>
  );
}