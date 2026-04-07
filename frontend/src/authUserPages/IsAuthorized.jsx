import { useEffect, useState } from "react";

export function IsAuthorizedPage() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setStatus("Not authorized");
      return;
    }

    fetch("http://localhost:8000/is-authorized", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((text) => {
        if (text.answer === "1") {
          setStatus("Is authorized");
        } else {
          setStatus("Not authorized");
        }
      })
      .catch(() => {
        setStatus("Not authorized");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontSize: "24px" }}>
      {status}
    </div>
  );
}