import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export function Message() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState("IMAGE VAULT");
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  const navigate = useNavigate();
  

  // Fetch protected message
  useEffect(() => {
    async function fetchMessage() {
      try {
        const token = localStorage.getItem("jwt");
        const storedUsername = localStorage.getItem("username") || "";
        setUsername(storedUsername);

        if (!token) return navigate("/login");

        const response = await fetch("http://127.0.0.1:8000/message", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 401) return navigate("/login");

        const data = await response.json();
        console.log(data.text)
        setText(data.text)
        if (data.message) setMessageText(data.message);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    }

    fetchMessage();
  }, [navigate]);

  // Fetch images
  useEffect(() => {
    async function fetchImages() {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return navigate("/login");

        const response = await fetch("http://127.0.0.1:8000/all-images", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch images");

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setImages(data.files || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [navigate]);

  if (loading) return <div className="loading">Loading images...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="gallery-container">
      <h1 className="title">{messageText}</h1>
      {username && <h2 className="username">Welcome, {username}!</h2>}
      <div id="mess1">{text}</div>

      {images.length === 0 ? (
        <p className="no-images">No images available.</p>
      ) : (
        <div className="grid">
          {images.map((img, index) => (
            <div key={index} className="card">
              <img src={img.url} alt={img.key} />
              <p>{img.key}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}