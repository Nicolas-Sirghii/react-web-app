import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { setVerifiEmail } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

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
        dispatch(setVerifiEmail())
      } catch (err) {
        setMessage(err.message);
      }
    };

    verifyEmail();

     setTimeout(() => {
       window.location.href = "/profile";
    }, 4000);

  }, [searchParams]);


//   const markAsVerified = () => {
//   clearInterval(countdownInterval.current);
//   clearInterval(sendingInterval.current);

//   localStorage.removeItem(STORAGE_KEY);
//   localStorage.setItem(VERIFIED_KEY, "true");

//   setState("verified");
//   setTimeLeft(0);
// };

  return (
    <div>
        <div className="popup-overlay">
          <div className="popup">
            <h2>Email Verification</h2>
            {message && <p>{message}</p>}
          </div>
        </div>
    </div>
  );
}