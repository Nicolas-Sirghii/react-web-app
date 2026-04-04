import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"

export function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
   const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;

  useEffect(() => {
    // 1️⃣ Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("No token provided.");
      return;
    }

    // 2️⃣ Send token to backend to verify
    fetch(`${host}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then(() => setStatus("🎉 Congratulations! Your email is verified."))
      .catch(() => setStatus("Verification failed."));
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Email Verification</h2>
      <p>{status}</p>
    </div>
  );
}