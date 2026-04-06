import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("No verification token found.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("http://localhost:8000/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Verification failed");
        setMessage(data.message);
      } catch (err) {
        setMessage(err.message);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div>
      <h2>Email Verification</h2>
      {message && <p>{message}</p>}
    </div>
  );
}