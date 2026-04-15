import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./verifiedAnimation.css"

const TOTAL_TIME = 1 * 60;
const STORAGE_KEY = "verify_end_time";
const VERIFIED_KEY = "is_verified";

export function VerifyButton() {

    const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;


  const [state, setState] = useState("idle"); 
  // idle | sending | countdown | verified

  const [dots, setDots] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const [message, setMessage] = useState("");
  const [popup, setPopup] = useState(false);

  const sendingInterval = useRef(null);
  const countdownInterval = useRef(null);

  // 🔁 Restore state on load
  useEffect(() => {
    const isVerified = localStorage.getItem(VERIFIED_KEY);

    if (isVerified === "true") {
      setState("verified");
      return;
    }

    const savedEnd = localStorage.getItem(STORAGE_KEY);

    if (savedEnd) {
      const remaining = Math.floor((savedEnd - Date.now()) / 1000);

      if (remaining > 0) {
        setState("countdown");
        setTimeLeft(remaining);
        startCountdown(savedEnd);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleSendEmail = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessage("No login token found.");
      setPopup(true);
      return false;
    }

    try {
      const res = await fetch(`${host}/send-verification-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      const endTime = Date.now() + (data.expires * 60) * 1000;
      localStorage.setItem(STORAGE_KEY, endTime);


      if (!res.ok) throw new Error(data.detail || "Something went wrong");

      setMessage(data.message);
      setPopup(true);
      setTimeout(() => setPopup(false), 4000);

      return true;
    } catch (err) {
      setMessage(err.message);
      setPopup(true);
      return false;
    }
  };

  const handleClick = async () => {
    if (state !== "idle") return;

    setState("sending");

    sendingInterval.current = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 500);

    const success = await handleSendEmail();

    clearInterval(sendingInterval.current);
    setDots("");

    if (!success) {
      setState("idle");
      return;
    }

    const endTime = Number(localStorage.getItem(STORAGE_KEY))

    setState("countdown");
    startCountdown(endTime);
  };

  const startCountdown = (endTime) => {
    countdownInterval.current = setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(countdownInterval.current);
        localStorage.removeItem(STORAGE_KEY);
        setState("idle");
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
  };

  // ✅ THIS is the function you will reuse later
  const markAsVerified = () => {
    clearInterval(countdownInterval.current);
    clearInterval(sendingInterval.current);

    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(VERIFIED_KEY, "true");

    setState("verified");
    setTimeLeft(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(sendingInterval.current);
      clearInterval(countdownInterval.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  let text = "not verified";

  if (state === "sending") {
    text = `sending${dots}`;
  }

  if (state === "countdown") {
    text = `link sent ${formatTime(timeLeft)}`;
  }

  if (state === "verified") {
    text = "verified";
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`verify-btn ${
          state !== "idle" ? "disabled active" : ""
        }`}
        disabled={state !== "idle"}
      >
        {text}
      </button>

      {/* ✅ TEST BUTTON (you'll remove later) */}
      {state !== "verified" && (
        <button
          onClick={markAsVerified}
          style={{ marginLeft: "10px" }}
        >
          Mark as verified
        </button>
      )}

      {popup && <div className="popup">{message}</div>}
    </>
  );
}