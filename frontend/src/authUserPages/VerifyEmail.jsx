import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { setVerifiEmail } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");


  const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;

  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("No verification token found.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${host}/verify-email`, {
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