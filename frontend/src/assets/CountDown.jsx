import { useEffect, useState } from "react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());


  function getTimeLeft() {
    const expiresAt = localStorage.getItem("expires_at");
    if (!expiresAt) return 0;

    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <span>
      {timeLeft > 0 ? formatTime(timeLeft) : "Session expired"}
    </span>
  );
}